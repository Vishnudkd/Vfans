import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, CreditCard, Users as UsersIcon } from 'lucide-react';

const CreatorCustomers = () => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data
  const customers = [];

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
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by customer name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Empty State */}
        <Card className="p-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <CreditCard className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Looks like you got no customers yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You'll see your customers here once a customer has bought one of your links.
            </p>
            <div className="mt-8">
              <UsersIcon className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreatorCustomers;
