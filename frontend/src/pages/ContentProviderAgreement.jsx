import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ContentProviderAgreement = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Content Provider Agreement</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                This Content Provider Agreement ("Agreement") is between VFans Media LLC ("VFans Media," "we," "us") and you ("Creator," "you," "your") who creates and uploads content to our platform. By uploading content, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Relationship</h2>
              <p className="text-gray-700 leading-relaxed">
                You are an independent contractor, not an employee, partner, or agent of VFans Media. This Agreement does not create an employment, partnership, or joint venture relationship.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Content Rights and Licenses</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Your Rights</h3>
              <p className="text-gray-700 leading-relaxed">
                You retain all ownership rights to your content. You are solely responsible for your content and any consequences of posting it.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 License to VFans Media</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You grant VFans Media a worldwide, non-exclusive, royalty-free license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Host, store, and display your content</li>
                <li>Distribute your content to paying customers</li>
                <li>Create thumbnails and previews of your content</li>
                <li>Use your content for platform promotion (with your consent)</li>
                <li>Process and optimize your content for delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Creator Representations and Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You own or have the necessary rights to all content you upload</li>
                <li>Your content does not infringe any third-party rights</li>
                <li>Your content complies with all applicable laws</li>
                <li>You have obtained all necessary permissions and releases</li>
                <li>Your content is accurately described and priced</li>
                <li>You will not upload illegal or prohibited content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Revenue Sharing</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Commission Structure</h3>
              <p className="text-gray-700 leading-relaxed">
                You will receive 80% of the sale price of your content. VFans Media retains 20% as a platform fee for hosting, payment processing, and services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Payments are processed according to your chosen schedule</li>
                <li>Minimum withdrawal amount: $50</li>
                <li>Payments made via bank transfer, PayPal, or other approved methods</li>
                <li>You are responsible for applicable taxes on your earnings</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Refunds</h3>
              <p className="text-gray-700 leading-relaxed">
                When a refund is issued to a customer, the creator's portion (80%) is deducted from your account balance. The platform fee is not refunded.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content Standards and Compliance</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Quality Standards</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate descriptions of your content</li>
                <li>Deliver content as described</li>
                <li>Maintain reasonable quality standards</li>
                <li>Respond to customer inquiries about your content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Legal Compliance</h3>
              <p className="text-gray-700 leading-relaxed">
                You must comply with all applicable laws, including copyright, privacy, consumer protection, and tax laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Uploading infringing or illegal content</li>
                <li>Price manipulation or fraud</li>
                <li>Creating fake sales or reviews</li>
                <li>Sharing account access</li>
                <li>Attempting to circumvent platform fees</li>
                <li>Harassing or abusing customers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Account Termination</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 By Creator</h3>
              <p className="text-gray-700 leading-relaxed">
                You may terminate this Agreement at any time by closing your account. Earned payments will be processed according to standard schedule.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 By VFans Media</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may suspend or terminate your account for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Violation of this Agreement</li>
                <li>Fraudulent activity</li>
                <li>Excessive chargebacks or refunds</li>
                <li>Legal requirements</li>
                <li>Platform safety concerns</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Upon termination, outstanding payments may be withheld for 90 days to cover potential refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless VFans Media from any claims, damages, losses, or expenses arising from your content, your use of the platform, or your violation of this Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media's liability to you is limited to the fees paid to you in the three months preceding the claim. We are not liable for indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Agreement</h2>
              <p className="text-gray-700 leading-relaxed">
                We may modify this Agreement with 30 days notice. Continued use of the platform after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                This Agreement is governed by the laws of the State of Wyoming, USA. Disputes will be resolved in the courts of Wyoming.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>VFans Media LLC</strong><br />
                  Creator Relations<br />
                  30 N Gould St Ste R<br />
                  Sheridan, WY 82801<br />
                  Email: creators@vfansmedia.com
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

export default ContentProviderAgreement;