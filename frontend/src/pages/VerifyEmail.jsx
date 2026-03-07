import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  
  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/verify-email/${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.detail || 
          'Failed to verify email. The link may have expired or is invalid.'
        );
      }
    };

    verifyEmail();
  }, [token, API_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 border-2 border-gray-100 shadow-xl">
            <div className="text-center">
              {status === 'verifying' && (
                <>
                  <Loader2 className="h-16 w-16 text-gray-400 animate-spin mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Verifying Your Email
                  </h1>
                  <p className="text-gray-600">
                    Please wait while we verify your email address...
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Email Verified! ✅
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {message}
                  </p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
                  >
                    Continue to Login
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Verification Failed
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {message}
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/signup')}
                      className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
                    >
                      Sign Up Again
                    </Button>
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="w-full py-6 text-lg rounded-full"
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          {status === 'success' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Your account is now fully activated. You can log in and start sharing your content!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
