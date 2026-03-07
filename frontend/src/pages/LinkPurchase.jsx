import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Eye, Lock, ShoppingCart, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51T5Q6eL7vEm8r4pQSmpPI1423tWnbETn4TeKB8wjPV60KELPtRHmydFpXlnsrSwZ3f0FhMU1Df2n63vl7G1vQCEd00nTPxzj1X');

const LinkPurchase = () => {
  const { shortLink } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/links/by-slug/${shortLink}`);
        setLink(response.data);
      } catch (error) {
        setError('Link not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [shortLink, API_URL]);

  const handlePurchase = async () => {
    setPurchasing(true);

    try {
      const response = await axios.post(`${API_URL}/api/links/${link.id}/checkout`);
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        setError(error.message);
        setPurchasing(false);
      }
    } catch (error) {
      setError('Failed to start checkout. Please try again.');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'This link may have been removed or is no longer available.'}</p>
            <Button onClick={() => navigate('/')} className="bg-gray-900 text-white">
              Go to Homepage
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <Card className="overflow-hidden">
              {link.preview_url || link.file_type === 'image' ? (
                <img
                  src={`${API_URL}${link.preview_url || link.file_url}`}
                  alt={link.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                  <Lock className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{link.title}</h1>
              {link.description && (
                <p className="text-gray-600">{link.description}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{link.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span>{link.purchases} purchased</span>
              </div>
            </div>

            {/* Price Card */}
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-4xl font-bold text-gray-900">${link.price.toFixed(2)}</p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-full"
              >
                {purchasing ? 'Processing...' : 'Purchase Now'}
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Secure payment</p>
                    <p>Powered by Stripe. Your payment information is encrypted and secure.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* What You Get */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What you'll get:</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Instant access to content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Download link via email</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lifetime access</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkPurchase;
