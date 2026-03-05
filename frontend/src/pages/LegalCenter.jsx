import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { FileText, Shield, RefreshCw, Users, AlertCircle, Flag, UserCheck, Scale } from 'lucide-react';

const LegalCenter = () => {
  const legalDocs = [
    {
      title: 'Privacy Policy',
      description: 'Learn how we collect, use, and protect your personal information.',
      icon: Shield,
      link: '/privacy-policy'
    },
    {
      title: 'Terms of Service',
      description: 'Understand the rules and guidelines for using VFans Media.',
      icon: FileText,
      link: '/terms-of-service'
    },
    {
      title: 'Refund Policy',
      description: 'Our policy on refunds and dispute resolution.',
      icon: RefreshCw,
      link: '/refund-policy'
    },
    {
      title: 'Affiliate Terms',
      description: 'Terms and conditions for our affiliate program.',
      icon: Users,
      link: '/affiliate-terms'
    },
    {
      title: 'Usage Policy',
      description: 'Acceptable use guidelines for our platform.',
      icon: AlertCircle,
      link: '/usage-policy'
    },
    {
      title: 'DMCA Takedown',
      description: 'Copyright infringement reporting and DMCA procedures.',
      icon: Flag,
      link: '/dmca-takedown'
    },
    {
      title: 'Complaints & Removal Policy',
      description: 'How to report violations and request content removal.',
      icon: AlertCircle,
      link: '/complaints-removal'
    },
    {
      title: 'Content Provider Agreement',
      description: 'Agreement for creators selling content on our platform.',
      icon: UserCheck,
      link: '/content-provider-agreement'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Scale className="h-16 w-16 mx-auto mb-6 text-black" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Legal Center</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access all legal documents, policies, and terms that govern your use of VFans Media.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalDocs.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <Link key={index} to={doc.link}>
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-300 group">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                          <Icon className="h-6 w-6 text-black group-hover:text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 flex-grow">
                        {doc.description}
                      </p>
                      <div className="mt-4 text-sm font-semibold text-black group-hover:underline">
                        Read More →
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-6">
              If you have questions about our legal policies or need clarification on any terms, please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Support:</strong> <a href="mailto:support@vfansmedia.com" className="text-black hover:underline">support@vfansmedia.com</a></p>
              <p><strong>DMCA:</strong> <a href="mailto:dmca@vfansmedia.com" className="text-black hover:underline">dmca@vfansmedia.com</a></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalCenter;