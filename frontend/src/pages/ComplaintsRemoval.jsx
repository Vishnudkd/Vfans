import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ComplaintsRemoval = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complaints & Removal Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Purpose</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media is committed to maintaining a safe and compliant platform. This policy outlines how we handle complaints and content removal requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Complaints</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We accept complaints regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Copyright or intellectual property infringement</li>
                <li>Privacy violations or unauthorized use of personal information</li>
                <li>Illegal content or activities</li>
                <li>Fraudulent or deceptive content</li>
                <li>Harassment, defamation, or abusive content</li>
                <li>Terms of Service violations</li>
                <li>Payment or refund disputes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Filing a Complaint</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Required Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When filing a complaint, please provide:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your full name and contact information</li>
                <li>A detailed description of the complaint</li>
                <li>URL or link to the content in question</li>
                <li>Evidence supporting your complaint (screenshots, documentation)</li>
                <li>The specific policy violation or legal issue</li>
                <li>What action you are requesting</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 How to Submit</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>General Complaints:</strong> support@vfansmedia.com<br />
                  <strong>Copyright Issues:</strong> dmca@vfansmedia.com<br />
                  <strong>Legal Matters:</strong> legal@vfansmedia.com<br />
                  <strong>Abuse Reports:</strong> abuse@vfansmedia.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Review Process</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Timeline</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We aim to review complaints within:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Emergency situations (illegal content, immediate harm): 24 hours</li>
                <li>Copyright/IP issues: 3-5 business days</li>
                <li>Policy violations: 5-7 business days</li>
                <li>General complaints: 7-10 business days</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Investigation</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team will investigate the complaint by reviewing the content, examining evidence, and considering applicable laws and policies. We may contact both parties for additional information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Possible Outcomes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Based on our investigation, we may:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remove the content immediately</li>
                <li>Issue a warning to the content creator</li>
                <li>Suspend the user's account temporarily</li>
                <li>Permanently terminate the user's account</li>
                <li>Restrict certain account features</li>
                <li>Take no action if the complaint is unfounded</li>
                <li>Refer the matter to law enforcement if appropriate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Notification</h2>
              <p className="text-gray-700 leading-relaxed">
                We will notify complainants of the outcome of their complaint. Content creators will be notified if their content is removed or their account is affected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Appeal Process</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you disagree with our decision, you may appeal by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Submitting an appeal to appeals@vfansmedia.com within 14 days</li>
                <li>Providing additional evidence or explanation</li>
                <li>Clearly stating why you believe the decision was incorrect</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Appeals are reviewed by a different team member. Our decision on appeals is final.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Emergency Removal</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to immediately remove content or suspend accounts without prior notice in cases involving:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Illegal activities</li>
                <li>Immediate safety threats</li>
                <li>Court orders or legal requirements</li>
                <li>Severe policy violations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. False Complaints</h2>
              <p className="text-gray-700 leading-relaxed">
                Filing false, fraudulent, or harassing complaints may result in:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Dismissal of future complaints</li>
                <li>Account suspension or termination</li>
                <li>Legal action for damages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Law Enforcement Cooperation</h2>
              <p className="text-gray-700 leading-relaxed">
                We cooperate with law enforcement agencies and may provide information in response to valid legal requests. We may also proactively report illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>VFans Media LLC</strong><br />
                  Complaints & Removal Department<br />
                  <br />
                  <strong>Email Contacts:</strong><br />
                  General: <a href="mailto:support@vfansmedia.com" className="text-black hover:underline">support@vfansmedia.com</a><br />
                  Abuse: <a href="mailto:abuse@vfansmedia.com" className="text-black hover:underline">abuse@vfansmedia.com</a><br />
                  Legal: <a href="mailto:legal@vfansmedia.com" className="text-black hover:underline">legal@vfansmedia.com</a><br />
                  DMCA: <a href="mailto:dmca@vfansmedia.com" className="text-black hover:underline">dmca@vfansmedia.com</a>
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

export default ComplaintsRemoval;