import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LogOut, User, Settings, FileText, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const { toast } = useToast();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchCreator = async () => {
      if (!creatorId) {
        // No creator ID, redirect to creators list
        navigate('/creators');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/creators/${creatorId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCreator(response.data);
      } catch (error) {
        toast({
          title: "Failed to load creator",
          description: "Redirecting to creators list...",
          variant: "destructive",
        });
        setTimeout(() => navigate('/creators'), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [creatorId, token, API_URL, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading creator dashboard...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/creators')}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">VFans Media</h1>
              <span className="hidden sm:inline text-sm text-gray-500">•</span>
              <span className="hidden sm:inline text-sm text-gray-500">{creator.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Creator Header */}
        <div className="mb-8 flex items-start space-x-6">
          {creator.profile_picture ? (
            <img
              src={creator.profile_picture}
              alt={creator.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="h-12 w-12 text-gray-600" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{creator.name}</h2>
            {creator.bio && (
              <p className="text-gray-600 mb-4">{creator.bio}</p>
            )}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate(`/creator/${creatorId}/settings`)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">💰</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">$0.00</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Content Posts</h3>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-2">No content yet</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Profile Views</h3>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Upload Content</h4>
                  <p className="text-sm text-gray-500">Share your latest content</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/creator/${creatorId}/settings`)}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Profile Settings</h4>
                  <p className="text-sm text-gray-500">Update your information</p>
                </div>
              </div>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">View Analytics</h4>
                  <p className="text-sm text-gray-500">Track your performance</p>
                </div>
              </div>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Payment Settings</h4>
                  <p className="text-sm text-gray-500">Manage earnings & payouts</p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* Getting Started */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <p className="font-medium text-gray-900">Creator profile created</p>
                <p className="text-sm text-gray-500">{creator.name} is ready to share content</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-300 mt-1">○</span>
              <div>
                <p className="font-medium text-gray-900">Upload your first content</p>
                <p className="text-sm text-gray-500">Share something amazing with your audience</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-300 mt-1">○</span>
              <div>
                <p className="font-medium text-gray-900">Set up payment method</p>
                <p className="text-sm text-gray-500">Configure how you want to receive earnings</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-300 mt-1">○</span>
              <div>
                <p className="font-medium text-gray-900">Share your creator link</p>
                <p className="text-sm text-gray-500">Start promoting your content to earn money</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
