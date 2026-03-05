import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const sections = [
    {
      title: 'Sections',
      links: [
        { name: 'Contact us', href: '/contact' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Support', href: '/support' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Legal Center', href: '/legal' },
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Affiliate Terms', href: '/affiliate-terms' },
        { name: 'Usage Policy', href: '/usage-policy' },
        { name: 'DMCA Takedown', href: '/dmca-takedown' },
        { name: 'Complaints & Removal policy', href: '/complaints-removal' },
        { name: 'Content Provider Agreement', href: '/content-provider-agreement' }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">VFans Media</span>
            </div>
            <p className="text-gray-600 mb-6">
              Sell your content with paid shareable links.
            </p>
            <p className="text-sm text-gray-500">
              If they see it, you earn it.
            </p>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025. All rights reserved. VFans Media
            </p>
            <p className="text-gray-500 text-sm">
              30 N Gould St Ste R, Sheridan, WY 82801
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;