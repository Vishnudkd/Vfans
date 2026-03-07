import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building2, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreateOrganization = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: ''
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Check if user already has an organization
  useEffect(() => {
    const checkExistingOrganization = async () => {
      try {
        const orgResponse = await axios.get(`${API_URL}/api/organizations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (orgResponse.data) {
          // User already has organization, check for creators
          const creatorsResponse = await axios.get(`${API_URL}/api/creators`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (creatorsResponse.data && creatorsResponse.data.length > 0) {
            // Has organization and creators, redirect to dashboard
            navigate(`/creator/${creatorsResponse.data[0].id}/dashboard`);
          } else {
            // Has org but no creators, redirect to create creator
            navigate('/create-creator');
          }
        } else {
          // No organization, show the form
          setIsChecking(false);
        }
      } catch (error) {
        // If 404, user doesn't have organization - show form
        if (error.response?.status === 404) {
          setIsChecking(false);
        } else {
          // Other error, still show form
          setIsChecking(false);
        }
      }
    };

    checkExistingOrganization();
  }, [token, API_URL, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Organization Name Required",
        description: "Please enter a name for your organization",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create organization
      const orgResponse = await axios.post(
        `${API_URL}/api/organizations`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Step 2: Auto-create a default creator with the organization name
      const creatorResponse = await axios.post(
        `${API_URL}/api/creators`,
        {
          organization_id: orgResponse.data.id,
          name: formData.name, // Use organization name as default creator name
          profile_picture: formData.logo_url, // Use org logo as creator picture
          bio: `Official ${formData.name} account`
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Welcome to VFans Media! 🎉",
        description: `${formData.name} is ready to go. Redirecting to your dashboard...`,
      });

      // Step 3: Redirect to the creator's dashboard
      setTimeout(() => {
        navigate(`/creator/${creatorResponse.data.id}/dashboard`);
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to Set Up Account",
        description: error.response?.data?.detail || "Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold">
              1
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-bold">
              2
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            What's your creator name?
          </h1>
          <p className="text-gray-600">
            This will be your brand name on VFans Media
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Creator Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Creator Studio, Content Hub"
              className="text-lg py-6"
            />
            <p className="text-sm text-gray-500 mt-2">
              This will be your main identity on VFans Media
            </p>
          </div>

          {/* Logo URL (Optional) */}
          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL (Optional)
            </label>
            <div className="relative">
              <Input
                id="logo_url"
                name="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/profile.png"
                className="text-lg py-6"
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Add a direct link to your profile picture. You can skip this for now and add it later.
            </p>
          </div>

          {/* Preview */}
          {(formData.name || formData.logo_url) && (
            <Card className="p-6 bg-gray-50 border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
              <div className="flex items-center space-x-4">
                {formData.logo_url ? (
                  <img
                    src={formData.logo_url}
                    alt="Organization logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{formData.name || 'Your Organization'}</h3>
                  <p className="text-sm text-gray-500">Organization</p>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Benefits */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">What happens next:</p>
          <ul className="space-y-2">
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              Your account will be created instantly
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              You'll be taken to your dashboard
            </li>
            <li className="flex items-start text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              Start creating links and earning money right away
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default CreateOrganization;
