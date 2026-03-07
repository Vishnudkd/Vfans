import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Wallet as WalletIcon, DollarSign, Clock, CheckCircle, CreditCard, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Wallet = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState({
    total_earned: 0,
    available_to_withdraw: 0,
    pending: 0,
    paid_out: 0,
    creators_earnings: []
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/wallet`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setWalletData(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // No organization yet
          toast({
            title: "No Organization Found",
            description: "Please create an organization first",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [token, API_URL, toast]);

  const handleWithdrawalRequest = () => {
    toast({
      title: "Withdrawal Request",
      description: "This feature will be available soon. Admin will be notified.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Available to Withdraw */}
          <Card className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-700">Available to Withdraw</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              ${walletData.available_to_withdraw.toFixed(2)}
            </p>
            <Button
              onClick={handleWithdrawalRequest}
              disabled={walletData.available_to_withdraw === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Request Withdrawal
            </Button>
          </Card>

          {/* Pending Balance */}
          <Card className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-gray-700">Pending (7 days)</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              ${walletData.pending.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Funds will be available to withdraw after 7 days from payment date
            </p>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Earned */}
          <Card className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-700">Total Earned</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ${walletData.total_earned.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>

          {/* Paid Out */}
          <Card className="p-6 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <WalletIcon className="h-5 w-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-700">Paid Out</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ${walletData.paid_out.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payout Method */}
        <Card className="p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Payout Method</h3>
            </div>
            <Button variant="outline">Set up</Button>
          </div>
          <p className="text-gray-600 text-sm">
            Add your bank account or payment method to receive withdrawals
          </p>
        </Card>

        {/* Creators Earnings */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Creator</h3>
          
          {walletData.creators_earnings.length === 0 ? (
            <Card className="p-12 bg-white rounded-2xl border border-gray-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No earnings yet</h3>
                <p className="text-gray-600">
                  Start creating links and earning money with your creator profiles
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {walletData.creators_earnings.map((creator) => (
                <Card key={creator.creator_id} className="p-6 bg-white rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {creator.creator_picture ? (
                        <img
                          src={creator.creator_picture}
                          alt={creator.creator_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{creator.creator_name}</h4>
                        <p className="text-sm text-gray-500">
                          {creator.transaction_count} transaction{creator.transaction_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${creator.total_earned.toFixed(2)}
                      </p>
                      <Button
                        onClick={() => navigate(`/creator/${creator.creator_id}/transactions`)}
                        variant="ghost"
                        size="sm"
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <Card className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div>
              <p className="text-sm text-gray-900 font-medium mb-1">
                About withdrawals
              </p>
              <p className="text-sm text-gray-700">
                All payments are held for 7 days before becoming available to withdraw. This protects 
                both creators and customers. Once funds are available, you can request a withdrawal and 
                our admin team will process it manually. Set up your payout method to receive funds.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Wallet;
