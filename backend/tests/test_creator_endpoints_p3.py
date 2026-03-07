"""
VFans Media P3 API Tests - Creator Stats, Analytics, Customers, Transactions
Tests the 4 new endpoints added in P3:
- GET /api/creators/{creator_id}/stats
- GET /api/creators/{creator_id}/analytics
- GET /api/creators/{creator_id}/customers
- GET /api/creators/{creator_id}/transactions
Plus: Stripe checkout with empty description fix
"""
import pytest
import requests
import os
import time

# Use public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://payment-flow-165.preview.emergentagent.com').rstrip('/')

# Demo credentials
DEMO_EMAIL = "demo@vfans.com"
DEMO_PASSWORD = "demo"


@pytest.fixture(scope="module")
def auth_session():
    """Login and get auth token + creator_id"""
    # Login
    response = requests.post(f"{BASE_URL}/api/login", json={
        "email": DEMO_EMAIL,
        "password": DEMO_PASSWORD
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get creators
    creators_resp = requests.get(f"{BASE_URL}/api/creators", headers=headers)
    assert creators_resp.status_code == 200
    creators = creators_resp.json()
    assert len(creators) >= 1, "No creators found for demo user"
    
    creator_id = creators[0]["id"]
    
    return {
        "token": token,
        "headers": headers,
        "creator_id": creator_id,
        "creator_name": creators[0]["name"]
    }


class TestCreatorStats:
    """Test GET /api/creators/{creator_id}/stats endpoint"""
    
    def test_stats_endpoint_returns_200(self, auth_session):
        """Stats endpoint returns 200 with valid creator_id"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/stats",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        print(f"Stats endpoint returned 200 for creator {auth_session['creator_id']}")
    
    def test_stats_structure_complete(self, auth_session):
        """Stats response contains all required fields"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/stats",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields exist
        required_fields = ["total_views", "total_purchases", "total_earned", 
                          "total_customers", "total_links", "active_links"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        # Verify field types
        assert isinstance(data["total_views"], int)
        assert isinstance(data["total_purchases"], int)
        assert isinstance(data["total_earned"], (int, float))
        assert isinstance(data["total_customers"], int)
        assert isinstance(data["total_links"], int)
        assert isinstance(data["active_links"], int)
        
        print(f"Stats: views={data['total_views']}, purchases={data['total_purchases']}, earned=${data['total_earned']}, customers={data['total_customers']}, links={data['total_links']}/{data['active_links']}")
    
    def test_stats_unauthorized_without_token(self, auth_session):
        """Stats endpoint returns 401/403 without auth token"""
        response = requests.get(f"{BASE_URL}/api/creators/{auth_session['creator_id']}/stats")
        assert response.status_code in [401, 403]
    
    def test_stats_creator_not_found(self, auth_session):
        """Stats endpoint returns 404 for non-existent creator"""
        response = requests.get(
            f"{BASE_URL}/api/creators/non-existent-creator-id/stats",
            headers=auth_session['headers']
        )
        assert response.status_code == 404


class TestCreatorAnalytics:
    """Test GET /api/creators/{creator_id}/analytics endpoint"""
    
    def test_analytics_endpoint_returns_200(self, auth_session):
        """Analytics endpoint returns 200 with valid creator_id"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/analytics",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        print(f"Analytics endpoint returned 200 for creator {auth_session['creator_id']}")
    
    def test_analytics_structure_complete(self, auth_session):
        """Analytics response contains all required fields"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/analytics",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "views" in data
        assert "customers" in data
        assert "sales" in data
        assert "top_links" in data
        assert "top_customers" in data
        
        # Verify types
        assert isinstance(data["views"], int)
        assert isinstance(data["customers"], int)
        assert isinstance(data["sales"], int)
        assert isinstance(data["top_links"], list)
        assert isinstance(data["top_customers"], list)
        
        print(f"Analytics: views={data['views']}, customers={data['customers']}, sales={data['sales']}, top_links={len(data['top_links'])}, top_customers={len(data['top_customers'])}")
    
    def test_analytics_top_links_structure(self, auth_session):
        """Top links have correct structure"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/analytics",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data["top_links"]) > 0:
            link = data["top_links"][0]
            assert "id" in link
            assert "title" in link
            assert "short_link" in link
            assert "views" in link
            assert "purchases" in link
            assert "price" in link
            print(f"Top link: {link['title']} - views={link['views']}, purchases={link['purchases']}")
    
    def test_analytics_top_customers_structure(self, auth_session):
        """Top customers have correct structure (if any exist)"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/analytics",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data["top_customers"]) > 0:
            customer = data["top_customers"][0]
            assert "id" in customer
            assert "email" in customer
            assert "purchases" in customer
            assert "total_spent" in customer
            print(f"Top customer: {customer['email']} - purchases={customer['purchases']}, spent=${customer['total_spent']}")


class TestCreatorCustomers:
    """Test GET /api/creators/{creator_id}/customers endpoint"""
    
    def test_customers_endpoint_returns_200(self, auth_session):
        """Customers endpoint returns 200 with valid creator_id"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/customers",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        print(f"Customers endpoint returned 200 for creator {auth_session['creator_id']}")
    
    def test_customers_returns_list(self, auth_session):
        """Customers endpoint returns a list"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/customers",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"Customers: {len(data)} customer(s) found")
    
    def test_customers_structure(self, auth_session):
        """Customer objects have correct structure (if any exist)"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/customers",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            customer = data[0]
            assert "id" in customer
            assert "email" in customer
            assert "purchases" in customer
            assert "total_spent" in customer
            assert "last_purchase" in customer
            print(f"Customer: {customer['email']} - {customer['purchases']} purchases, ${customer['total_spent']} total")
        else:
            print("No customers yet - this is expected for new creators")


class TestCreatorTransactions:
    """Test GET /api/creators/{creator_id}/transactions endpoint"""
    
    def test_transactions_endpoint_returns_200(self, auth_session):
        """Transactions endpoint returns 200 with valid creator_id"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/transactions",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        print(f"Transactions endpoint returned 200 for creator {auth_session['creator_id']}")
    
    def test_transactions_returns_list(self, auth_session):
        """Transactions endpoint returns a list"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/transactions",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"Transactions: {len(data)} transaction(s) found")
    
    def test_transactions_structure(self, auth_session):
        """Transaction objects have correct structure (if any exist)"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{auth_session['creator_id']}/transactions",
            headers=auth_session['headers']
        )
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            txn = data[0]
            assert "id" in txn
            assert "link_title" in txn
            assert "customer_email" in txn
            assert "amount" in txn
            assert "status" in txn
            assert "created_at" in txn
            print(f"Transaction: {txn['link_title']} - ${txn['amount']} - {txn['status']}")
        else:
            print("No transactions yet - this is expected for new creators")


class TestStripeCheckoutEmptyDescription:
    """Test Stripe checkout works with empty/null description"""
    
    def test_checkout_with_null_description(self, auth_session):
        """Create a link with no description and verify checkout works"""
        creator_id = auth_session['creator_id']
        
        # Get existing links
        links_resp = requests.get(
            f"{BASE_URL}/api/creators/{creator_id}/links",
            headers=auth_session['headers']
        )
        assert links_resp.status_code == 200
        links = links_resp.json()
        
        # Find a link with null/empty description, or create one
        link_with_empty_desc = None
        for link in links:
            if not link.get('description'):
                link_with_empty_desc = link
                break
        
        if not link_with_empty_desc:
            # Create a test link without description
            unique_slug = f"stripe-test-{int(time.time())}"
            create_resp = requests.post(
                f"{BASE_URL}/api/creators/{creator_id}/links",
                headers=auth_session['headers'],
                json={
                    "title": "Stripe Test Link",
                    "price": 5.99,
                    "file_url": "/api/uploads/test.jpg",
                    "file_type": "image",
                    "short_link": unique_slug,
                    "fee_applies_to": "seller"
                }
            )
            assert create_resp.status_code == 201, f"Failed to create test link: {create_resp.text}"
            link_with_empty_desc = create_resp.json()
            print(f"Created test link: {link_with_empty_desc['id']}")
        
        # Test checkout with empty description
        link_id = link_with_empty_desc['id']
        checkout_resp = requests.post(f"{BASE_URL}/api/links/{link_id}/checkout")
        
        assert checkout_resp.status_code == 200, f"Checkout failed: {checkout_resp.text}"
        data = checkout_resp.json()
        
        assert "sessionId" in data
        assert "url" in data
        assert "checkout.stripe.com" in data["url"]
        
        print(f"Stripe checkout successful for link with empty description: {data['sessionId'][:30]}...")
        
        # Cleanup: delete test link if we created it
        if link_with_empty_desc.get('title') == "Stripe Test Link":
            requests.delete(
                f"{BASE_URL}/api/creators/{creator_id}/links/{link_id}",
                headers=auth_session['headers']
            )
            print(f"Cleaned up test link")


class TestAuthorizationBoundaries:
    """Test authorization - can't access other creators' data"""
    
    def test_cannot_access_nonexistent_creator(self, auth_session):
        """Cannot access stats for non-existent creator"""
        fake_id = "00000000-0000-0000-0000-000000000000"
        
        for endpoint in ['stats', 'analytics', 'customers', 'transactions']:
            response = requests.get(
                f"{BASE_URL}/api/creators/{fake_id}/{endpoint}",
                headers=auth_session['headers']
            )
            assert response.status_code == 404, f"Expected 404 for {endpoint}, got {response.status_code}"
        
        print("All endpoints correctly return 404 for non-existent creator")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
