import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      if (!sessionId) { setError('No session ID found'); setLoading(false); return; }
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

  const currentFile = content[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }} data-testid="payment-success-loading">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400/60 mx-auto mb-4" />
          <p className="text-white/40 text-sm">Verifying your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }} data-testid="payment-success-error">
        <div className="glass-card-success p-10 rounded-3xl max-w-md text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-sm transition-all" data-testid="go-home-btn">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .glass-card-success {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .glass-light {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .glass-success-banner {
          background: linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(52,211,153,0.06) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(52,211,153,0.15);
        }
        .glass-warn-banner {
          background: linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.04) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(251,191,36,0.12);
        }
        .glass-nav-btn {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .glass-nav-btn:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.2);
        }
        .thumb-active {
          border: 2px solid rgba(52,211,153,0.6);
          box-shadow: 0 0 12px rgba(52,211,153,0.2);
        }
      `}</style>

      <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }} data-testid="payment-success-page">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 20%, rgba(52,211,153,0.05) 0%, transparent 50%)' }} />

        {/* Header */}
        <header className="relative z-10 glass-light">
          <div className="max-w-3xl mx-auto px-5 py-4">
            <h1 className="text-lg font-bold text-white/80">VFans Media</h1>
          </div>
        </header>

        <main className="relative z-10 max-w-2xl mx-auto p-5 py-8">
          {/* Success Banner */}
          <div className="glass-success-banner rounded-2xl p-4 mb-4 flex items-center gap-3" data-testid="success-banner">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-300 text-sm">Payment Successful!</p>
              <p className="text-xs text-emerald-400/60">
                {linkTitle}{purchase?.amount ? ` — $${purchase.amount.toFixed(2)}` : ''}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="glass-warn-banner rounded-xl px-4 py-2.5 mb-6 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-amber-400/70 flex-shrink-0" />
            <span className="text-xs text-amber-300/60">Content available for {expiresIn} hours from purchase</span>
          </div>

          {/* Content Viewer */}
          {content.length > 0 && (
            <div className="glass-card-success rounded-3xl overflow-hidden" data-testid="content-viewer">
              {/* Media Display */}
              <div className="relative bg-black/40 flex items-center justify-center min-h-[360px]">
                {currentFile?.type === 'image' && (
                  <img
                    src={`${API_URL}${currentFile.url}`}
                    alt={currentFile.name}
                    className="max-w-full max-h-[550px] object-contain"
                    data-testid={`content-image-${currentIndex}`}
                  />
                )}
                {currentFile?.type === 'video' && (
                  <video
                    src={`${API_URL}${currentFile.url}`}
                    controls
                    className="max-w-full max-h-[550px]"
                    data-testid={`content-video-${currentIndex}`}
                  />
                )}
                {currentFile?.type === 'audio' && (
                  <div className="p-8 text-center">
                    <p className="mb-4 text-white/60">{currentFile.name}</p>
                    <audio src={`${API_URL}${currentFile.url}`} controls className="w-full" data-testid={`content-audio-${currentIndex}`} />
                  </div>
                )}
                {currentFile?.type === 'pdf' && (
                  <iframe
                    src={`${API_URL}${currentFile.url}`}
                    className="w-full h-[550px]"
                    title={currentFile.name}
                    data-testid={`content-pdf-${currentIndex}`}
                  />
                )}

                {/* Nav Arrows */}
                {content.length > 1 && (
                  <>
                    <button onClick={prevItem} className="glass-nav-btn absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center" data-testid="prev-btn">
                      <ChevronLeft className="h-5 w-5 text-white/60" />
                    </button>
                    <button onClick={nextItem} className="glass-nav-btn absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center" data-testid="next-btn">
                      <ChevronRight className="h-5 w-5 text-white/60" />
                    </button>
                  </>
                )}
              </div>

              {/* Info bar */}
              <div className="px-5 py-3 flex items-center justify-between border-t border-white/[0.06]">
                <p className="text-xs text-white/40 truncate">{currentFile?.name}</p>
                {content.length > 1 && (
                  <span className="text-[10px] text-white/25 ml-2 flex-shrink-0">{currentIndex + 1} / {content.length}</span>
                )}
              </div>

              {/* Thumbnails */}
              {content.length > 1 && (
                <div className="px-5 pb-4 flex gap-2 overflow-x-auto">
                  {content.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        idx === currentIndex ? 'thumb-active' : 'border-transparent hover:border-white/15'
                      }`}
                      data-testid={`thumb-${idx}`}
                    >
                      {file.type === 'image' ? (
                        <img src={`${API_URL}${file.url}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-[9px] text-white/30">{file.type}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-center text-[11px] text-white/15 mt-8">
            If you have any issues, please contact support.
          </p>
        </main>
      </div>
    </>
  );
};

export default PaymentSuccess;
