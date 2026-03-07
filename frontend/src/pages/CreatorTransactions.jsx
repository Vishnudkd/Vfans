import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_STYLES = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
  failed: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
};

const CreatorTransactions = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/creators/${creatorId}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [creatorId, token, API_URL]);

  const filtered = transactions.filter((t) => {
    const matchSearch = !searchQuery ||
      t.link_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
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
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by link or customer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              data-testid="txn-search"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            data-testid="txn-filter"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery || filterStatus !== 'all' ? 'No matching transactions' : 'No transactions yet'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchQuery || filterStatus !== 'all' ? 'Try a different search or filter.' : "Transactions will appear here once customers purchase your links."}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button onClick={() => navigate(`/creator/${creatorId}/links/create`)} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
                  Create link
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="bg-white rounded-2xl border border-gray-200 overflow-hidden" data-testid="transactions-table">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Link</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const s = STATUS_STYLES[t.status] || STATUS_STYLES.completed;
                  const StatusIcon = s.icon;
                  return (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900 text-sm">{t.link_title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{t.customer_name || t.customer_email}</p>
                        {t.customer_name && <p className="text-xs text-gray-500">{t.customer_email}</p>}
                      </td>
                      <td className="text-right px-4 py-3 text-sm font-semibold text-gray-900">${t.amount.toFixed(2)}</td>
                      <td className="text-center px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${s.color} ${s.bg}`}>
                          <StatusIcon className="h-3 w-3" />{s.label}
                        </span>
                      </td>
                      <td className="text-right px-5 py-3 text-xs text-gray-500">{formatDate(t.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        <Card className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-sm text-gray-700">
              Funds are held as "Pending" for 7 days before becoming available for withdrawal.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatorTransactions;
