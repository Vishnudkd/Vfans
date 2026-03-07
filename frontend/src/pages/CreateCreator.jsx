import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { User, Upload, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreateCreator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    profile_picture: '',
    bio: ''
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/organizations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOrganization(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // No organization found, redirect to create one
          navigate('/create-organization');
        }
      }
    };

    fetchOrganization();
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
        title: "Creator Name Required",
        description: "Please enter a name for the creator profile",
        variant: "destructive",
      });
      return;
    }

    if (!organization) {
      toast({
        title: "No Organization Found",
        description: "Please create an organization first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/creators`,
        {
          ...formData,
          organization_id: organization.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Creator Profile Created! 🎉",
        description: `${formData.name} is ready to go.`,
      });

      // Redirect to creators list or dashboard
      setTimeout(() => {
        navigate('/creators');
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to Create Creator",
        description: error.response?.data?.detail || "Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (!organization) {
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
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white font-bold">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="w-16 h-1 bg-black mx-2"></div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold">
              2
            </div>
            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-bold">
              3
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add Your First Creator
          </h1>
          <p className="text-gray-600">
            Create a profile for {organization.name} • You can add more creators later
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Creator Name */}
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
              placeholder="e.g., Sarah Johnson, Tech Reviews Pro"
              className="text-lg py-6"
            />
          </div>

          {/* Profile Picture URL (Optional) */}
          <div>
            <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL (Optional)
            </label>
            <div className="relative">
              <Input
                id="profile_picture"
                name="profile_picture"
                type="url"
                value={formData.profile_picture}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                className="text-lg py-6"
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio (Optional)
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell your audience about this creator..."
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              A short description that will appear on the creator's public profile
            </p>
          </div>

          {/* Preview */}
          {formData.name && (
            <Card className="p-6 bg-gray-50 border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
              <div className="flex items-start space-x-4">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt="Creator"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h3>
                  {formData.bio && (
                    <p className="text-sm text-gray-600 line-clamp-3">{formData.bio}</p>
                  )}
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
                <span>Create Creator Profile</span>
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Skip Option */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/creators')}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            I'll add creators later
          </button>
        </div>
      </Card>
    </div>
  );
};

export default CreateCreator;
