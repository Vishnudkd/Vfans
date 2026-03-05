import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from './ui/card';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for an account, upload your content, set your price, and share your unique link. You can start earning right away!'
    },
    {
      question: 'How do I get paid?',
      answer: 'Payments are processed instantly and transferred directly to your account. You can withdraw your earnings at any time with no delays.'
    },
    {
      question: 'Is there a fee for using VFans Media?',
      answer: 'We take only 20% commission on your sales. There are no hidden fees, subscription costs, or setup charges. You keep 80% of everything you earn.'
    },
    {
      question: 'What types of content can I upload?',
      answer: 'You can upload any type of digital content including photos, videos, PDFs, eBooks, courses, audio files, and more. We support all major file formats.'
    },
    {
      question: 'How do I know if my content is selling well?',
      answer: 'Our dashboard provides real-time analytics showing your sales, earnings, views, and customer insights. You can track your performance at any time.'
    },
    {
      question: 'Can I update or remove my content later?',
      answer: 'Yes! You have complete control over your content. You can update prices, modify content, or remove listings at any time from your dashboard.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            FAQ's
          </h3>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Got Questions? We've Got Answers
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;