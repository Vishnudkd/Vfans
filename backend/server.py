from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
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
import shutil
from PIL import Image, ImageFilter
import stripe

# Initialize Stripe
stripe.api_key = None  # Will be set after loading env


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

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

# Stripe Configuration
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
stripe.api_key = STRIPE_SECRET_KEY

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

# Link Models
class Link(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    organization_id: str
    creator_id: str
    title: str
    description: Optional[str] = None
    price: float
    file_url: str  # Path to uploaded file
    file_type: str  # image, video, audio, pdf
    preview_url: Optional[str] = None  # Blurred preview
    blur_level: str = "medium"  # blur, low, medium, high, extreme
    short_link: str  # Custom slug
    fee_applies_to: str = "seller"  # seller, split, buyer
    single_purchase: bool = False
    is_active: bool = True
    views: int = 0
    purchases: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LinkCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    file_url: str
    file_type: str
    preview_url: Optional[str] = None
    blur_level: str = "medium"
    short_link: str
    fee_applies_to: str = "seller"
    single_purchase: bool = False

class LinkResponse(BaseModel):
    id: str
    user_id: str
    organization_id: str
    creator_id: str
    title: str
    description: Optional[str] = None
    price: float
    file_url: str
    file_type: str
    preview_url: Optional[str] = None
    blur_level: str
    short_link: str
    fee_applies_to: str
    single_purchase: bool
    is_active: bool
    views: int
    purchases: int
    created_at: datetime

# Customer Models
class Customer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomerResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: datetime

# Purchase Models
class Purchase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    link_id: str
    creator_id: str
    amount: float
    stripe_session_id: str
    status: str  # completed, pending, failed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PurchaseResponse(BaseModel):
    id: str
    customer_id: str
    link_id: str
    creator_id: str
    amount: float
    status: str
    created_at: datetime

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

def generate_blur_preview(image_path: Path, output_path: Path, blur_level: str = "medium"):
    """Generate blurred preview image"""
    try:
        # Blur level mapping
        blur_radius_map = {
            "blur": 5,
            "low": 10,
            "medium": 20,
            "high": 30,
            "extreme": 50
        }
        
        blur_radius = blur_radius_map.get(blur_level, 20)
        
        # Open and blur image
        img = Image.open(image_path)
        
        # Resize if too large (max 1920px width)
        if img.width > 1920:
            ratio = 1920 / img.width
            new_size = (1920, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Apply blur
        blurred = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))
        
        # Save as JPEG
        blurred.convert('RGB').save(output_path, 'JPEG', quality=85)
        return True
    except Exception as e:
        logger.error(f"Failed to generate blur preview: {str(e)}")
        return False

def save_upload_file(upload_file: UploadFile, destination: Path) -> bool:
    """Save uploaded file to destination"""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return True
    except Exception as e:
        logger.error(f"Failed to save upload file: {str(e)}")
        return False

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

# File Upload Routes
@api_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    creator_id: str = None,
    blur_level: str = "medium",
    current_user: User = Depends(get_current_user)
):
    """Upload file and generate preview"""
    # Validate file type
    allowed_types = {
        "image": ["image/jpeg", "image/png", "image/gif", "image/webp"],
        "video": ["video/mp4", "video/quicktime", "video/x-msvideo"],
        "audio": ["audio/mpeg", "audio/wav", "audio/ogg"],
        "pdf": ["application/pdf"]
    }
    
    file_type = None
    for type_name, mime_types in allowed_types.items():
        if file.content_type in mime_types:
            file_type = type_name
            break
    
    if not file_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}"
        )
    
    # Create directory structure
    file_id = str(uuid.uuid4())
    user_dir = UPLOAD_DIR / current_user.id
    if creator_id:
        user_dir = user_dir / creator_id
    user_dir = user_dir / file_id
    user_dir.mkdir(parents=True, exist_ok=True)
    
    # Get file extension
    file_extension = Path(file.filename).suffix
    file_path = user_dir / f"original{file_extension}"
    
    # Save file
    if not save_upload_file(file, file_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save file"
        )
    
    # Generate preview for images
    preview_url = None
    if file_type == "image":
        preview_path = user_dir / "preview_blurred.jpg"
        if generate_blur_preview(file_path, preview_path, blur_level):
            preview_url = f"/uploads/{current_user.id}/{creator_id or ''}/{file_id}/preview_blurred.jpg"
    
    file_url = f"/uploads/{current_user.id}/{creator_id or ''}/{file_id}/original{file_extension}"
    
    return {
        "status": "success",
        "file_id": file_id,
        "file_url": file_url,
        "file_type": file_type,
        "preview_url": preview_url,
        "blur_level": blur_level
    }

# Link Management Routes
@api_router.post("/creators/{creator_id}/links", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
async def create_link(creator_id: str, link_data: LinkCreate, current_user: User = Depends(get_current_user)):
    """Create a new link for creator"""
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
    
    # Get organization
    org_doc = await db.organizations.find_one({"user_id": current_user.id}, {"_id": 0})
    if not org_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if short_link is unique
    existing_link = await db.links.find_one({"short_link": link_data.short_link})
    if existing_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Short link already exists. Please choose a different one."
        )
    
    # Create link
    link = Link(
        user_id=current_user.id,
        organization_id=org_doc['id'],
        creator_id=creator_id,
        title=link_data.title,
        description=link_data.description,
        price=link_data.price,
        file_url=link_data.file_url,
        file_type=link_data.file_type,
        preview_url=link_data.preview_url,
        blur_level=link_data.blur_level,
        short_link=link_data.short_link,
        fee_applies_to=link_data.fee_applies_to,
        single_purchase=link_data.single_purchase
    )
    
    # Convert to dict and serialize datetime
    link_doc = link.model_dump()
    link_doc['created_at'] = link_doc['created_at'].isoformat()
    
    # Insert into database
    await db.links.insert_one(link_doc)
    
    return LinkResponse(**link.model_dump())

@api_router.get("/creators/{creator_id}/links", response_model=List[LinkResponse])
async def get_creator_links(creator_id: str, current_user: User = Depends(get_current_user)):
    """Get all links for a creator"""
    # Verify creator belongs to user
    creator_doc = await db.creators.find_one({
        "id": creator_id,
        "user_id": current_user.id
    })
    
    if not creator_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Creator not found"
        )
    
    # Get all links for this creator
    links = await db.links.find({"creator_id": creator_id}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime
    for link in links:
        if isinstance(link.get('created_at'), str):
            link['created_at'] = datetime.fromisoformat(link['created_at'])
    
    return [LinkResponse(**link) for link in links]

@api_router.get("/links/{link_id}", response_model=LinkResponse)
async def get_link(link_id: str):
    """Get a specific link by ID (public endpoint)"""
    link_doc = await db.links.find_one({"id": link_id}, {"_id": 0})
    
    if not link_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    # Convert ISO string timestamps back to datetime
    if isinstance(link_doc.get('created_at'), str):
        link_doc['created_at'] = datetime.fromisoformat(link_doc['created_at'])
    
    # Increment view count
    await db.links.update_one(
        {"id": link_id},
        {"$inc": {"views": 1}}
    )
    
    return LinkResponse(**link_doc)

@api_router.put("/creators/{creator_id}/links/{link_id}", response_model=LinkResponse)
async def update_link(creator_id: str, link_id: str, link_data: LinkCreate, current_user: User = Depends(get_current_user)):
    """Update a link"""
    # Verify link exists and belongs to user
    link_doc = await db.links.find_one({
        "id": link_id,
        "creator_id": creator_id,
        "user_id": current_user.id
    })
    
    if not link_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    # Update link
    update_data = link_data.model_dump()
    await db.links.update_one(
        {"id": link_id},
        {"$set": update_data}
    )
    
    # Get updated link
    updated_link = await db.links.find_one({"id": link_id}, {"_id": 0})
    
    # Convert ISO string timestamps back to datetime
    if isinstance(updated_link.get('created_at'), str):
        updated_link['created_at'] = datetime.fromisoformat(updated_link['created_at'])
    
    return LinkResponse(**updated_link)

@api_router.delete("/creators/{creator_id}/links/{link_id}")
async def delete_link(creator_id: str, link_id: str, current_user: User = Depends(get_current_user)):
    """Delete a link"""
    result = await db.links.delete_one({
        "id": link_id,
        "creator_id": creator_id,
        "user_id": current_user.id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    return {
        "status": "success",
        "message": "Link deleted successfully"
    }

@api_router.patch("/creators/{creator_id}/links/{link_id}/toggle")
async def toggle_link_status(creator_id: str, link_id: str, current_user: User = Depends(get_current_user)):
    """Toggle link active status"""
    link_doc = await db.links.find_one({
        "id": link_id,
        "creator_id": creator_id,
        "user_id": current_user.id
    })
    
    if not link_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    # Toggle is_active
    new_status = not link_doc.get('is_active', True)
    await db.links.update_one(
        {"id": link_id},
        {"$set": {"is_active": new_status}}
    )
    
    return {
        "status": "success",
        "is_active": new_status
    }

# Stripe Payment Routes
@api_router.post("/links/{link_id}/checkout")
async def create_checkout_session(link_id: str):
    """Create Stripe checkout session for link purchase"""
    # Get link
    link_doc = await db.links.find_one({"id": link_id}, {"_id": 0})
    
    if not link_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    if not link_doc.get('is_active'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This link is not currently available"
        )
    
    # Get creator info
    creator_doc = await db.creators.find_one({"id": link_doc['creator_id']}, {"_id": 0})
    
    try:
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': link_doc['title'],
                        'description': link_doc.get('description', ''),
                        'images': [f"{FRONTEND_URL}{link_doc['preview_url']}"] if link_doc.get('preview_url') else [],
                    },
                    'unit_amount': int(link_doc['price'] * 100),  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{FRONTEND_URL}/purchase/success?session_id={{CHECKOUT_SESSION_ID}}&link_id={link_id}",
            cancel_url=f"{FRONTEND_URL}/l/{link_doc['short_link']}?canceled=true",
            metadata={
                'link_id': link_id,
                'creator_id': link_doc['creator_id'],
                'user_id': link_doc['user_id'],
                'organization_id': link_doc['organization_id']
            }
        )
        
        return {
            "sessionId": session.id,
            "url": session.url
        }
    except Exception as e:
        logger.error(f"Failed to create checkout session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create checkout session"
        )

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    # For development, we'll process without signature verification
    # In production, you should verify the webhook signature
    try:
        event = stripe.Event.construct_from(
            stripe.util.json.loads(payload), stripe.api_key
        )
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Get metadata
        link_id = session['metadata'].get('link_id')
        creator_id = session['metadata'].get('creator_id')
        user_id = session['metadata'].get('user_id')
        organization_id = session['metadata'].get('organization_id')
        
        # Get customer email
        customer_email = session['customer_details']['email']
        customer_name = session['customer_details'].get('name')
        
        # Create or get customer
        customer_doc = await db.customers.find_one({"email": customer_email}, {"_id": 0})
        if not customer_doc:
            customer = Customer(
                email=customer_email,
                name=customer_name
            )
            customer_dict = customer.model_dump()
            customer_dict['created_at'] = customer_dict['created_at'].isoformat()
            await db.customers.insert_one(customer_dict)
            customer_id = customer.id
        else:
            customer_id = customer_doc['id']
        
        # Create purchase record
        purchase = Purchase(
            customer_id=customer_id,
            link_id=link_id,
            creator_id=creator_id,
            amount=session['amount_total'] / 100,  # Convert from cents
            stripe_session_id=session['id'],
            status='completed'
        )
        purchase_dict = purchase.model_dump()
        purchase_dict['created_at'] = purchase_dict['created_at'].isoformat()
        await db.purchases.insert_one(purchase_dict)
        
        # Create transaction (80% to creator)
        creator_amount = (session['amount_total'] / 100) * 0.8
        transaction = Transaction(
            user_id=user_id,
            organization_id=organization_id,
            creator_id=creator_id,
            amount=creator_amount,
            status='pending'  # Will be available after 7 days
        )
        transaction_dict = transaction.model_dump()
        transaction_dict['created_at'] = transaction_dict['created_at'].isoformat()
        transaction_dict['available_at'] = transaction_dict['available_at'].isoformat()
        await db.transactions.insert_one(transaction_dict)
        
        # Update link purchase count
        await db.links.update_one(
            {"id": link_id},
            {"$inc": {"purchases": 1}}
        )
        
        logger.info(f"Payment completed for link {link_id} by {customer_email}")
    
    return {"status": "success"}

@api_router.get("/purchases/verify/{session_id}")
async def verify_purchase(session_id: str):
    """Verify purchase and get access to content"""
    # Find purchase by session ID
    purchase_doc = await db.purchases.find_one({"stripe_session_id": session_id}, {"_id": 0})
    
    if not purchase_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase not found"
        )
    
    # Get link details
    link_doc = await db.links.find_one({"id": purchase_doc['link_id']}, {"_id": 0})
    
    if not link_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found"
        )
    
    return {
        "status": "success",
        "purchase": purchase_doc,
        "link": {
            "title": link_doc['title'],
            "file_url": link_doc['file_url'],
            "file_type": link_doc['file_type']
        }
    }

# Include the router in the main app
app.include_router(api_router)

# Mount uploads directory for serving files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

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