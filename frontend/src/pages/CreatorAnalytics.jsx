import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, TrendingUp, Users, ShoppingCart, LinkIcon, DollarSign, Eye } from 'lucide-react';

const CreatorAnalytics = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/creators/${creatorId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [creatorId, token, API_URL]);

  const stats = analytics || { views: 0, customers: 0, sales: 0, top_links: [], top_customers: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center space-x-3 max-w-6xl mx-auto">
          <Button onClick={() => navigate(`/creator/${creatorId}/dashboard`)} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <Button onClick={() => navigate(`/creator/${creatorId}/links/create`)} className="bg-green-600 hover:bg-green-700 text-white rounded-full" data-testid="create-link-btn">
            Create link
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" /></div>
        ) : (
          <>
            {/* Stats Summary */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200" data-testid="analytics-stats">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400" />
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900" data-testid="stat-views">{stats.views.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <p className="text-sm text-gray-600">Customers</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900" data-testid="stat-customers">{stats.customers.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <p className="text-sm text-gray-600">Sales</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900" data-testid="stat-sales">{stats.sales.toLocaleString()}</p>
                </div>
              </div>

              {stats.views === 0 && stats.sales === 0 ? (
                <div className="mt-8 h-48 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">No data available yet</p>
                    <p className="text-sm text-gray-400 mt-1">Create and share your links to see analytics</p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.views > 0 ? ((stats.sales / stats.views) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Avg. per Customer</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.customers > 0 ? (stats.sales / stats.customers).toFixed(1) : 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Views per Sale</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.sales > 0 ? (stats.views / stats.sales).toFixed(0) : '-'}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Top Links */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200" data-testid="top-links">
              <div className="flex items-center space-x-2 mb-4">
                <LinkIcon className="h-5 w-5 text-gray-700" />
                <h4 className="font-semibold text-gray-900">Top Links</h4>
              </div>
              {stats.top_links.length === 0 ? (
                <p className="text-center py-8 text-gray-500">Nothing here yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.top_links.map((link, i) => (
                    <div key={link.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-5">#{i + 1}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{link.title}</p>
                          <p className="text-xs text-gray-500">${link.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{link.views}</span>
                        <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" />{link.purchases}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${(link.purchases * link.price * 0.8).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Top Customers */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200" data-testid="top-customers">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-gray-700" />
                <h4 className="font-semibold text-gray-900">Top Customers</h4>
              </div>
              {stats.top_customers.length === 0 ? (
                <p className="text-center py-8 text-gray-500">Nothing here yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.top_customers.map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                          {(c.name || c.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{c.name || c.email}</p>
                          {c.name && <p className="text-xs text-gray-500">{c.email}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-5 text-xs text-gray-600">
                        <span>{c.purchases} purchases</span>
                        <span className="font-semibold text-gray-900">${c.total_spent.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default CreatorAnalytics;
