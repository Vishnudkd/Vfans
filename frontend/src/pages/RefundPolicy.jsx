import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                This Refund Policy explains the circumstances under which refunds may be issued for purchases made through VFans Media.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Digital Content Sales</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 General Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Due to the digital nature of content sold through our platform, all sales are generally final once the buyer has accessed the content.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Exceptions</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds may be issued in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Technical issues prevented access to purchased content</li>
                <li>Content was significantly different from its description</li>
                <li>Duplicate charges occurred due to system error</li>
                <li>Content violated our terms of service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Request Process</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Time Frame</h3>
              <p className="text-gray-700 leading-relaxed">
                Refund requests must be submitted within 48 hours of purchase.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 How to Request</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To request a refund:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Contact our support team at support@vfansmedia.com</li>
                <li>Include your transaction ID and purchase details</li>
                <li>Provide a detailed explanation of the issue</li>
                <li>Include any relevant screenshots or documentation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refund Processing</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Review Period</h3>
              <p className="text-gray-700 leading-relaxed">
                Refund requests are typically reviewed within 3-5 business days.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Payment Method</h3>
              <p className="text-gray-700 leading-relaxed">
                Approved refunds will be issued to the original payment method used for purchase.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Processing Time</h3>
              <p className="text-gray-700 leading-relaxed">
                Refunds typically appear in your account within 5-10 business days, depending on your financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Chargebacks</h2>
              <p className="text-gray-700 leading-relaxed">
                If you file a chargeback without first contacting us, we reserve the right to suspend your account and pursue legal remedies. We encourage you to contact us first to resolve any issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Creator Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Content creators are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Providing accurate content descriptions</li>
                <li>Ensuring content quality and accessibility</li>
                <li>Honoring legitimate refund requests</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Excessive refund rates may result in account review or suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Platform Fees</h2>
              <p className="text-gray-700 leading-relaxed">
                When a refund is issued, the platform fee (20%) is not refunded to creators. Only the creator's portion (80%) is deducted from their balance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  For refund requests or questions, contact:<br /><br />
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

export default RefundPolicy;