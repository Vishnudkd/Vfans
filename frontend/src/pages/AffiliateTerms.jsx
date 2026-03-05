import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AffiliateTerms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Affiliate Terms</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Affiliate Program Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                The VFans Media Affiliate Program allows you to earn commissions by referring new users to our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To participate in our affiliate program, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Be at least 18 years of age</li>
                <li>Have a valid VFans Media account in good standing</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Have a website, blog, or social media presence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Commission Structure</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Commission Rate</h3>
              <p className="text-gray-700 leading-relaxed">
                Affiliates earn a 10% commission on the platform fees generated from referred users for their first 12 months of activity.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                Referrals are tracked through unique affiliate links. Users must sign up through your affiliate link to be credited to your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Payment Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Commission payments are made monthly for balances exceeding $100. Payments are processed within 30 days of month end.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Promotional Guidelines</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Permitted Activities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Honest reviews and recommendations</li>
                <li>Educational content about our platform</li>
                <li>Social media promotion</li>
                <li>Email marketing to your own list</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Prohibited Activities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Spam or unsolicited email marketing</li>
                <li>Misleading or false advertising</li>
                <li>Trademark or brand bidding on search engines</li>
                <li>Cookie stuffing or fraudulent referrals</li>
                <li>Adult or illegal content association</li>
                <li>Self-referrals or gaming the system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Affiliate Link Usage</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When using affiliate links, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Clearly disclose your affiliate relationship</li>
                <li>Use provided marketing materials or create your own compliant content</li>
                <li>Not modify or shorten links without permission</li>
                <li>Ensure links point directly to VFans Media pages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                We provide limited permission to use our trademarks and logos for affiliate promotion. You may not create derivative works or imply false endorsement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to terminate your affiliate account for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violation of these terms</li>
                <li>Fraudulent activity</li>
                <li>Damage to VFans Media reputation</li>
                <li>Inactivity exceeding 12 months</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Upon termination, unpaid commissions may be forfeited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modification of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these affiliate terms, commission rates, or terminate the program at any time with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media is not liable for any indirect, incidental, or consequential damages arising from participation in the affiliate program.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  For affiliate program questions, contact:<br /><br />
                  <strong>VFans Media LLC</strong><br />
                  Affiliate Program<br />
                  30 N Gould St Ste R<br />
                  Sheridan, WY 82801<br />
                  Email: affiliates@vfansmedia.com
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

export default AffiliateTerms;