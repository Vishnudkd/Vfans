import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LogOut, User, Settings, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">VFans Media</h1>
              <span className="text-sm text-gray-500">Creator Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Creator'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your creator account today.
          </p>
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

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Edit Profile</h4>
                  <p className="text-sm text-gray-500">Update your information</p>
                </div>
              </div>
            </button>

            <button className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Account Settings</h4>
                  <p className="text-sm text-gray-500">Manage your account</p>
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
          </div>
        </Card>

        {/* Getting Started */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Getting Started</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <p className="font-medium text-gray-900">Account created</p>
                <p className="text-sm text-gray-500">You've successfully created your creator account</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-gray-300 mt-1">○</span>
              <div>
                <p className="font-medium text-gray-900">Complete your profile</p>
                <p className="text-sm text-gray-500">Add a bio, profile picture, and social links</p>
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
                <p className="font-medium text-gray-900">Share your link</p>
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
