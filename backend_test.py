#!/usr/bin/env python3
"""
VFans Media Backend Authentication API Testing
Tests for User Signup, Login, JWT Token validation, and Current User endpoints
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Optional
import jwt
import re

# Backend API base URL from frontend .env
BASE_URL = "https://vfans-build.preview.emergentagent.com/api"

class VFansAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.auth_token = None
        self.test_user_data = {
            "email": "jane.doe@vfanstest.com",
            "password": "SecurePass123!",
            "full_name": "Jane Doe"
        }
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test result with timestamp"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"    Details: {json.dumps(details, indent=2)}")
    
    def test_signup_api(self):
        """Test User Signup API Endpoint - POST /api/signup"""
        print("\n=== Testing User Signup API ===")
        
        # Test 1: Successful signup with valid data
        try:
            response = requests.post(
                f"{self.base_url}/signup",
                json=self.test_user_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 201:
                data = response.json()
                
                # Validate response structure
                required_fields = ["access_token", "token_type", "user"]
                user_fields = ["id", "email", "full_name", "is_active", "created_at"]
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("Signup Valid Data", False, f"Missing fields in response: {missing_fields}", {"response": data})
                    return
                
                user_missing = [field for field in user_fields if field not in data["user"]]
                if user_missing:
                    self.log_result("Signup Valid Data", False, f"Missing user fields: {user_missing}", {"response": data})
                    return
                
                # Validate data types and values
                if (data["token_type"] == "bearer" and 
                    isinstance(data["access_token"], str) and len(data["access_token"]) > 0 and
                    data["user"]["email"] == self.test_user_data["email"] and
                    data["user"]["full_name"] == self.test_user_data["full_name"] and
                    data["user"]["is_active"] == True):
                    
                    self.auth_token = data["access_token"]  # Store for later tests
                    self.log_result("Signup Valid Data", True, "User registered successfully with correct response structure")
                else:
                    self.log_result("Signup Valid Data", False, "Response data validation failed", {"response": data})
            else:
                self.log_result("Signup Valid Data", False, f"Expected status 201, got {response.status_code}", 
                               {"response_text": response.text, "status_code": response.status_code})
                
        except requests.RequestException as e:
            self.log_result("Signup Valid Data", False, f"Request failed: {str(e)}")
        
        # Test 2: Duplicate email rejection
        try:
            response = requests.post(
                f"{self.base_url}/signup",
                json=self.test_user_data,  # Same email as before
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 400:
                data = response.json()
                if "already registered" in data.get("detail", "").lower() or "email" in data.get("detail", "").lower():
                    self.log_result("Signup Duplicate Email", True, "Correctly rejected duplicate email with 400 error")
                else:
                    self.log_result("Signup Duplicate Email", False, f"Wrong error message for duplicate email", {"response": data})
            else:
                self.log_result("Signup Duplicate Email", False, f"Expected status 400 for duplicate email, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Signup Duplicate Email", False, f"Request failed: {str(e)}")
        
        # Test 3: Invalid email format
        try:
            invalid_data = self.test_user_data.copy()
            invalid_data["email"] = "invalid-email-format"
            
            response = requests.post(
                f"{self.base_url}/signup",
                json=invalid_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code in [400, 422]:  # FastAPI typically returns 422 for validation errors
                self.log_result("Signup Invalid Email", True, f"Correctly rejected invalid email format with status {response.status_code}")
            else:
                self.log_result("Signup Invalid Email", False, f"Expected status 400/422 for invalid email, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Signup Invalid Email", False, f"Request failed: {str(e)}")
        
        # Test 4: Missing required fields
        try:
            incomplete_data = {"email": "test@example.com"}  # Missing password
            
            response = requests.post(
                f"{self.base_url}/signup",
                json=incomplete_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code in [400, 422]:
                self.log_result("Signup Missing Fields", True, f"Correctly rejected missing required fields with status {response.status_code}")
            else:
                self.log_result("Signup Missing Fields", False, f"Expected status 400/422 for missing fields, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Signup Missing Fields", False, f"Request failed: {str(e)}")
    
    def test_login_api(self):
        """Test User Login API Endpoint - POST /api/login"""
        print("\n=== Testing User Login API ===")
        
        # Test 1: Successful login with correct credentials
        try:
            login_data = {
                "email": self.test_user_data["email"],
                "password": self.test_user_data["password"]
            }
            
            response = requests.post(
                f"{self.base_url}/login",
                json=login_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure (same as signup)
                required_fields = ["access_token", "token_type", "user"]
                user_fields = ["id", "email", "full_name", "is_active", "created_at"]
                
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    self.log_result("Login Valid Credentials", False, f"Missing fields in response: {missing_fields}", {"response": data})
                    return
                
                user_missing = [field for field in user_fields if field not in data["user"]]
                if user_missing:
                    self.log_result("Login Valid Credentials", False, f"Missing user fields: {user_missing}", {"response": data})
                    return
                
                # Validate data and store token for /me endpoint test
                if (data["token_type"] == "bearer" and 
                    isinstance(data["access_token"], str) and len(data["access_token"]) > 0 and
                    data["user"]["email"] == self.test_user_data["email"]):
                    
                    self.auth_token = data["access_token"]  # Store for /me test
                    self.log_result("Login Valid Credentials", True, "Login successful with correct response structure")
                else:
                    self.log_result("Login Valid Credentials", False, "Login response validation failed", {"response": data})
            else:
                self.log_result("Login Valid Credentials", False, f"Expected status 200, got {response.status_code}", 
                               {"response_text": response.text, "status_code": response.status_code})
                
        except requests.RequestException as e:
            self.log_result("Login Valid Credentials", False, f"Request failed: {str(e)}")
        
        # Test 2: Wrong password
        try:
            wrong_password_data = {
                "email": self.test_user_data["email"],
                "password": "WrongPassword123"
            }
            
            response = requests.post(
                f"{self.base_url}/login",
                json=wrong_password_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 401:
                self.log_result("Login Wrong Password", True, "Correctly rejected wrong password with 401 error")
            else:
                self.log_result("Login Wrong Password", False, f"Expected status 401 for wrong password, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Login Wrong Password", False, f"Request failed: {str(e)}")
        
        # Test 3: Non-existent user
        try:
            nonexistent_data = {
                "email": "nonexistent@example.com",
                "password": "SomePassword123"
            }
            
            response = requests.post(
                f"{self.base_url}/login",
                json=nonexistent_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 401:
                self.log_result("Login Nonexistent User", True, "Correctly rejected non-existent user with 401 error")
            else:
                self.log_result("Login Nonexistent User", False, f"Expected status 401 for non-existent user, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Login Nonexistent User", False, f"Request failed: {str(e)}")
        
        # Test 4: Missing fields
        try:
            incomplete_data = {"email": self.test_user_data["email"]}  # Missing password
            
            response = requests.post(
                f"{self.base_url}/login",
                json=incomplete_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code in [400, 422]:
                self.log_result("Login Missing Fields", True, f"Correctly rejected missing fields with status {response.status_code}")
            else:
                self.log_result("Login Missing Fields", False, f"Expected status 400/422 for missing fields, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Login Missing Fields", False, f"Request failed: {str(e)}")
    
    def test_current_user_api(self):
        """Test Get Current User Endpoint - GET /api/me"""
        print("\n=== Testing Get Current User API ===")
        
        if not self.auth_token:
            self.log_result("Get Current User", False, "No auth token available - login test must have failed")
            return
        
        # Test 1: Valid token
        try:
            headers = {
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/me",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["id", "email", "full_name", "is_active", "created_at"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result("Get Current User Valid Token", False, f"Missing fields: {missing_fields}", {"response": data})
                elif data["email"] == self.test_user_data["email"]:
                    self.log_result("Get Current User Valid Token", True, "Successfully retrieved current user data")
                else:
                    self.log_result("Get Current User Valid Token", False, "User data mismatch", {"response": data})
            else:
                self.log_result("Get Current User Valid Token", False, f"Expected status 200, got {response.status_code}", 
                               {"response_text": response.text})
                
        except requests.RequestException as e:
            self.log_result("Get Current User Valid Token", False, f"Request failed: {str(e)}")
        
        # Test 2: No token
        try:
            response = requests.get(
                f"{self.base_url}/me",
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code in [401, 403, 422]:  # FastAPI might return 422 for missing auth
                self.log_result("Get Current User No Token", True, f"Correctly rejected request without token (status {response.status_code})")
            else:
                self.log_result("Get Current User No Token", False, f"Expected status 401/403/422 without token, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Get Current User No Token", False, f"Request failed: {str(e)}")
        
        # Test 3: Invalid token
        try:
            headers = {
                "Authorization": "Bearer invalid_token_here",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/me",
                headers=headers,
                timeout=30
            )
            
            if response.status_code in [401, 403]:
                self.log_result("Get Current User Invalid Token", True, f"Correctly rejected invalid token (status {response.status_code})")
            else:
                self.log_result("Get Current User Invalid Token", False, f"Expected status 401/403 for invalid token, got {response.status_code}", 
                               {"response_text": response.text})
        except requests.RequestException as e:
            self.log_result("Get Current User Invalid Token", False, f"Request failed: {str(e)}")
    
    def test_jwt_token_validation(self):
        """Test JWT Token Validation"""
        print("\n=== Testing JWT Token Validation ===")
        
        if not self.auth_token:
            self.log_result("JWT Token Validation", False, "No auth token available for validation")
            return
        
        try:
            # Test 1: JWT format validation
            jwt_pattern = r'^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$'
            if re.match(jwt_pattern, self.auth_token):
                self.log_result("JWT Token Format", True, "Token has valid JWT format (header.payload.signature)")
            else:
                self.log_result("JWT Token Format", False, "Token does not match JWT format", {"token_preview": self.auth_token[:50]})
                return
            
            # Test 2: Decode JWT without verification (to check structure)
            try:
                # Decode without verification to check payload structure
                payload = jwt.decode(self.auth_token, options={"verify_signature": False})
                
                # Check for required JWT claims
                required_claims = ["exp", "sub"]  # expiration and subject (user ID)
                missing_claims = [claim for claim in required_claims if claim not in payload]
                
                if missing_claims:
                    self.log_result("JWT Token Claims", False, f"Missing required claims: {missing_claims}", {"payload": payload})
                else:
                    self.log_result("JWT Token Claims", True, "Token contains required claims (exp, sub)")
                
                # Test 3: Check expiration
                import time
                current_time = time.time()
                exp_time = payload.get("exp", 0)
                
                if exp_time > current_time:
                    days_valid = (exp_time - current_time) / (24 * 60 * 60)
                    self.log_result("JWT Token Expiration", True, f"Token is valid for {days_valid:.1f} more days")
                else:
                    self.log_result("JWT Token Expiration", False, "Token has expired")
                
                # Test 4: User ID validation  
                user_id = payload.get("sub")
                if user_id and isinstance(user_id, str) and len(user_id) > 0:
                    self.log_result("JWT User ID", True, f"Token contains valid user ID in 'sub' field")
                else:
                    self.log_result("JWT User ID", False, "Token missing or invalid user ID", {"sub": user_id})
                    
            except jwt.DecodeError:
                self.log_result("JWT Token Decode", False, "Failed to decode JWT token")
            
        except Exception as e:
            self.log_result("JWT Token Validation", False, f"JWT validation failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all authentication tests in the correct order"""
        print(f"\n🚀 Starting VFans Media Backend Authentication Tests")
        print(f"📍 Testing against: {self.base_url}")
        print(f"👤 Test user: {self.test_user_data['email']}")
        print("=" * 60)
        
        # Test in order: signup -> login -> /me -> JWT validation
        self.test_signup_api()
        self.test_login_api() 
        self.test_current_user_api()
        self.test_jwt_token_validation()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = sum(1 for result in self.test_results if not result["success"])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Total:  {total}")
        
        if failed > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")
        
        # Critical issues check
        critical_failures = []
        for result in self.test_results:
            if not result["success"] and any(critical in result["test"].lower() for critical in 
                ["signup valid data", "login valid credentials", "get current user valid token"]):
                critical_failures.append(result["test"])
        
        if critical_failures:
            print(f"\n🔴 CRITICAL FAILURES (core functionality broken):")
            for failure in critical_failures:
                print(f"   • {failure}")
        
        success_rate = (passed / total * 100) if total > 0 else 0
        print(f"\n📊 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Backend authentication system is working well!")
        elif success_rate >= 60:
            print("⚠️  Backend authentication has some issues but core functionality works")
        else:
            print("🔴 Backend authentication system has significant issues")


def main():
    """Main test execution"""
    tester = VFansAPITester()
    tester.run_all_tests()
    
    # Return results for potential parsing
    return tester.test_results


if __name__ == "__main__":
    main()