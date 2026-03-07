import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPurchase = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/purchases/verify/${sessionId}`);
        setPurchase(response.data.purchase);
        setLink(response.data.link);
      } catch (err) {
        setError('Could not verify your purchase. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPurchase();
  }, [sessionId, API_URL]);

  const handleDownload = () => {
    if (link?.file_url) {
      window.open(`${API_URL}${link.file_url}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="payment-success-loading">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" data-testid="payment-success-error">
        <Card className="p-12 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-gray-900 text-white" data-testid="go-home-btn">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="payment-success-page">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 py-16">
        <Card className="p-8 text-center" data-testid="success-card">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your content is ready to download.
          </p>

          {link && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-500 mb-1">Content</p>
                <p className="font-semibold text-gray-900">{link.title}</p>
              </div>

              {purchase && (
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                  <p className="font-semibold text-gray-900">${purchase.amount?.toFixed(2)}</p>
                </div>
              )}

              <Button
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-full"
                data-testid="download-content-btn"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Content
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent. If you have any issues, please contact support.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PaymentSuccess;
