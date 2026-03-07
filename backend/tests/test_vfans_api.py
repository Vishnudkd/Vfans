"""
VFans Media API Tests
Tests for: Demo user, Login, Organizations, Creators, Links, Wallet, Checkout
"""
import pytest
import requests
import os
import time

# Use the public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://payment-flow-165.preview.emergentagent.com').rstrip('/')

# Test data storage
test_data = {
    "token": None,
    "user_id": None,
    "organization_id": None,
    "creator_id": None,
    "link_id": None,
    "short_link": f"test-photo-set-{int(time.time())}"  # Unique short link
}


class TestHealthAndDemo:
    """Test health endpoints and demo user initialization"""
    
    def test_01_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root response: {data}")
    
    def test_02_initialize_demo_user(self):
        """Initialize demo user for testing"""
        response = requests.post(f"{BASE_URL}/api/demo/initialize")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["email"] == "demo@vfans.com"
        assert data["password"] == "demo"
        print(f"Demo user initialized: {data}")


class TestAuthentication:
    """Test login flow with demo user"""
    
    def test_03_login_demo_user(self):
        """Login with demo@vfans.com / demo"""
        response = requests.post(f"{BASE_URL}/api/login", json={
            "email": "demo@vfans.com",
            "password": "demo"
        })
        assert response.status_code == 200
        data = response.json()
        
        # Data assertions
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == "demo@vfans.com"
        assert data["user"]["email_verified"] == True
        
        # Store token for subsequent tests
        test_data["token"] = data["access_token"]
        test_data["user_id"] = data["user"]["id"]
        print(f"Login successful, user_id: {test_data['user_id']}")
    
    def test_04_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print(f"Invalid login correctly rejected: {data}")
    
    def test_05_get_me(self):
        """Test /api/me endpoint with valid token"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.get(f"{BASE_URL}/api/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "demo@vfans.com"
        print(f"Get me response: {data}")


class TestOrganizations:
    """Test organization CRUD operations"""
    
    def test_06_create_organization(self):
        """Create a new organization"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.post(f"{BASE_URL}/api/organizations", 
            headers=headers,
            json={"name": "Test Organization", "logo_url": None}
        )
        assert response.status_code == 201
        data = response.json()
        
        # Data assertions
        assert data["name"] == "Test Organization"
        assert "id" in data
        assert data["user_id"] == test_data["user_id"]
        
        test_data["organization_id"] = data["id"]
        print(f"Organization created: {data['id']}")
    
    def test_07_get_organization(self):
        """Get user's organization"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.get(f"{BASE_URL}/api/organizations", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify data persisted correctly
        assert data["id"] == test_data["organization_id"]
        assert data["name"] == "Test Organization"
        print(f"Organization retrieved: {data}")
    
    def test_08_create_duplicate_organization(self):
        """Test that user cannot create duplicate organization"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.post(f"{BASE_URL}/api/organizations",
            headers=headers,
            json={"name": "Another Organization"}
        )
        assert response.status_code == 400
        data = response.json()
        assert "already have an organization" in data["detail"].lower()
        print(f"Duplicate org correctly rejected: {data}")


class TestCreators:
    """Test creator profile CRUD operations"""
    
    def test_09_create_creator(self):
        """Create a new creator profile"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.post(f"{BASE_URL}/api/creators",
            headers=headers,
            json={
                "organization_id": test_data["organization_id"],
                "name": "Test Creator",
                "bio": "A test creator for API testing",
                "profile_picture": None
            }
        )
        assert response.status_code == 201
        data = response.json()
        
        # Data assertions
        assert data["name"] == "Test Creator"
        assert data["organization_id"] == test_data["organization_id"]
        assert "id" in data
        
        test_data["creator_id"] = data["id"]
        print(f"Creator created: {data['id']}")
    
    def test_10_get_creators(self):
        """Get all creators for user"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.get(f"{BASE_URL}/api/creators", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Find our test creator
        creator = next((c for c in data if c["id"] == test_data["creator_id"]), None)
        assert creator is not None
        assert creator["name"] == "Test Creator"
        print(f"Retrieved {len(data)} creator(s)")
    
    def test_11_get_single_creator(self):
        """Get a specific creator by ID"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.get(f"{BASE_URL}/api/creators/{test_data['creator_id']}", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == test_data["creator_id"]
        assert data["name"] == "Test Creator"
        print(f"Creator retrieved: {data}")
    
    def test_12_update_creator(self):
        """Update creator profile"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.put(f"{BASE_URL}/api/creators/{test_data['creator_id']}",
            headers=headers,
            json={"name": "Updated Test Creator", "bio": "Updated bio"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "Updated Test Creator"
        assert data["bio"] == "Updated bio"
        
        # Verify update persisted via GET
        get_response = requests.get(f"{BASE_URL}/api/creators/{test_data['creator_id']}", headers=headers)
        get_data = get_response.json()
        assert get_data["name"] == "Updated Test Creator"
        print(f"Creator updated: {data}")


class TestLinks:
    """Test link management endpoints"""
    
    def test_13_create_link(self):
        """Create a new paid link"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.post(f"{BASE_URL}/api/creators/{test_data['creator_id']}/links",
            headers=headers,
            json={
                "title": "Test Photo Set",
                "description": "A test photo set for API testing",
                "price": 9.99,
                "file_url": "/uploads/test/dummy.jpg",  # Dummy URL for testing
                "file_type": "image",
                "preview_url": "/uploads/test/preview.jpg",
                "blur_level": "medium",
                "short_link": test_data["short_link"],
                "fee_applies_to": "seller",
                "single_purchase": False
            }
        )
        assert response.status_code == 201
        data = response.json()
        
        # Data assertions
        assert data["title"] == "Test Photo Set"
        assert data["price"] == 9.99
        assert data["short_link"] == test_data["short_link"]
        assert data["is_active"] == True
        assert "id" in data
        
        test_data["link_id"] = data["id"]
        print(f"Link created: {data['id']}, short_link: {data['short_link']}")
    
    def test_14_get_creator_links(self):
        """Get all links for a creator"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.get(f"{BASE_URL}/api/creators/{test_data['creator_id']}/links", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Find our test link
        link = next((l for l in data if l["id"] == test_data["link_id"]), None)
        assert link is not None
        assert link["title"] == "Test Photo Set"
        print(f"Retrieved {len(data)} link(s)")
    
    def test_15_get_link_by_slug_public(self):
        """Get link by short_link slug (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/links/by-slug/{test_data['short_link']}")
        assert response.status_code == 200
        data = response.json()
        
        assert data["short_link"] == test_data["short_link"]
        assert data["title"] == "Test Photo Set"
        assert data["price"] == 9.99
        print(f"Public link retrieval successful: {data['title']}")
    
    def test_16_get_link_by_id_public(self):
        """Get link by ID (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/links/{test_data['link_id']}")
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == test_data["link_id"]
        assert data["title"] == "Test Photo Set"
        print(f"Link by ID retrieval successful")
    
    def test_17_toggle_link_status(self):
        """Toggle link active status"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        
        # Deactivate
        response = requests.patch(
            f"{BASE_URL}/api/creators/{test_data['creator_id']}/links/{test_data['link_id']}/toggle",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_active"] == False
        print(f"Link deactivated")
        
        # Reactivate
        response = requests.patch(
            f"{BASE_URL}/api/creators/{test_data['creator_id']}/links/{test_data['link_id']}/toggle",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_active"] == True
        print(f"Link reactivated")
    
    def test_18_link_not_found(self):
        """Test 404 for non-existent link"""
        response = requests.get(f"{BASE_URL}/api/links/by-slug/non-existent-link-xyz")
        assert response.status_code == 404
        print("Non-existent link correctly returns 404")


class TestCheckout:
    """Test Stripe checkout integration"""
    
    def test_19_create_checkout_session(self):
        """Create Stripe checkout session for a link"""
        response = requests.post(f"{BASE_URL}/api/links/{test_data['link_id']}/checkout")
        assert response.status_code == 200
        data = response.json()
        
        # Data assertions
        assert "sessionId" in data
        assert "url" in data
        assert "checkout.stripe.com" in data["url"]
        print(f"Checkout session created: {data['sessionId'][:20]}...")
    
    def test_20_checkout_inactive_link(self):
        """Test checkout for inactive link should fail"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        
        # Deactivate link first
        requests.patch(
            f"{BASE_URL}/api/creators/{test_data['creator_id']}/links/{test_data['link_id']}/toggle",
            headers=headers
        )
        
        # Try checkout - should fail
        response = requests.post(f"{BASE_URL}/api/links/{test_data['link_id']}/checkout")
        assert response.status_code == 400
        data = response.json()
        assert "not currently available" in data["detail"].lower()
        print("Inactive link checkout correctly rejected")
        
        # Reactivate for other tests
        requests.patch(
            f"{BASE_URL}/api/creators/{test_data['creator_id']}/links/{test_data['link_id']}/toggle",
            headers=headers
        )


class TestWallet:
    """Test wallet/earnings endpoints"""
    
    def test_21_get_wallet_summary(self):
        """Get wallet summary"""
        headers = {"Authorization": f"Bearer {test_data['token']}"}
        response = requests.get(f"{BASE_URL}/api/wallet", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify wallet structure
        assert "total_earned" in data
        assert "available_to_withdraw" in data
        assert "pending" in data
        assert "paid_out" in data
        assert "creators_earnings" in data
        assert isinstance(data["creators_earnings"], list)
        print(f"Wallet summary: total_earned=${data['total_earned']}, pending=${data['pending']}")


class TestPurchaseVerification:
    """Test purchase verification endpoints"""
    
    def test_22_verify_nonexistent_purchase(self):
        """Verify purchase with invalid session ID should fail"""
        response = requests.get(f"{BASE_URL}/api/purchases/verify/invalid-session-id")
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()
        print("Invalid purchase verification correctly returns 404")


class TestCleanup:
    """Cleanup test data"""
    
    def test_99_delete_link(self):
        """Delete test link"""
        if test_data["link_id"]:
            headers = {"Authorization": f"Bearer {test_data['token']}"}
            response = requests.delete(
                f"{BASE_URL}/api/creators/{test_data['creator_id']}/links/{test_data['link_id']}",
                headers=headers
            )
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "success"
            print(f"Link deleted: {test_data['link_id']}")
            
            # Verify deletion via GET - should return 404
            get_response = requests.get(f"{BASE_URL}/api/links/{test_data['link_id']}")
            assert get_response.status_code == 404
            print("Link deletion verified via GET")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
