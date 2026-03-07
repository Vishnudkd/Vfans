import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, FileText, Calendar } from 'lucide-react';

const CreatorTransactions = () => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Placeholder data
  const transactions = [];

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
        <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by customer or link name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Period</span>
          </Button>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All transactions</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Empty State */}
        <Card className="p-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You'll see all your transactions here once customers start purchasing your links.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
              Create link
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                About transactions
              </p>
              <p className="text-sm text-gray-700">
                All transactions are processed securely through Stripe. Funds will appear in your wallet 
                as "Pending" for 7 days before becoming available for withdrawal.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatorTransactions;
