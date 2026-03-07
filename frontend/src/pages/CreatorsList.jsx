import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Plus, LogOut, Building2, BarChart3 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreatorsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [creators, setCreators] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organization
        const orgResponse = await axios.get(`${API_URL}/api/organizations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOrganization(orgResponse.data);

        // Fetch creators
        const creatorsResponse = await axios.get(`${API_URL}/api/creators`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCreators(creatorsResponse.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // No organization found
          navigate('/create-organization');
        } else {
          toast({
            title: "Failed to load data",
            description: "Please refresh the page",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, API_URL, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreatorClick = (creatorId) => {
    navigate(`/creator/${creatorId}/dashboard`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">VFans Media</h1>
              {organization && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <Building2 className="h-4 w-4" />
                  <span>{organization.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Creator Profiles</h2>
          <p className="text-gray-600">
            Manage all your creator profiles in one place
          </p>
        </div>

        {/* Creators Grid */}
        {creators.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Creators Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first creator profile to start sharing content
            </p>
            <Button
              onClick={() => navigate('/create-creator')}
              className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Creator
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {creators.map((creator) => (
                <Card
                  key={creator.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => handleCreatorClick(creator.id)}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    {creator.profile_picture ? (
                      <img
                        src={creator.profile_picture}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{creator.name}</h3>
                      <p className="text-sm text-gray-500">Creator Profile</p>
                    </div>
                  </div>
                  
                  {creator.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{creator.bio}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        <span>0 posts</span>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreatorClick(creator.id);
                      }}
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      View Dashboard
                    </Button>
                  </div>
                </Card>
              ))}

              {/* Add New Creator Card */}
              <Card
                className="p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all cursor-pointer flex items-center justify-center min-h-[200px]"
                onClick={() => navigate('/create-creator')}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Plus className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Add New Creator</h3>
                  <p className="text-sm text-gray-500">Create another profile</p>
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CreatorsList;
