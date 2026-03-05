import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using VFans Media's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media provides a platform that enables content creators to sell digital content through shareable links. We facilitate transactions between creators and buyers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must create an account to use our services. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Be at least 18 years of age</li>
                <li>Not share your account with others</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Account Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content Guidelines</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Permitted Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may upload digital content that you own or have rights to distribute.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Prohibited Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not upload content that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Infringes on intellectual property rights</li>
                <li>Contains illegal material</li>
                <li>Is defamatory, obscene, or harmful</li>
                <li>Violates any applicable laws or regulations</li>
                <li>Contains malware or malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment and Fees</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Platform Fee</h3>
              <p className="text-gray-700 leading-relaxed">
                VFans Media charges a 20% commission on all sales. Creators receive 80% of the sale price.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Payment Processing</h3>
              <p className="text-gray-700 leading-relaxed">
                Payments are processed through third-party payment processors. You agree to comply with their terms and conditions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Withdrawals</h3>
              <p className="text-gray-700 leading-relaxed">
                You may withdraw your earnings subject to minimum withdrawal amounts and processing times.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Your Content</h3>
              <p className="text-gray-700 leading-relaxed">
                You retain all rights to content you upload. By uploading content, you grant us a limited license to host, display, and distribute your content as necessary to provide our services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Platform Rights</h3>
              <p className="text-gray-700 leading-relaxed">
                VFans Media and its logos, trademarks, and service marks are the property of VFans Media LLC. You may not use them without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless VFans Media from any claims arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of the State of Wyoming, USA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>VFans Media LLC</strong><br />
                  30 N Gould St Ste R<br />
                  Sheridan, WY 82801<br />
                  Email: support@vfansmedia.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;