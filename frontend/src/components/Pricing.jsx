import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check } from 'lucide-react';

const Pricing = () => {
  const features = [
    'Free access to all CRM features',
    'Only 20% on your sales',
    'Upload any file format',
    'Create unlimited links',
    'Receive push notifications',
    '24/7 Support'
  ];

  const testimonials = [
    'https://images.unsplash.com/photo-1618661148759-0d481c0c2116?w=200&h=200&fit=crop&crop=faces',
    'https://images.pexels.com/photos/15340590/pexels-photo-15340590.jpeg?w=200&h=200&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1?w=200&h=200&fit=crop&crop=faces',
    'https://images.pexels.com/photos/12432848/pexels-photo-12432848.jpeg?w=200&h=200&fit=crop&crop=faces'
  ];

  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Pricing
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Start today and get 80% on all your sales.
          </p>
        </div>

        <Card className="p-12 border-2 border-gray-200 shadow-xl">
          <div className="space-y-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <Link to="/signup">
            <Button 
              size="lg" 
              className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 mb-8"
            >
              Get Started
            </Button>
          </Link>

          <div className="text-center pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center space-x-(-3) mb-4">
              {testimonials.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  style={{ marginLeft: index > 0 ? '-12px' : '0' }}
                />
              ))}
            </div>
            <p className="text-gray-600 font-medium">
              Trusted by 1000+ creators worldwide
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;