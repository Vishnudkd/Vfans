import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }} data-testid="payment-success-error">
        <div className="glass-s p-10 rounded-3xl max-w-sm text-center">
          <h1 className="text-lg font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-white/35 text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-full bg-white/8 hover:bg-white/12 text-white/70 text-sm transition-all border border-white/10" data-testid="go-home-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .glass-s {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .glass-nav {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }
        .glass-nav:hover { background: rgba(255,255,255,0.14); }
        .thumb-on { border-color: rgba(52,211,153,0.5); box-shadow: 0 0 10px rgba(52,211,153,0.15); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-d1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-d2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-d3 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }} data-testid="payment-success-page">
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 15%, rgba(52,211,153,0.04) 0%, transparent 50%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto px-5 py-10 flex flex-col min-h-screen">

          {/* Thank You */}
          <div className="text-center mb-6 fade-up">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 mb-4">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <h1 className="text-xl font-semibold text-white/90 mb-1">Thank you, enjoy your content</h1>
          </div>

          {/* Timer pill */}
          <div className="flex justify-center mb-6 fade-up fade-up-d1">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] text-amber-300/50 bg-amber-500/[0.06] border border-amber-400/10">
              <Clock className="h-3 w-3" /> Available for {expiresIn}h
            </span>
          </div>

          {/* Content Viewer */}
          {content.length > 0 && (
            <div className="glass-s rounded-3xl overflow-hidden flex-1 flex flex-col fade-up fade-up-d2" data-testid="content-viewer">
              {/* Media */}
              <div className="relative bg-black/30 flex items-center justify-center flex-1 min-h-[360px]">
                {currentFile?.type === 'image' && (
                  <img src={`${API_URL}${currentFile.url}`} alt={currentFile.name} className="max-w-full max-h-[550px] object-contain" data-testid={`content-image-${currentIndex}`} />
                )}
                {currentFile?.type === 'video' && (
                  <video src={`${API_URL}${currentFile.url}`} controls className="max-w-full max-h-[550px]" data-testid={`content-video-${currentIndex}`} />
                )}
                {currentFile?.type === 'audio' && (
                  <div className="p-8 text-center w-full">
                    <p className="mb-4 text-white/50 text-sm">{currentFile.name}</p>
                    <audio src={`${API_URL}${currentFile.url}`} controls className="w-full" data-testid={`content-audio-${currentIndex}`} />
                  </div>
                )}
                {currentFile?.type === 'pdf' && (
                  <iframe src={`${API_URL}${currentFile.url}`} className="w-full h-[550px]" title={currentFile.name} data-testid={`content-pdf-${currentIndex}`} />
                )}

                {content.length > 1 && (
                  <>
                    <button onClick={prevItem} className="glass-nav absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" data-testid="prev-btn">
                      <ChevronLeft className="h-4 w-4 text-white/50" />
                    </button>
                    <button onClick={nextItem} className="glass-nav absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" data-testid="next-btn">
                      <ChevronRight className="h-4 w-4 text-white/50" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-3 flex items-center justify-between border-t border-white/[0.05]">
                <p className="text-[11px] text-white/30 truncate">{currentFile?.name}</p>
                {content.length > 1 && <span className="text-[10px] text-white/20 ml-2">{currentIndex + 1}/{content.length}</span>}
              </div>

              {/* Thumbnails */}
              {content.length > 1 && (
                <div className="px-5 pb-4 flex gap-2 overflow-x-auto">
                  {content.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === currentIndex ? 'thumb-on' : 'border-transparent hover:border-white/10'}`}
                      data-testid={`thumb-${idx}`}
                    >
                      {file.type === 'image' ? (
                        <img src={`${API_URL}${file.url}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-[8px] text-white/20">{file.type}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-center text-[10px] text-white/10 mt-6 fade-up fade-up-d3">Need help? Contact support</p>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
