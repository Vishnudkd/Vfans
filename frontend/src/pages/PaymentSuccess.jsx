import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [content, setContent] = useState([]);
  const [expiresIn, setExpiresIn] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        const res = await axios.get(`${API_URL}/api/purchases/verify/${sessionId}`);
        setPurchase(res.data.purchase);
        setLinkTitle(res.data.link?.title || '');
        setContent(res.data.content || []);
        setExpiresIn(res.data.expires_in_hours || 24);
      } catch (err) {
        setError('Could not verify your purchase. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    verifyPurchase();
  }, [sessionId, API_URL]);

  const prevItem = () => setCurrentIndex((i) => (i === 0 ? content.length - 1 : i - 1));
  const nextItem = () => setCurrentIndex((i) => (i === content.length - 1 ? 0 : i + 1));

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-gray-900 text-white" data-testid="go-home-btn">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  const currentFile = content[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="payment-success-page">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 py-8">
        {/* Success Banner */}
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6" data-testid="success-banner">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Payment Successful!</p>
            <p className="text-sm text-green-700">
              Thank you for your purchase of <span className="font-medium">{linkTitle}</span>
              {purchase?.amount && <> &mdash; ${purchase.amount.toFixed(2)}</>}
            </p>
          </div>
        </div>

        {/* Expiry Notice */}
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-6">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>This content is available for {expiresIn} hours from purchase.</span>
        </div>

        {/* Content Viewer */}
        {content.length > 0 && (
          <Card className="overflow-hidden bg-white rounded-2xl border border-gray-200" data-testid="content-viewer">
            {/* Media Display */}
            <div className="relative bg-black flex items-center justify-center min-h-[400px]">
              {currentFile?.type === 'image' && (
                <img
                  src={`${API_URL}${currentFile.url}`}
                  alt={currentFile.name}
                  className="max-w-full max-h-[600px] object-contain"
                  data-testid={`content-image-${currentIndex}`}
                />
              )}
              {currentFile?.type === 'video' && (
                <video
                  src={`${API_URL}${currentFile.url}`}
                  controls
                  className="max-w-full max-h-[600px]"
                  data-testid={`content-video-${currentIndex}`}
                />
              )}
              {currentFile?.type === 'audio' && (
                <div className="p-8 text-center text-white">
                  <p className="mb-4 text-lg">{currentFile.name}</p>
                  <audio src={`${API_URL}${currentFile.url}`} controls className="w-full" data-testid={`content-audio-${currentIndex}`} />
                </div>
              )}
              {currentFile?.type === 'pdf' && (
                <iframe
                  src={`${API_URL}${currentFile.url}`}
                  className="w-full h-[600px]"
                  title={currentFile.name}
                  data-testid={`content-pdf-${currentIndex}`}
                />
              )}

              {/* Navigation Arrows */}
              {content.length > 1 && (
                <>
                  <button
                    onClick={prevItem}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                    data-testid="prev-btn"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-800" />
                  </button>
                  <button
                    onClick={nextItem}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                    data-testid="next-btn"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* File Info Bar */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate">{currentFile?.name}</p>
              {content.length > 1 && (
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {currentIndex + 1} / {content.length}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {content.length > 1 && (
              <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
                {content.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      idx === currentIndex ? 'border-green-500' : 'border-transparent hover:border-gray-300'
                    }`}
                    data-testid={`thumb-${idx}`}
                  >
                    {file.type === 'image' ? (
                      <img src={`${API_URL}${file.url}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                        {file.type}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Card>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          If you have any issues, please contact support.
        </p>
      </main>
    </div>
  );
};

export default PaymentSuccess;
