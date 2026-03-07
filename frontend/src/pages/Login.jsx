import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Hide resend button when user types
    setShowResendButton(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setResendingEmail(true);

    try {
      await axios.post(`${API_URL}/api/resend-verification`, formData.email, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      toast({
        title: "Verification Email Sent! 📧",
        description: "Please check your inbox for the verification link.",
      });
      setShowResendButton(false);
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: error.response?.data?.detail || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowResendButton(false);

    try {
      // Check if this is the demo user and reset their data
      if (formData.email === 'demo@vfans.com') {
        try {
          await axios.post(`${API_URL}/api/demo/reset`);
        } catch (error) {
          // If demo user doesn't exist, initialize it
          await axios.post(`${API_URL}/api/demo/initialize`);
        }
      }

      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Login Successful!",
          description: formData.email === 'demo@vfans.com' 
            ? "Demo mode activated! Starting fresh onboarding flow..." 
            : "Welcome back to VFans Media. Redirecting...",
        });
        
        // For demo user, always go to create organization
        if (formData.email === 'demo@vfans.com') {
          setTimeout(() => {
            navigate('/create-organization');
          }, 1000);
          return;
        }
        
        // Get the token from localStorage after login
        const authToken = localStorage.getItem('token');
        
        // Check if user has organization and creators
        setTimeout(async () => {
          try {
            const orgResponse = await axios.get(`${API_URL}/api/organizations`, {
              headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (orgResponse.data) {
              // Has organization, check for creators
              const creatorsResponse = await axios.get(`${API_URL}/api/creators`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
              });
              
              if (creatorsResponse.data && creatorsResponse.data.length > 0) {
                // Redirect to first creator's dashboard
                navigate(`/creator/${creatorsResponse.data[0].id}/dashboard`);
              } else {
                // Has org but no creators, this shouldn't happen but redirect to create creator
                navigate('/create-creator');
              }
            }
          } catch (error) {
            // If 404, user doesn't have organization yet
            if (error.response?.status === 404) {
              navigate('/create-organization');
            } else {
              // Other error, try to navigate to create organization
              navigate('/create-organization');
            }
          }
        }, 800);
      } else {
        // Check if error is about email verification
        if (result.error && result.error.includes('verify your email')) {
          setShowResendButton(true);
        }
        
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
          duration: 6000,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-600">
              Sign in to your VFans Media account
            </p>
          </div>

          <Card className="p-8 border-2 border-gray-100 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-black font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Resend Verification Button */}
              {showResendButton && (
                <Button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  variant="outline"
                  className="w-full mt-3 py-6 text-lg rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-black font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms-of-service" className="text-black hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy-policy" className="text-black hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
