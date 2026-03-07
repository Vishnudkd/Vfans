import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, CreditCard, Users as UsersIcon } from 'lucide-react';

const CreatorCustomers = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/creators/${creatorId}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(res.data);
      } catch (err) {
        console.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [creatorId, token, API_URL]);

  const filtered = customers.filter((c) =>
    !searchQuery || c.email.toLowerCase().includes(searchQuery.toLowerCase()) || (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return ''; }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
            data-testid="customer-search"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <CreditCard className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? 'No matching customers' : 'No customers yet'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery ? 'Try a different search term.' : "You'll see your customers here once someone buys one of your links."}
              </p>
            </div>
          </Card>
        ) : (
          <Card className="bg-white rounded-2xl border border-gray-200 overflow-hidden" data-testid="customers-table">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Purchases</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {(c.name || c.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{c.name || c.email}</p>
                          {c.name && <p className="text-xs text-gray-500">{c.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-4 py-3 text-sm text-gray-700">{c.purchases}</td>
                    <td className="text-right px-4 py-3 text-sm font-semibold text-gray-900">${c.total_spent.toFixed(2)}</td>
                    <td className="text-right px-5 py-3 text-sm text-gray-500">{formatDate(c.last_purchase)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CreatorCustomers;
