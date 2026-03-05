import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { HelpCircle, Book, MessageSquare, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Support = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Support Ticket Created!",
        description: "We'll respond to your inquiry within 24 hours.",
      });
      setFormData({ name: '', email: '', category: '', subject: '', description: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'Getting Started',
      description: 'New to VFans Media? Learn the basics of creating and selling content.',
    },
    {
      icon: Book,
      title: 'Account & Billing',
      description: 'Questions about your account, payments, or withdrawals.',
    },
    {
      icon: MessageSquare,
      title: 'Technical Support',
      description: 'Experiencing technical issues? We\'re here to help.',
    },
    {
      icon: AlertCircle,
      title: 'Report an Issue',
      description: 'Report content violations, bugs, or security concerns.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Support Center</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get help with your VFans Media account, troubleshoot issues, and find answers to your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="p-6 border-2 border-gray-100 hover:border-gray-300 transition-all duration-300">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit a Support Request</h2>
              <p className="text-gray-600 mb-6">Can't find what you're looking for? Submit a ticket and our team will get back to you.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select onValueChange={handleCategoryChange} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="getting-started">Getting Started</SelectItem>
                      <SelectItem value="account-billing">Account & Billing</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="report">Report an Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full"
                    placeholder="Please provide as much detail as possible..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
                </Button>
              </form>
            </Card>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need immediate assistance?</h3>
              <p className="text-gray-600 mb-4">
                For urgent matters, email us directly at <strong>support@vfansmedia.com</strong>
              </p>
              <p className="text-sm text-gray-500">
                Average response time: 24 hours<br />
                Priority support available for verified creators
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;