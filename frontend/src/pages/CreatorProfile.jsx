import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Upload, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreatorProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const { toast } = useToast();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profile_picture: '',
    bio: '',
    currency: 'USD'
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/creators/${creatorId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCreator(response.data);
        setFormData({
          name: response.data.name || '',
          profile_picture: response.data.profile_picture || '',
          bio: response.data.bio || '',
          currency: 'USD'
        });
      } catch (error) {
        toast({
          title: "Failed to load creator",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [creatorId, token, API_URL, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(
        `${API_URL}/api/creators/${creatorId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Profile Updated! ✅",
        description: "Your changes have been saved successfully.",
      });

      // Refresh creator data
      const response = await axios.get(`${API_URL}/api/creators/${creatorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCreator(response.data);
    } catch (error) {
      toast({
        title: "Failed to Update",
        description: error.response?.data?.detail || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate(`/creator/${creatorId}/dashboard`)}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Creator Profile</h2>

        {/* Personal Info Card */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Personal info</h3>
            <p className="text-sm text-gray-600">Update your photo and personal details.</p>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Profile Picture</label>
              </div>
              <div className="flex items-center space-x-3">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = prompt('Enter image URL:', formData.profile_picture);
                    if (url !== null) {
                      setFormData(prev => ({ ...prev, profile_picture: url }));
                    }
                  }}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Name</label>
              </div>
              <div className="flex-1 max-w-md">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Creator name"
                  className="w-full"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start justify-between py-4 border-b border-gray-100">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Bio</label>
              </div>
              <div className="flex-1 max-w-md">
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell your audience about yourself..."
                  rows={4}
                  className="w-full resize-none"
                />
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Currency</label>
              </div>
              <div className="flex-1 max-w-md">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="USD">$ USD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatorProfile;
