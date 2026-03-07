"""
VFans Media API Complete Tests - Using Existing Test Data
Tests for: Login, by-slug endpoint, checkout, wallet
NOTE: DO NOT re-initialize demo user - test data already exists
"""
import pytest
import requests
import os

# Use the public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://payment-flow-165.preview.emergentagent.com').rstrip('/')

# Demo credentials
DEMO_EMAIL = "demo@vfans.com"
DEMO_PASSWORD = "demo"

# Known test data that already exists
TEST_SHORT_LINK = "test-photo-set"


@pytest.fixture(scope="module")
def auth_token():
    """Get auth token by logging in with demo user"""
    response = requests.post(f"{BASE_URL}/api/login", json={
        "email": DEMO_EMAIL,
        "password": DEMO_PASSWORD
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Get auth headers"""
    return {"Authorization": f"Bearer {auth_token}"}


class TestAPIHealth:
    """Test API health endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root: {data}")


class TestLogin:
    """Test login endpoints"""
    
    def test_login_success(self):
        """Login with demo@vfans.com / demo"""
        response = requests.post(f"{BASE_URL}/api/login", json={
            "email": DEMO_EMAIL,
            "password": DEMO_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        
        # Data assertions
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == DEMO_EMAIL
        assert data["user"]["email_verified"] == True
        assert data["user"]["is_active"] == True
        print(f"Login successful: user_id={data['user']['id']}")
    
    def test_login_invalid_credentials(self):
        """Test login with wrong credentials"""
        response = requests.post(f"{BASE_URL}/api/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401


class TestOrganizations:
    """Test organization endpoints"""
    
    def test_get_organization(self, auth_headers):
        """Get user's organization"""
        response = requests.get(f"{BASE_URL}/api/organizations", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert "name" in data
        assert "user_id" in data
        print(f"Organization: {data['name']} (id={data['id']})")


class TestCreators:
    """Test creator endpoints"""
    
    def test_get_creators(self, auth_headers):
        """Get all creators for user"""
        response = requests.get(f"{BASE_URL}/api/creators", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 1
        
        # Find Test Creator
        creator = next((c for c in data if c["name"] == "Test Creator"), None)
        assert creator is not None
        assert "id" in creator
        print(f"Found {len(data)} creator(s)")
        return creator


class TestLinkBySlug:
    """Test the /api/links/by-slug/{short_link} endpoint with creator_info"""
    
    def test_get_link_by_slug(self):
        """Get link by short_link slug (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/links/by-slug/{TEST_SHORT_LINK}")
        assert response.status_code == 200
        data = response.json()
        
        # Link data assertions
        assert data["short_link"] == TEST_SHORT_LINK
        assert data["title"] == "Test Photo Set"
        assert data["price"] == 9.99
        assert data["is_active"] == True
        assert data["file_type"] == "image"
        
        # Creator info assertions - KEY NEW FEATURE
        assert "creator_info" in data
        creator_info = data["creator_info"]
        assert creator_info is not None
        assert "id" in creator_info
        assert creator_info["name"] == "Test Creator"
        assert "profile_picture" in creator_info
        assert "bio" in creator_info
        
        print(f"Link by-slug: {data['title']}, creator: {creator_info['name']}")
    
    def test_link_slug_not_found(self):
        """Test 404 for non-existent short_link"""
        response = requests.get(f"{BASE_URL}/api/links/by-slug/non-existent-link-xyz")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data


class TestCheckout:
    """Test Stripe checkout creation"""
    
    def test_create_checkout_session(self):
        """Create Stripe checkout session for test link"""
        # First get the link to get its ID
        link_response = requests.get(f"{BASE_URL}/api/links/by-slug/{TEST_SHORT_LINK}")
        assert link_response.status_code == 200
        link_id = link_response.json()["id"]
        
        # Create checkout session
        response = requests.post(f"{BASE_URL}/api/links/{link_id}/checkout")
        assert response.status_code == 200
        data = response.json()
        
        # Data assertions
        assert "sessionId" in data
        assert "url" in data
        assert "checkout.stripe.com" in data["url"]
        print(f"Checkout session created: {data['sessionId'][:30]}...")


class TestWallet:
    """Test wallet endpoints"""
    
    def test_get_wallet_summary(self, auth_headers):
        """Get wallet summary"""
        response = requests.get(f"{BASE_URL}/api/wallet", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify wallet structure
        assert "total_earned" in data
        assert "available_to_withdraw" in data
        assert "pending" in data
        assert "paid_out" in data
        assert "creators_earnings" in data
        assert isinstance(data["creators_earnings"], list)
        
        # Verify numeric types
        assert isinstance(data["total_earned"], (int, float))
        assert isinstance(data["available_to_withdraw"], (int, float))
        print(f"Wallet: total={data['total_earned']}, pending={data['pending']}")


class TestPurchaseVerification:
    """Test purchase verification endpoint"""
    
    def test_verify_invalid_session(self):
        """Verify purchase with invalid session ID should return 404"""
        response = requests.get(f"{BASE_URL}/api/purchases/verify/invalid-session-id")
        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()


class TestCreateLinksFlow:
    """Test creating links (uses existing org and creator)"""
    
    def test_create_and_delete_link(self, auth_headers):
        """Create a new link and then delete it"""
        # Get creators to get creator_id
        creators_response = requests.get(f"{BASE_URL}/api/creators", headers=auth_headers)
        assert creators_response.status_code == 200
        creators = creators_response.json()
        assert len(creators) >= 1
        creator_id = creators[0]["id"]
        
        # Create a unique test link
        import time
        unique_slug = f"api-test-{int(time.time())}"
        
        create_response = requests.post(
            f"{BASE_URL}/api/creators/{creator_id}/links",
            headers=auth_headers,
            json={
                "title": "API Test Link",
                "description": "Created by test suite",
                "price": 4.99,
                "file_url": "/uploads/test/test.jpg",
                "file_type": "image",
                "short_link": unique_slug,
                "fee_applies_to": "seller",
                "single_purchase": False
            }
        )
        assert create_response.status_code == 201
        created_link = create_response.json()
        
        # Verify created link data
        assert created_link["title"] == "API Test Link"
        assert created_link["price"] == 4.99
        assert created_link["short_link"] == unique_slug
        assert created_link["is_active"] == True
        
        link_id = created_link["id"]
        print(f"Created link: {link_id}")
        
        # Verify via GET by-slug
        slug_response = requests.get(f"{BASE_URL}/api/links/by-slug/{unique_slug}")
        assert slug_response.status_code == 200
        assert slug_response.json()["id"] == link_id
        
        # Delete the test link
        delete_response = requests.delete(
            f"{BASE_URL}/api/creators/{creator_id}/links/{link_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        
        # Verify deletion
        verify_response = requests.get(f"{BASE_URL}/api/links/by-slug/{unique_slug}")
        assert verify_response.status_code == 404
        print(f"Link deleted successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
