import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Lock, ShieldCheck, Zap, Download, Image as ImageIcon, Video, Music, FileText, Loader2 } from 'lucide-react';

const FILE_TYPE_ICONS = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  pdf: FileText,
};

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
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setPurchasing(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/api/links/${link.id}/checkout`, { email });
      // Redirect to Stripe checkout URL directly
      window.location.href = response.data.url;
    } catch (err) {
      setError('Failed to start checkout. Please try again.');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" data-testid="link-purchase-loading">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error && !link) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="link-purchase-error">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline" data-testid="go-home-btn">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const FileIcon = FILE_TYPE_ICONS[link?.file_type] || ImageIcon;
  const creatorInitial = creatorInfo?.name?.charAt(0)?.toUpperCase() || 'C';
  const previewSrc = link?.preview_url ? `${API_URL}${link.preview_url}` : (link?.file_type === 'image' ? `${API_URL}${link.file_url}` : null);

  // Build file count tags from files array
  const files = link?.files || [];
  const imgCount = files.filter((f) => f.type === 'image').length || (link?.file_type === 'image' ? 1 : 0);
  const vidCount = files.filter((f) => f.type === 'video').length || (link?.file_type === 'video' ? 1 : 0);
  const audioCount = files.filter((f) => f.type === 'audio').length || (link?.file_type === 'audio' ? 1 : 0);
  const pdfCount = files.filter((f) => f.type === 'pdf').length || (link?.file_type === 'pdf' ? 1 : 0);
  const totalSize = files.reduce((s, f) => s + (f.size || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50" data-testid="link-purchase-page">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
        {/* Hero: Blurred Preview with Overlay */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
          {previewSrc ? (
            <img
              src={previewSrc}
              alt=""
              className="w-full h-full object-cover"
              data-testid="preview-image"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-400 to-gray-600" />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Lock icon + price overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
              <Lock className="h-6 w-6 text-white/80" />
            </div>
            <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">Unlock for</p>
            <p className="text-white text-3xl font-bold" data-testid="hero-price">
              ${link?.price?.toFixed(2)} <span className="text-base font-normal text-white/70">USD</span>
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5 py-5">
          {/* Creator Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
              {creatorInfo?.profile_picture ? (
                <img src={creatorInfo.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-gray-600">{creatorInitial}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900 text-sm" data-testid="creator-name">{creatorInfo?.name || 'Creator'}</span>
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mb-4" />

          {/* Link Title */}
          <h1 className="text-lg font-bold text-gray-900 mb-3" data-testid="link-title">{link?.title}</h1>

          {/* File Info Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {imgCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                <ImageIcon className="w-3.5 h-3.5" />
                {imgCount} image{imgCount > 1 ? 's' : ''}
              </span>
            )}
            {vidCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                <Video className="w-3.5 h-3.5" />
                {vidCount} video{vidCount > 1 ? 's' : ''}
              </span>
            )}
            {audioCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                <Music className="w-3.5 h-3.5" />
                {audioCount} audio
              </span>
            )}
            {pdfCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                <FileText className="w-3.5 h-3.5" />
                {pdfCount} document{pdfCount > 1 ? 's' : ''}
              </span>
            )}
            {totalSize > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                <Download className="w-3.5 h-3.5" />
                {totalSize < 1048576 ? `${(totalSize / 1024).toFixed(1)} KB` : `${(totalSize / 1048576).toFixed(1)} MB`}
              </span>
            )}
          </div>

          {link?.description && (
            <p className="text-sm text-gray-600 mb-4" data-testid="link-description">{link.description}</p>
          )}

          <div className="border-t border-gray-100 mb-4" />

          {/* Price */}
          <div className="mb-5">
            <p className="text-3xl font-bold text-gray-900" data-testid="link-price">
              ${link?.price?.toFixed(2)} <span className="text-base font-normal text-gray-500">USD</span>
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Email address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              className="w-full"
              data-testid="email-input"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-3" data-testid="purchase-error">{error}</p>
          )}

          {/* CTA Button */}
          <Button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-base font-semibold rounded-full"
            data-testid="unlock-btn"
          >
            {purchasing ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            {purchasing ? 'Processing...' : `Unlock for $${link?.price?.toFixed(2)}`}
          </Button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure payment
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Instant access
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              Private download
            </span>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-4 mb-2">
            By purchasing, you agree to our{' '}
            <a href="/terms-of-service" className="underline text-gray-500 hover:text-gray-700">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkPurchase;
