import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, Link as LinkIcon, Eye, DollarSign } from 'lucide-react';

const CreatorLinks = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [activeTab, setActiveTab] = useState('all'); // all, active, inactive
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all'); // all links
  const [sortOption, setSortOption] = useState('newest');

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Placeholder data - will be replaced with actual API calls
  const links = [];
  const stats = {
    totalLinks: 0,
    totalViews: 0,
    totalEarned: 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate(`/creator/${creatorId}/dashboard`)}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Links</h2>

        {/* Stats Card */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <LinkIcon className="h-5 w-5 text-gray-700" />
              </div>
              <p className="text-sm text-gray-600 mb-1">LINKS</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-gray-700" />
              </div>
              <p className="text-sm text-gray-600 mb-1">VIEWS</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-gray-700" />
              </div>
              <p className="text-sm text-gray-600 mb-1">EARNED</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalEarned.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex items-center space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'inactive'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inactive
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All links</option>
            <option value="products">Products</option>
            <option value="services">Services</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
          </select>
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
            Create
          </Button>
        </div>

        {/* Empty State */}
        <Card className="p-12 bg-white rounded-2xl border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <LinkIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active links</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any active links. Create a new one or reactivate an existing link.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
              Create link
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatorLinks;
