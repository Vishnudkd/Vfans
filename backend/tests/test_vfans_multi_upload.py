"""
VFans Media Multi-Upload Tests - Testing iteration 2
Tests for: Upload endpoint with Form() params, Link files array, Static file serving
NOTE: Uses existing test data - demo@vfans.com user, Test Creator, premium-photos link
"""
import pytest
import requests
import os
import io
from PIL import Image

# Use the public URL for testing
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://payment-flow-165.preview.emergentagent.com').rstrip('/')

# Demo credentials
DEMO_EMAIL = "demo@vfans.com"
DEMO_PASSWORD = "demo"

# Known test data - premium-photos link created with actual uploaded file
TEST_SHORT_LINK = "premium-photos"


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


@pytest.fixture(scope="module")
def creator_id(auth_headers):
    """Get the Test Creator ID"""
    response = requests.get(f"{BASE_URL}/api/creators", headers=auth_headers)
    assert response.status_code == 200
    creators = response.json()
    creator = next((c for c in creators if c["name"] == "Test Creator"), creators[0] if creators else None)
    assert creator is not None, "No creator found"
    return creator["id"]


class TestUploadEndpoint:
    """Test POST /api/upload with Form() parameters"""
    
    def test_upload_image_with_form_params(self, auth_headers, creator_id):
        """Upload an image with creator_id and blur_level as Form() params"""
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        # Send multipart form data with Form() params
        files = {'file': ('test_upload.jpg', img_bytes, 'image/jpeg')}
        data = {
            'creator_id': creator_id,
            'blur_level': 'high'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/upload",
            headers=auth_headers,
            files=files,
            data=data
        )
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        result = response.json()
        
        # Verify response structure
        assert result["status"] == "success"
        assert "file_id" in result
        assert "file_url" in result
        assert result["file_type"] == "image"
        assert "preview_url" in result  # Blurred preview should be generated
        assert result["blur_level"] == "high"  # Verify blur_level was received
        assert "file_name" in result
        assert "file_size" in result
        
        # Verify URL uses /api/uploads/ prefix
        assert result["file_url"].startswith("/api/uploads/")
        assert result["preview_url"].startswith("/api/uploads/")
        
        # Verify creator_id is in the path (when provided)
        assert creator_id in result["file_url"]
        
        print(f"Upload successful: {result['file_url']}")
        print(f"Preview URL: {result['preview_url']}")
        return result
    
    def test_upload_without_creator_id(self, auth_headers):
        """Upload an image without creator_id (should still work)"""
        img = Image.new('RGB', (50, 50), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test_no_creator.png', img_bytes, 'image/png')}
        data = {'blur_level': 'medium'}
        
        response = requests.post(
            f"{BASE_URL}/api/upload",
            headers=auth_headers,
            files=files,
            data=data
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["status"] == "success"
        assert result["file_type"] == "image"
        assert result["blur_level"] == "medium"
        print(f"Upload without creator_id successful: {result['file_url']}")
    
    def test_upload_default_blur_level(self, auth_headers):
        """Upload without specifying blur_level should default to medium"""
        img = Image.new('RGB', (30, 30), color='green')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {'file': ('test_default_blur.jpg', img_bytes, 'image/jpeg')}
        
        response = requests.post(
            f"{BASE_URL}/api/upload",
            headers=auth_headers,
            files=files
        )
        
        assert response.status_code == 200
        result = response.json()
        assert result["blur_level"] == "medium"  # Default value
        print(f"Default blur_level verified: {result['blur_level']}")
    
    def test_upload_unsupported_file_type(self, auth_headers):
        """Upload unsupported file type should fail"""
        files = {'file': ('test.xyz', b'fake content', 'application/octet-stream')}
        
        response = requests.post(
            f"{BASE_URL}/api/upload",
            headers=auth_headers,
            files=files
        )
        
        assert response.status_code == 400
        assert "unsupported" in response.json()["detail"].lower()


class TestLinkFilesArray:
    """Test Link model files array support"""
    
    def test_get_link_with_files_array(self):
        """GET /api/links/by-slug/premium-photos should return files array"""
        response = requests.get(f"{BASE_URL}/api/links/by-slug/{TEST_SHORT_LINK}")
        assert response.status_code == 200
        data = response.json()
        
        # Verify files array exists and has proper structure
        assert "files" in data
        assert isinstance(data["files"], list)
        assert len(data["files"]) >= 1
        
        # Check first file structure
        first_file = data["files"][0]
        assert "url" in first_file
        assert "type" in first_file
        assert "preview_url" in first_file
        assert "name" in first_file
        assert "size" in first_file
        
        # Verify URLs use /api/uploads/ prefix
        assert first_file["url"].startswith("/api/uploads/")
        if first_file["preview_url"]:
            assert first_file["preview_url"].startswith("/api/uploads/")
        
        print(f"Files array: {len(data['files'])} files")
        print(f"First file: {first_file['name']}, size: {first_file['size']}")
    
    def test_create_link_with_files_array(self, auth_headers, creator_id):
        """Create a link with files array and verify persistence"""
        import time
        unique_slug = f"test-files-array-{int(time.time())}"
        
        test_files = [
            {
                "url": "/api/uploads/test/file1.jpg",
                "type": "image",
                "preview_url": "/api/uploads/test/file1_blur.jpg",
                "name": "test_file1.jpg",
                "size": 12345
            },
            {
                "url": "/api/uploads/test/file2.mp4",
                "type": "video",
                "preview_url": None,
                "name": "test_file2.mp4",
                "size": 5000000
            }
        ]
        
        create_payload = {
            "title": "Multi-File Test Link",
            "description": "Testing files array",
            "price": 9.99,
            "files": test_files,
            "file_url": test_files[0]["url"],
            "file_type": test_files[0]["type"],
            "preview_url": test_files[0]["preview_url"],
            "blur_level": "medium",
            "short_link": unique_slug,
            "fee_applies_to": "seller",
            "single_purchase": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/creators/{creator_id}/links",
            headers=auth_headers,
            json=create_payload
        )
        
        assert response.status_code == 201, f"Create failed: {response.text}"
        created = response.json()
        
        # Verify files array was stored
        assert "files" in created
        assert len(created["files"]) == 2
        assert created["files"][0]["name"] == "test_file1.jpg"
        assert created["files"][1]["type"] == "video"
        
        link_id = created["id"]
        print(f"Created link with files array: {link_id}")
        
        # Verify via GET by-slug
        get_response = requests.get(f"{BASE_URL}/api/links/by-slug/{unique_slug}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert len(fetched["files"]) == 2
        
        # Cleanup
        delete_response = requests.delete(
            f"{BASE_URL}/api/creators/{creator_id}/links/{link_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"Test link deleted successfully")


class TestStaticFileServing:
    """Test /api/uploads/ static file serving"""
    
    def test_preview_image_accessible(self):
        """Verify blurred preview image is accessible at /api/uploads/ path"""
        # Get the premium-photos link to get the preview URL
        link_response = requests.get(f"{BASE_URL}/api/links/by-slug/{TEST_SHORT_LINK}")
        assert link_response.status_code == 200
        link_data = link_response.json()
        
        preview_url = link_data.get("preview_url")
        assert preview_url is not None, "No preview_url in link"
        assert preview_url.startswith("/api/uploads/")
        
        # Fetch the actual image file
        full_url = f"{BASE_URL}{preview_url}"
        img_response = requests.get(full_url)
        
        assert img_response.status_code == 200, f"Preview not accessible: {img_response.status_code}"
        assert img_response.headers.get("content-type") == "image/jpeg"
        assert len(img_response.content) > 0
        
        print(f"Preview image accessible: {len(img_response.content)} bytes")
    
    def test_original_file_accessible(self):
        """Verify original file is accessible at /api/uploads/ path"""
        link_response = requests.get(f"{BASE_URL}/api/links/by-slug/{TEST_SHORT_LINK}")
        assert link_response.status_code == 200
        link_data = link_response.json()
        
        file_url = link_data.get("file_url")
        assert file_url is not None
        assert file_url.startswith("/api/uploads/")
        
        full_url = f"{BASE_URL}{file_url}"
        file_response = requests.get(full_url)
        
        assert file_response.status_code == 200, f"Original file not accessible: {file_response.status_code}"
        assert len(file_response.content) > 0
        
        print(f"Original file accessible: {len(file_response.content)} bytes")
    
    def test_files_array_urls_accessible(self):
        """Verify all files in files array are accessible"""
        link_response = requests.get(f"{BASE_URL}/api/links/by-slug/{TEST_SHORT_LINK}")
        assert link_response.status_code == 200
        files = link_response.json().get("files", [])
        
        for f in files:
            if f.get("url"):
                full_url = f"{BASE_URL}{f['url']}"
                file_resp = requests.get(full_url)
                assert file_resp.status_code == 200, f"File not accessible: {f['url']}"
                print(f"File accessible: {f['name']} ({len(file_resp.content)} bytes)")


class TestCreatorLinksEndpoint:
    """Test GET /api/creators/{id}/links returns files array"""
    
    def test_get_creator_links_includes_files(self, auth_headers, creator_id):
        """Creator links endpoint should return files array for each link"""
        response = requests.get(
            f"{BASE_URL}/api/creators/{creator_id}/links",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        links = response.json()
        
        assert isinstance(links, list)
        
        # Find premium-photos link
        premium_link = next((l for l in links if l["short_link"] == TEST_SHORT_LINK), None)
        if premium_link:
            assert "files" in premium_link
            assert isinstance(premium_link["files"], list)
            print(f"Found premium-photos with {len(premium_link['files'])} files")
        
        print(f"Total links for creator: {len(links)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
