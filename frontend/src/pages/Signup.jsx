import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signup(formData.email, formData.password, formData.fullName);
      
      if (result.success) {
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to VFans Media. Redirecting to your dashboard...",
        });
        
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast({
          title: "Signup Failed",
          description: result.error,
          variant: "destructive",
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

  const benefits = [
    'Keep 80% of your sales',
    'Unlimited content uploads',
    'Instant payment processing',
    'No monthly fees',
    'Analytics dashboard',
    '24/7 support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Benefits */}
            <div className="lg:sticky lg:top-32">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Start Selling Your Content Today
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of creators earning money by sharing their content through simple, shareable links.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-black font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column - Signup Form */}
            <Card className="p-8 border-2 border-gray-100 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name (Optional)
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>

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
                      placeholder="At least 8 characters"
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

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      handleChange({ target: { name: 'agreeToTerms', type: 'checkbox', checked } })
                    }
                    className={errors.agreeToTerms ? 'border-red-500' : ''}
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-black font-semibold hover:underline" target="_blank">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy-policy" className="text-black font-semibold hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By creating an account, you agree to receive promotional emails from VFans Media. 
                  You can unsubscribe at any time.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
