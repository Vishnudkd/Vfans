import React from 'react';
import { Upload, DollarSign, Share2 } from 'lucide-react';
import { Card } from './ui/card';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Upload Your Content',
      description: 'Photos, videos, files, pdf, anything you want to sell.',
      icon: Upload,
      image: 'https://images.unsplash.com/photo-1618661148759-0d481c0c2116?w=800&h=600&fit=crop'
    },
    {
      number: '2',
      title: 'Set Your Price',
      description: 'Set your price to unlock the content.',
      icon: DollarSign,
      image: 'https://images.unsplash.com/photo-1641886336879-340cc977163c?w=800&h=600&fit=crop'
    },
    {
      number: '3',
      title: 'Share Your Link',
      description: 'Share your link and get paid instantly.',
      icon: Share2,
      image: 'https://images.unsplash.com/photo-1636971828014-0f3493cba88a?w=800&h=600&fit=crop'
    }
  ];

  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative group">
                <Card className="p-8 h-full border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                      {step.number}
                    </div>
                    <Icon className="h-8 w-8 text-black mb-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {step.description}
                  </p>
                  <div className="rounded-lg overflow-hidden mt-4">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;