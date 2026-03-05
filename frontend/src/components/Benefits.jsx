import React from 'react';
import { Zap, Shield, Share2, CreditCard } from 'lucide-react';
import { Button } from './ui/button';

const Benefits = () => {
  const features = [
    {
      icon: Zap,
      title: 'Quick Earnings',
      description: 'Upload your photo, set a price, and start earning right away.'
    },
    {
      icon: Shield,
      title: 'Complete Control',
      description: 'Set your price, choose your content, and stay in charge of your sales.'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your links anywhere.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Track your earnings and receive payments directly with no hidden fees.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Benefits
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Instant profits from a simple click
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No more emails, no paypal refunds, no payment failures, or sign-up forms.
            <br />
            Clients pay through the link and get instant access to the content you upload.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;