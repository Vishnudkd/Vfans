import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Calendar, TrendingUp, Users, ShoppingCart, LinkIcon, DollarSign } from 'lucide-react';

const CreatorAnalytics = () => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [dateRange, setDateRange] = useState('Mar 01, 2026 - Mar 07, 2026');

  // Placeholder data
  const stats = {
    views: 0,
    customers: 0,
    sales: 0
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{dateRange}</span>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
            Create link
          </Button>
        </div>

        {/* Stats Summary */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <p className="text-sm text-gray-600">Views</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.views}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <p className="text-sm text-gray-600">Number of Customers</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.customers}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <p className="text-sm text-gray-600">Sales</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.sales}</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="mt-8 h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No data available</p>
              <p className="text-sm text-gray-400 mt-1">
                There is no data to display for the selected period.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <h3 className="text-lg font-semibold text-gray-900 mt-6">Quick stats</h3>

        {/* Top Links */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-gray-700" />
              <h4 className="font-semibold text-gray-900">Top Links</h4>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <ShoppingCart className="h-4 w-4" />
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Nothing here yet</p>
          </div>
        </Card>

        {/* Top Customers */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-700" />
              <h4 className="font-semibold text-gray-900">Top Customers</h4>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Country</span>
              <span>Lifetime value</span>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Nothing here yet</p>
          </div>
        </Card>

        {/* Top Members */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-700" />
              <h4 className="font-semibold text-gray-900">Top Members</h4>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <ShoppingCart className="h-4 w-4" />
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Nothing here yet</p>
          </div>
        </Card>

        {/* Customers by Country */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-700" />
              <h4 className="font-semibold text-gray-900">Customers (by country)</h4>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Nothing here yet</p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatorAnalytics;
