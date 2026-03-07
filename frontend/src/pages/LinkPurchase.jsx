import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Lock, ShieldCheck, Zap, Download, Image as ImageIcon, Video, Music, FileText, Loader2 } from 'lucide-react';

const FILE_TYPE_ICONS = { image: ImageIcon, video: Video, audio: Music, pdf: FileText };

const LinkPurchase = () => {
  const { shortLink } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/links/by-slug/${shortLink}`);
        setLink(response.data);
        setCreatorInfo(response.data.creator_info);
      } catch (err) {
        setError('Link not found or unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [shortLink, API_URL]);

  const handlePurchase = async () => {
    if (!email) { setError('Please enter your email address'); return; }
    setPurchasing(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/links/${link.id}/checkout`, { email });
      window.location.href = response.data.url;
    } catch (err) {
      setError('Failed to start checkout. Please try again.');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)' }} data-testid="link-purchase-loading">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)' }} data-testid="link-purchase-error">
        <div className="text-center max-w-sm glass-card p-10 rounded-3xl">
          <Lock className="h-10 w-10 text-white/30 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Link Not Found</h1>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-sm transition-all" data-testid="go-home-btn">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  const creatorInitial = creatorInfo?.name?.charAt(0)?.toUpperCase() || 'C';
  const previewSrc = link?.preview_url ? `${API_URL}${link.preview_url}` : (link?.file_type === 'image' ? `${API_URL}${link.file_url}` : null);
  const files = link?.files || [];
  const imgCount = files.filter((f) => f.type === 'image').length || (link?.file_type === 'image' ? 1 : 0);
  const vidCount = files.filter((f) => f.type === 'video').length || (link?.file_type === 'video' ? 1 : 0);
  const totalSize = files.reduce((s, f) => s + (f.size || 0), 0);

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .glass-card-light {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .glass-input {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.3); }
        .glass-input:focus {
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.05);
          outline: none;
        }
        .glass-btn {
          background: linear-gradient(135deg, rgba(52,211,153,0.85) 0%, rgba(16,185,129,0.9) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 4px 24px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        .glass-btn:hover {
          box-shadow: 0 6px 32px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.25);
          transform: translateY(-1px);
        }
        .glass-btn:active { transform: translateY(0); }
        .glass-tag {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .float-anim { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen relative overflow-hidden" data-testid="link-purchase-page">
        {/* Background: blurred preview stretched full */}
        <div className="fixed inset-0 z-0">
          {previewSrc ? (
            <img src={previewSrc} alt="" className="w-full h-full object-cover scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          )}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(52,211,153,0.06) 0%, transparent 60%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col px-5 py-6">

          {/* Hero Glass Card */}
          <div className="glass-card rounded-3xl overflow-hidden mb-6">
            {/* Preview image area */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {previewSrc ? (
                <img src={previewSrc} alt="" className="w-full h-full object-cover" data-testid="preview-image" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-white/5 to-white/[0.02]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating lock */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="float-anim w-16 h-16 rounded-2xl glass-card-light flex items-center justify-center mb-3" style={{ borderRadius: '20px' }}>
                  <Lock className="h-6 w-6 text-white/70" />
                </div>
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/40 mb-1">Unlock for</p>
                <p className="text-3xl font-bold text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }} data-testid="hero-price">
                  ${link?.price?.toFixed(2)} <span className="text-sm font-normal text-white/40">USD</span>
                </p>
              </div>
            </div>
          </div>

          {/* Info Glass Card */}
          <div className="glass-card rounded-3xl px-6 py-5 mb-4">
            {/* Creator */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full glass-card-light flex items-center justify-center flex-shrink-0">
                {creatorInfo?.profile_picture ? (
                  <img src={creatorInfo.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-white/60">{creatorInitial}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white text-sm" data-testid="creator-name">{creatorInfo?.name || 'Creator'}</span>
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-[11px] text-white/35 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>
              </div>
            </div>

            <div className="h-px bg-white/[0.06] mb-4" />

            {/* Title */}
            <h1 className="text-lg font-bold text-white mb-3" data-testid="link-title">{link?.title}</h1>

            {/* File Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {imgCount > 0 && (
                <span className="glass-tag inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/50">
                  <ImageIcon className="w-3 h-3" />{imgCount} image{imgCount > 1 ? 's' : ''}
                </span>
              )}
              {vidCount > 0 && (
                <span className="glass-tag inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/50">
                  <Video className="w-3 h-3" />{vidCount} video{vidCount > 1 ? 's' : ''}
                </span>
              )}
              {totalSize > 0 && (
                <span className="glass-tag inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/50">
                  <Download className="w-3 h-3" />{totalSize < 1048576 ? `${(totalSize / 1024).toFixed(1)} KB` : `${(totalSize / 1048576).toFixed(1)} MB`}
                </span>
              )}
            </div>

            {link?.description && (
              <p className="text-sm text-white/40 mb-4" data-testid="link-description">{link.description}</p>
            )}

            <div className="h-px bg-white/[0.06] mb-4" />

            {/* Price */}
            <p className="text-3xl font-bold text-white mb-5" data-testid="link-price">
              ${link?.price?.toFixed(2)} <span className="text-sm font-normal text-white/35">USD</span>
            </p>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-white/40 mb-1.5 tracking-wide uppercase">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                data-testid="email-input"
              />
            </div>

            {error && <p className="text-red-400/80 text-xs mb-3" data-testid="purchase-error">{error}</p>}

            {/* CTA */}
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="glass-btn w-full py-4 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="unlock-btn"
            >
              {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {purchasing ? 'Processing...' : `Unlock for $${link?.price?.toFixed(2)}`}
            </button>

            {/* Trust */}
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-white/25">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure payment</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" />Instant access</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" />Private</span>
            </div>

            <p className="text-center text-[10px] text-white/20 mt-3">
              By purchasing, you agree to our <a href="/terms-of-service" className="underline text-white/30 hover:text-white/40">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkPurchase;
