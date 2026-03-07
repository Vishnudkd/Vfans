from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import asyncio
import resend
import secrets


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production-vfans-media-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Email Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@vfansmedia.com')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Initialize Resend
resend.api_key = RESEND_API_KEY

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    email_verified: bool = False
    verification_token: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    is_active: bool
    email_verified: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Organization Models
class Organization(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    logo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrganizationCreate(BaseModel):
    name: str
    logo_url: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: str
    user_id: str
    name: str
    logo_url: Optional[str] = None
    created_at: datetime

# Creator Models
class Creator(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    organization_id: str
    name: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CreatorCreate(BaseModel):
    organization_id: str
    name: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None

class CreatorUpdate(BaseModel):
    name: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None

class CreatorResponse(BaseModel):
    id: str
    user_id: str
    organization_id: str
    name: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime

# Transaction Models
class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    organization_id: str
    creator_id: str
    amount: float
    status: str  # pending, available, paid_out
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    available_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7))

class TransactionResponse(BaseModel):
    id: str
    user_id: str
    organization_id: str
    creator_id: str
    amount: float
    status: str
    created_at: datetime
    available_at: datetime

class WalletSummary(BaseModel):
    total_earned: float
    available_to_withdraw: float
    pending: float
    paid_out: float
    creators_earnings: List[dict]

# Utility Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def generate_verification_token() -> str:
    """Generate a secure random verification token"""
    return secrets.token_urlsafe(32)

async def send_verification_email(email: str, token: str, full_name: Optional[str] = None):
    """Send verification email using Resend"""
    verification_url = f"{FRONTEND_URL}/verify-email?token={token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #000000; padding: 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">VFans Media</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                                    Verify Your Email Address
                                </h2>
                                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Hi{' ' + full_name if full_name else ''},
                                </p>
                                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Thank you for signing up with VFans Media! To complete your registration and start sharing your content, please verify your email address by clicking the button below:
                                </p>
                                
                                <!-- Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="{verification_url}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-size: 16px; font-weight: bold;">
                                                Verify Email Address
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    Or copy and paste this link into your browser:
                                </p>
                                <p style="color: #0066cc; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0; word-break: break-all;">
                                    {verification_url}
                                </p>
                                
                                <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                                    This link will expire in 24 hours for security reasons.
                                </p>
                                <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 10px 0 0 0;">
                                    If you didn't create an account with VFans Media, please ignore this email.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 0;">
                                    © 2024 VFans Media LLC. All rights reserved.
                                </p>
                                <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0;">
                                    <a href="{FRONTEND_URL}/privacy-policy" style="color: #666666; text-decoration: none;">Privacy Policy</a> | 
                                    <a href="{FRONTEND_URL}/terms-of-service" style="color: #666666; text-decoration: none;">Terms of Service</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [email],
        "subject": "Verify Your Email - VFans Media",
        "html": html_content
    }
    
    try:
        # Run sync SDK in thread to keep FastAPI non-blocking
        email_response = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Verification email sent to {email}, ID: {email_response.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {email}: {str(e)}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode JWT access token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user_doc is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Convert ISO string timestamps back to datetime objects
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Authentication Routes
@api_router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """Register a new user and send verification email"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate verification token
    verification_token = generate_verification_token()
    
    # Create new user
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        email_verified=False,
        verification_token=verification_token
    )
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    # Insert user into database
    await db.users.insert_one(user_doc)
    
    # Send verification email (non-blocking)
    await send_verification_email(user.email, verification_token, user.full_name)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Prepare user response
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        email_verified=user.email_verified,
        created_at=user.created_at
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return JWT token - requires email verification"""
    # Find user by email
    user_doc = await db.users.find_one({"email": user_credentials.email}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Convert ISO string timestamps back to datetime objects
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    
    # Verify password
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Check if email is verified
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before logging in. Check your inbox for the verification link."
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Prepare user response
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        email_verified=user.email_verified,
        created_at=user.created_at
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        email_verified=current_user.email_verified,
        created_at=current_user.created_at
    )

@api_router.get("/verify-email/{token}")
async def verify_email(token: str):
    """Verify user email with token"""
    # Find user with this verification token
    user_doc = await db.users.find_one({"verification_token": token}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link"
        )
    
    # Update user to mark email as verified
    await db.users.update_one(
        {"verification_token": token},
        {
            "$set": {
                "email_verified": True,
                "verification_token": None
            }
        }
    )
    
    return {
        "status": "success",
        "message": "Email verified successfully! You can now log in to your account."
    }

@api_router.post("/resend-verification")
async def resend_verification(email: EmailStr):
    """Resend verification email"""
    # Find user by email
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ISO string timestamps back to datetime objects
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    
    # Check if already verified
    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )
    
    # Generate new verification token
    new_token = generate_verification_token()
    
    # Update user with new token
    await db.users.update_one(
        {"email": email},
        {"$set": {"verification_token": new_token}}
    )
    
    # Send verification email
    email_sent = await send_verification_email(user.email, new_token, user.full_name)
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {
        "status": "success",
        "message": "Verification email sent! Please check your inbox."
    }

# Demo User Management
@api_router.post("/demo/reset")
async def reset_demo_user():
    """Reset demo user to fresh state - for testing purposes"""
    demo_email = "demo@vfans.com"
    
    # Find demo user
    demo_user = await db.users.find_one({"email": demo_email}, {"_id": 0})
    
    if demo_user:
        user_id = demo_user['id']
        
        # Delete all creators for demo user
        await db.creators.delete_many({"user_id": user_id})
        
        # Delete organization for demo user
        await db.organizations.delete_many({"user_id": user_id})
        
        return {
            "status": "success",
            "message": "Demo user reset successfully. Ready for new onboarding flow."
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demo user not found"
        )

@api_router.post("/demo/initialize")
async def initialize_demo_user():
    """Create or reset demo user account"""
    demo_email = "demo@vfans.com"
    demo_password = "demo"
    
    # Check if demo user exists
    existing_user = await db.users.find_one({"email": demo_email})
    
    if existing_user:
        # User exists, reset their data
        user_id = existing_user['id']
        
        # Delete all creators
        await db.creators.delete_many({"user_id": user_id})
        
        # Delete organization
        await db.organizations.delete_many({"user_id": user_id})
        
        # Update user password and verify email
        await db.users.update_one(
            {"email": demo_email},
            {
                "$set": {
                    "hashed_password": get_password_hash(demo_password),
                    "email_verified": True,
                    "verification_token": None,
                    "is_active": True
                }
            }
        )
        
        return {
            "status": "success",
            "message": "Demo user reset and ready for testing",
            "email": demo_email,
            "password": demo_password
        }
    else:
        # Create new demo user
        demo_user = User(
            email=demo_email,
            hashed_password=get_password_hash(demo_password),
            full_name="Demo User",
            email_verified=True,  # Pre-verified for testing
            verification_token=None,
            is_active=True
        )
        
        # Convert to dict and serialize datetime
        user_doc = demo_user.model_dump()
        user_doc['created_at'] = user_doc['created_at'].isoformat()
        
        # Insert into database
        await db.users.insert_one(user_doc)
        
        return {
            "status": "success",
            "message": "Demo user created successfully",
            "email": demo_email,
            "password": demo_password
        }

# Organization Routes
@api_router.post("/organizations", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(org_data: OrganizationCreate, current_user: User = Depends(get_current_user)):
    """Create a new organization"""
    # Check if user already has an organization
    existing_org = await db.organizations.find_one({"user_id": current_user.id})
    if existing_org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an organization. Each user can only create one organization."
        )
    
    # Create organization
    organization = Organization(
        user_id=current_user.id,
        name=org_data.name,
        logo_url=org_data.logo_url
    )
    
    # Convert to dict and serialize datetime
    org_doc = organization.model_dump()
    org_doc['created_at'] = org_doc['created_at'].isoformat()
    
    # Insert into database
    await db.organizations.insert_one(org_doc)
    
    return OrganizationResponse(**organization.model_dump())

@api_router.get("/organizations", response_model=OrganizationResponse)
async def get_organization(current_user: User = Depends(get_current_user)):
    """Get user's organization"""
    org_doc = await db.organizations.find_one({"user_id": current_user.id}, {"_id": 0})
    
    if not org_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No organization found. Please create one first."
        )
    
    # Convert ISO string timestamps back to datetime
    if isinstance(org_doc.get('created_at'), str):
        org_doc['created_at'] = datetime.fromisoformat(org_doc['created_at'])
    
    return OrganizationResponse(**org_doc)

# Creator Routes
@api_router.post("/creators", response_model=CreatorResponse, status_code=status.HTTP_201_CREATED)
async def create_creator(creator_data: CreatorCreate, current_user: User = Depends(get_current_user)):
    """Create a new creator profile"""
    # Verify organization exists and belongs to user
    org_doc = await db.organizations.find_one({
        "id": creator_data.organization_id,
        "user_id": current_user.id
    })
    
    if not org_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found or doesn't belong to you"
        )
    
    # Create creator
    creator = Creator(
        user_id=current_user.id,
        organization_id=creator_data.organization_id,
        name=creator_data.name,
        profile_picture=creator_data.profile_picture,
        bio=creator_data.bio
    )
    
    # Convert to dict and serialize datetime
    creator_doc = creator.model_dump()
    creator_doc['created_at'] = creator_doc['created_at'].isoformat()
    
    # Insert into database
    await db.creators.insert_one(creator_doc)
    
    return CreatorResponse(**creator.model_dump())

@api_router.get("/creators", response_model=List[CreatorResponse])
async def get_creators(current_user: User = Depends(get_current_user)):
    """Get all creator profiles for current user"""
    creators = await db.creators.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime
    for creator in creators:
        if isinstance(creator.get('created_at'), str):
            creator['created_at'] = datetime.fromisoformat(creator['created_at'])
    
    return [CreatorResponse(**creator) for creator in creators]

@api_router.get("/creators/{creator_id}", response_model=CreatorResponse)
async def get_creator(creator_id: str, current_user: User = Depends(get_current_user)):
    """Get specific creator profile"""
    creator_doc = await db.creators.find_one({
        "id": creator_id,
        "user_id": current_user.id
    }, {"_id": 0})
    
    if not creator_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creator not found"
        )
    
    # Convert ISO string timestamps back to datetime
    if isinstance(creator_doc.get('created_at'), str):
        creator_doc['created_at'] = datetime.fromisoformat(creator_doc['created_at'])
    
    return CreatorResponse(**creator_doc)

@api_router.put("/creators/{creator_id}", response_model=CreatorResponse)
async def update_creator(creator_id: str, creator_data: CreatorUpdate, current_user: User = Depends(get_current_user)):
    """Update creator profile"""
    # Verify creator exists and belongs to user
    creator_doc = await db.creators.find_one({
        "id": creator_id,
        "user_id": current_user.id
    }, {"_id": 0})
    
    if not creator_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creator not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in creator_data.model_dump().items() if v is not None}
    
    if update_data:
        await db.creators.update_one(
            {"id": creator_id},
            {"$set": update_data}
        )
    
    # Get updated creator
    updated_creator = await db.creators.find_one({"id": creator_id}, {"_id": 0})
    
    # Convert ISO string timestamps back to datetime
    if isinstance(updated_creator.get('created_at'), str):
        updated_creator['created_at'] = datetime.fromisoformat(updated_creator['created_at'])
    
    return CreatorResponse(**updated_creator)

@api_router.delete("/creators/{creator_id}")
async def delete_creator(creator_id: str, current_user: User = Depends(get_current_user)):
    """Delete creator profile"""
    result = await db.creators.delete_one({
        "id": creator_id,
        "user_id": current_user.id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creator not found"
        )
    
    return {
        "status": "success",
        "message": "Creator profile deleted successfully"
    }

# Wallet Routes
@api_router.get("/wallet", response_model=WalletSummary)
async def get_wallet(current_user: User = Depends(get_current_user)):
    """Get wallet summary for organization"""
    # Get user's organization
    org_doc = await db.organizations.find_one({"user_id": current_user.id}, {"_id": 0})
    
    if not org_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No organization found"
        )
    
    # Get all creators under this organization
    creators = await db.creators.find({
        "user_id": current_user.id,
        "organization_id": org_doc['id']
    }, {"_id": 0}).to_list(1000)
    
    # Get all transactions for this organization
    transactions = await db.transactions.find({
        "user_id": current_user.id,
        "organization_id": org_doc['id']
    }, {"_id": 0}).to_list(1000)
    
    # Calculate totals
    total_earned = 0.0
    available_to_withdraw = 0.0
    pending = 0.0
    paid_out = 0.0
    
    current_time = datetime.now(timezone.utc)
    
    for txn in transactions:
        amount = txn.get('amount', 0.0)
        total_earned += amount
        
        # Parse dates
        available_at = txn.get('available_at')
        if isinstance(available_at, str):
            available_at = datetime.fromisoformat(available_at)
        
        txn_status = txn.get('status', 'pending')
        
        if txn_status == 'paid_out':
            paid_out += amount
        elif txn_status == 'available' or (available_at and current_time >= available_at):
            available_to_withdraw += amount
        else:
            pending += amount
    
    # Calculate per-creator earnings
    creators_earnings = []
    for creator in creators:
        creator_id = creator['id']
        creator_txns = [t for t in transactions if t.get('creator_id') == creator_id]
        creator_total = sum(t.get('amount', 0.0) for t in creator_txns)
        
        creators_earnings.append({
            "creator_id": creator_id,
            "creator_name": creator.get('name', 'Unknown'),
            "creator_picture": creator.get('profile_picture'),
            "total_earned": creator_total,
            "transaction_count": len(creator_txns)
        })
    
    return WalletSummary(
        total_earned=total_earned,
        available_to_withdraw=available_to_withdraw,
        pending=pending,
        paid_out=paid_out,
        creators_earnings=creators_earnings
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()