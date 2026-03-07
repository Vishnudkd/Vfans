import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Upload, Image as ImageIcon, Video, Music, FileText, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MAX_IMAGES = 10;
const MAX_VIDEOS = 3;
const MAX_TOTAL = 10;
const MIN_PRICE = 5.99;

const CreateLink = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const [uploadedFiles, setUploadedFiles] = useState([]); // [{file, url, type, preview_url, name, size}]
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    blur_level: 'medium',
    short_link: '',
    fee_applies_to: 'seller',
    single_purchase: false,
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const imageCount = uploadedFiles.filter((f) => f.type === 'image').length;
  const videoCount = uploadedFiles.filter((f) => f.type === 'video').length;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) processFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const getFileCategory = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type === 'application/pdf') return 'pdf';
    return null;
  };

  const processFiles = (files) => {
    const valid = [];
    for (const file of files) {
      const cat = getFileCategory(file);
      if (!cat) {
        toast.error(`Unsupported file: ${file.name}`);
        continue;
      }
      const newImages = imageCount + valid.filter((f) => f.cat === 'image').length;
      const newVideos = videoCount + valid.filter((f) => f.cat === 'video').length;
      const newTotal = uploadedFiles.length + valid.length;

      if (newTotal >= MAX_TOTAL) {
        toast.error(`Maximum ${MAX_TOTAL} files allowed`);
        break;
      }
      if (cat === 'image' && newImages >= MAX_IMAGES) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        continue;
      }
      if (cat === 'video' && newVideos >= MAX_VIDEOS) {
        toast.error(`Maximum ${MAX_VIDEOS} videos allowed`);
        continue;
      }
      valid.push({ file, cat });
    }
    if (valid.length) uploadFiles(valid);
  };

  const uploadFiles = async (fileEntries) => {
    for (let i = 0; i < fileEntries.length; i++) {
      const { file } = fileEntries[i];
      setUploadingIndex(uploadedFiles.length + i);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('creator_id', creatorId);
      fd.append('blur_level', formData.blur_level);

      try {
        const res = await axios.post(`${API_URL}/api/upload`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setUploadedFiles((prev) => [
          ...prev,
          {
            file,
            url: res.data.file_url,
            type: res.data.file_type,
            preview_url: res.data.preview_url,
            name: res.data.file_name || file.name,
            size: res.data.file_size || file.size,
          },
        ]);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err.response?.data?.detail || 'Unknown error'}`);
      }
    }
    setUploadingIndex(-1);
    toast.success('Files uploaded successfully');
  };

  const removeFile = (idx) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const generateShortLink = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({ ...prev, short_link: slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || uploadedFiles.length === 0) {
      toast.error('Please fill in title, price, and upload at least one file');
      return;
    }
    const price = parseFloat(formData.price);
    if (price < MIN_PRICE) {
      toast.error(`Minimum price is $${MIN_PRICE}`);
      return;
    }

    let slug = formData.short_link;
    if (!slug) {
      slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    setIsSubmitting(true);
    const firstImage = uploadedFiles.find((f) => f.type === 'image');
    const primaryFile = firstImage || uploadedFiles[0];

    try {
      await axios.post(
        `${API_URL}/api/creators/${creatorId}/links`,
        {
          title: formData.title,
          description: formData.description,
          price,
          files: uploadedFiles.map((f) => ({
            url: f.url,
            type: f.type,
            preview_url: f.preview_url,
            name: f.name,
            size: f.size,
          })),
          file_url: primaryFile.url,
          file_type: primaryFile.type,
          preview_url: firstImage?.preview_url || null,
          blur_level: formData.blur_level,
          short_link: slug,
          fee_applies_to: formData.fee_applies_to,
          single_purchase: formData.single_purchase,
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      toast.success('Link created! Your link is now live.');
      setTimeout(() => navigate(`/creator/${creatorId}/links`), 800);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create link');
      setIsSubmitting(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getFileIcon = (type) => {
    const icons = { image: ImageIcon, video: Video, audio: Music, pdf: FileText };
    const Icon = icons[type] || Upload;
    return <Icon className="h-5 w-5" />;
  };

  const firstPreview = uploadedFiles.find((f) => f.preview_url || f.type === 'image');
  const previewSrc = firstPreview
    ? `${API_URL}${firstPreview.preview_url || firstPreview.url}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center space-x-3 max-w-6xl mx-auto">
          <Button onClick={() => navigate(`/creator/${creatorId}/links`)} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Link</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Media</h3>
                <span className="text-xs text-gray-500">
                  {uploadedFiles.length}/{MAX_TOTAL} files ({imageCount} img, {videoCount} vid)
                </span>
              </div>

              {/* Upload Zone */}
              {uploadedFiles.length < MAX_TOTAL && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${
                    dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  data-testid="upload-zone"
                >
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium text-sm mb-1">Drop files here, or browse</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Up to {MAX_IMAGES} images or {MAX_VIDEOS} videos (max {MAX_TOTAL} total)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf"
                    data-testid="file-input"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingIndex >= 0}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-sm"
                    data-testid="browse-files-btn"
                  >
                    {uploadingIndex >= 0 ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      'Browse Files'
                    )}
                  </Button>
                </div>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {f.type === 'image' && (f.preview_url || f.url) ? (
                          <img src={`${API_URL}${f.preview_url || f.url}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">{getFileIcon(f.type)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                        <p className="text-xs text-gray-500">{formatBytes(f.size)}</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(idx)} data-testid={`remove-file-${idx}`}>
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Title */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="Enter link title" required data-testid="link-title-input" />
            </Card>

            {/* Description */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description (Optional)</label>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Add a description..." rows={4} maxLength={500} className="resize-none" data-testid="link-desc-input" />
              <p className="text-xs text-gray-500 mt-2">{formData.description.length}/500</p>
            </Card>

            {/* Price */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price * (min ${MIN_PRICE})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min={MIN_PRICE}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder={MIN_PRICE.toFixed(2)}
                  className="pl-7"
                  required
                  data-testid="link-price-input"
                />
              </div>
              {formData.price && parseFloat(formData.price) >= MIN_PRICE && (
                <p className="text-sm text-gray-600 mt-2">
                  You receive: <span className="font-semibold">${(parseFloat(formData.price) * 0.8).toFixed(2)}</span> (80%)
                </p>
              )}
              {formData.price && parseFloat(formData.price) < MIN_PRICE && (
                <p className="text-sm text-red-500 mt-2">Minimum price is ${MIN_PRICE}</p>
              )}
            </Card>

            {/* Short Link */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Short Link</label>
              <div className="flex gap-2">
                <Input name="short_link" value={formData.short_link} onChange={handleChange} placeholder="custom-link" data-testid="short-link-input" />
                <Button type="button" onClick={generateShortLink} variant="outline">Generate</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">vfansmedia.com/{formData.short_link || 'your-link'}</p>
            </Card>

            {/* Fee / Single Purchase */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Fee applies on</label>
              <div className="space-y-2 mb-4">
                {['seller', 'split', 'buyer'].map((v) => (
                  <label key={v} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="fee_applies_to" value={v} checked={formData.fee_applies_to === v} onChange={handleChange} className="w-4 h-4" />
                    <span className="text-gray-700 capitalize">{v}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center space-x-3 cursor-pointer border-t pt-4">
                <input type="checkbox" name="single_purchase" checked={formData.single_purchase} onChange={handleChange} className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Single Purchase</p>
                  <p className="text-xs text-gray-600">Limit to one purchase per customer</p>
                </div>
              </label>
            </Card>
          </div>

          {/* Right Column — Preview */}
          <div className="space-y-6">
            <Card className="p-6 bg-white rounded-2xl border border-gray-200 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Link Preview</h3>

              {/* Blur Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Blur Level</label>
                <select name="blur_level" value={formData.blur_level} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" data-testid="blur-level-select">
                  <option value="blur">Blur</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>

              {/* Preview Image */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4 relative">
                {previewSrc ? (
                  <img src={previewSrc} alt="Preview" className="w-full h-64 object-cover" data-testid="link-preview-img" />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No preview available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* File summary */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {imageCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      <ImageIcon className="w-3 h-3" /> {imageCount} image{imageCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {videoCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      <Video className="w-3 h-3" /> {videoCount} video{videoCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">{formData.title || 'Your Link Title'}</h4>
                <p className="text-gray-600 text-sm line-clamp-3">{formData.description || 'Add a description...'}</p>
                <p className="text-2xl font-bold text-gray-900">${formData.price || '0.00'}</p>
              </div>
            </Card>
          </div>

          {/* Submit */}
          <div className="lg:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting || uploadingIndex >= 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-full"
              data-testid="create-link-submit"
            >
              {isSubmitting ? 'Creating Link...' : 'Create Link'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateLink;
