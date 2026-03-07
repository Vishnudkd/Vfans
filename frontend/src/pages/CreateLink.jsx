import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Upload, Image as ImageIcon, Video, Music, FileText, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreateLink = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    file_url: '',
    file_type: '',
    preview_url: '',
    blur_level: 'medium',
    short_link: '',
    fee_applies_to: 'seller',
    single_purchase: false
  });

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('creator_id', creatorId);
    formData.append('blur_level', formData.blur_level || 'medium');

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedFile(file);
      setFormData(prev => ({
        ...prev,
        file_url: response.data.file_url,
        file_type: response.data.file_type,
        preview_url: response.data.preview_url
      }));

      // Set preview URL for display
      if (response.data.preview_url) {
        setPreviewUrl(`${API_URL}${response.data.preview_url}`);
      } else if (response.data.file_type === 'image') {
        setPreviewUrl(`${API_URL}${response.data.file_url}`);
      }

      toast({
        title: "File Uploaded! ✅",
        description: "Your file has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.response?.data?.detail || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({
      ...prev,
      file_url: '',
      file_type: '',
      preview_url: ''
    }));
  };

  const generateShortLink = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, short_link: slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.file_url) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in title, price, and upload a file",
        variant: "destructive",
      });
      return;
    }

    if (!formData.short_link) {
      generateShortLink();
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        `${API_URL}/api/creators/${creatorId}/links`,
        {
          ...formData,
          price: parseFloat(formData.price)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Link Created! 🎉",
        description: "Your link is now live and ready to share",
      });

      setTimeout(() => {
        navigate(`/creator/${creatorId}/links`);
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to Create Link",
        description: error.response?.data?.detail || "Please try again",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const calculateSellerReceives = () => {
    const price = parseFloat(formData.price) || 0;
    return (price * 0.8).toFixed(2);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <ImageIcon className="h-8 w-8" />;
      case 'video': return <Video className="h-8 w-8" />;
      case 'audio': return <Music className="h-8 w-8" />;
      case 'pdf': return <FileText className="h-8 w-8" />;
      default: return <Upload className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate(`/creator/${creatorId}/links`)}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">VFans Media</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Link</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Media</h3>
              
              {!uploadedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Drop your file here, or browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports: Images, Videos, Audio, PDFs
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf"
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={isUploading}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {isUploading ? 'Uploading...' : 'Browse Files'}
                  </Button>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-600">
                        {getFileIcon(formData.file_type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Title */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter link title"
                required
              />
            </Card>

            {/* Description */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description (Optional)
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a description..."
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.description.length}/500 characters
              </p>
            </Card>

            {/* Price */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="pl-7"
                  required
                />
              </div>
              {formData.price && (
                <p className="text-sm text-gray-600 mt-2">
                  You receive: <span className="font-semibold">${calculateSellerReceives()}</span> (80%)
                </p>
              )}
            </Card>

            {/* Short Link */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Short Link
              </label>
              <div className="flex gap-2">
                <Input
                  name="short_link"
                  value={formData.short_link}
                  onChange={handleChange}
                  placeholder="custom-link"
                />
                <Button
                  type="button"
                  onClick={generateShortLink}
                  variant="outline"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your link: vfansmedia.com/{formData.short_link || 'your-link'}
              </p>
            </Card>

            {/* Fee Applies To */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Fee applies on
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fee_applies_to"
                    value="seller"
                    checked={formData.fee_applies_to === 'seller'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Seller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fee_applies_to"
                    value="split"
                    checked={formData.fee_applies_to === 'split'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Split</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fee_applies_to"
                    value="buyer"
                    checked={formData.fee_applies_to === 'buyer'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">Buyer</span>
                </label>
              </div>
            </Card>

            {/* Single Purchase */}
            <Card className="p-6 bg-white rounded-2xl border border-gray-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="single_purchase"
                  checked={formData.single_purchase}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <div>
                  <p className="font-semibold text-gray-900">Single Purchase</p>
                  <p className="text-sm text-gray-600">
                    Limit this link to one purchase per customer
                  </p>
                </div>
              </label>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card className="p-6 bg-white rounded-2xl border border-gray-200 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">Link Preview</h3>
              
              {/* Blur Level Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blur Level
                </label>
                <select
                  name="blur_level"
                  value={formData.blur_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="blur">Blur</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>

              {/* Preview */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400">No preview available</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">
                  {formData.title || 'Your Link Title'}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {formData.description || 'Add a description to your link...'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formData.price || '0.00'}
                </p>
              </div>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg rounded-full"
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
