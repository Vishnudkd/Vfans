import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UsagePolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Usage Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Usage Policy outlines acceptable and prohibited uses of the VFans Media platform. By using our services, you agree to comply with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Permitted Uses</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may use VFans Media to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Sell original digital content that you own or have rights to distribute</li>
                <li>Share educational materials, courses, and training content</li>
                <li>Distribute photography, artwork, and creative works</li>
                <li>Provide video content and multimedia files</li>
                <li>Offer digital products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prohibited Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not upload, distribute, or sell content that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Infringes on intellectual property rights, copyrights, or trademarks</li>
                <li>Contains illegal material or promotes illegal activities</li>
                <li>Is defamatory, hateful, or discriminatory</li>
                <li>Contains viruses, malware, or malicious code</li>
                <li>Violates privacy rights or contains personal information without consent</li>
                <li>Is fraudulent, deceptive, or misleading</li>
                <li>Contains unsolicited advertising or spam</li>
                <li>Exploits minors in any way</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with or disrupting our services</li>
                <li>Using automated systems to scrape or harvest data</li>
                <li>Creating multiple accounts to abuse promotions or features</li>
                <li>Manipulating prices or engaging in price fixing</li>
                <li>Engaging in money laundering or terrorist financing</li>
                <li>Impersonating others or providing false information</li>
                <li>Sharing account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content Responsibility</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a content creator, you are solely responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Ensuring you have rights to distribute your content</li>
                <li>Providing accurate descriptions and pricing</li>
                <li>Compliance with all applicable laws and regulations</li>
                <li>Paying any applicable taxes on your earnings</li>
                <li>Customer support for your content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Security Obligations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Users must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Maintain the security of account credentials</li>
                <li>Use strong, unique passwords</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Not share login information with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Content Monitoring</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media reserves the right to monitor, review, and remove content that violates this policy. We may use automated systems and human review to enforce these policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Enforcement</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Violations</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Violations of this policy may result in:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Content removal</li>
                <li>Account warnings</li>
                <li>Temporary account suspension</li>
                <li>Permanent account termination</li>
                <li>Withholding of payments</li>
                <li>Legal action</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 Appeals</h3>
              <p className="text-gray-700 leading-relaxed">
                If your content is removed or account is suspended, you may appeal by contacting support@vfansmedia.com with details of your case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Reporting Violations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you encounter content or activity that violates this policy, please report it to:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  Email: abuse@vfansmedia.com<br />
                  Include: Content URL, description of violation, and any supporting evidence
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Policy Updates</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Usage Policy from time to time. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
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

export default UsagePolicy;