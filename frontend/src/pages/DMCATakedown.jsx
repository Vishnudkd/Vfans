import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DMCATakedown = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DMCA Takedown Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media LLC respects the intellectual property rights of others and expects users to do the same. We respond to notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act ("DMCA").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Filing a DMCA Takedown Notice</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you believe that content on VFans Media infringes your copyright, please send a written notice that includes the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>A physical or electronic signature of the copyright owner or authorized representative</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the infringing material and its location on our platform</li>
                <li>Your contact information (name, address, telephone number, email address)</li>
                <li>A statement that you have a good faith belief that the use is not authorized</li>
                <li>A statement made under penalty of perjury that the information is accurate and you are authorized to act</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Where to Send DMCA Notices</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>DMCA Agent:</strong><br />
                  VFans Media LLC<br />
                  Attn: Copyright Agent<br />
                  Email: <a href="mailto:dmca@vfansmedia.com" className="text-black hover:underline">dmca@vfansmedia.com</a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Our Response Process</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon receiving a valid DMCA notice, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Remove or disable access to the allegedly infringing content</li>
                <li>Notify the content uploader of the removal</li>
                <li>Provide the uploader with a copy of the DMCA notice</li>
                <li>Take appropriate action against repeat infringers, including account termination</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Counter-Notice Procedure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you believe your content was removed in error, you may file a counter-notice containing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your physical or electronic signature</li>
                <li>Identification of the removed content and its former location</li>
                <li>A statement under penalty of perjury that the content was removed by mistake or misidentification</li>
                <li>Your name, address, and phone number</li>
                <li>A statement consenting to jurisdiction of Federal District Court</li>
                <li>A statement that you will accept service of process from the complainant</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Counter-Notice Response</h2>
              <p className="text-gray-700 leading-relaxed">
                Upon receiving a valid counter-notice, we will forward it to the original complainant. If the complainant does not file a court action within 10-14 business days, we may restore the removed content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Repeat Infringer Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                VFans Media maintains a policy of terminating accounts of users who are repeat copyright infringers. Multiple valid DMCA notices against the same user may result in permanent account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. False Claims</h2>
              <p className="text-gray-700 leading-relaxed">
                Submitting a false or fraudulent DMCA notice or counter-notice may result in legal liability. You may be subject to damages, including costs and attorney fees, if you materially misrepresent that content is infringing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitations</h2>
              <p className="text-gray-700 leading-relaxed">
                This policy applies only to copyright infringement claims under US law. For other intellectual property concerns or non-US complaints, please contact our legal team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Additional Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For more information about the DMCA, visit the U.S. Copyright Office website at www.copyright.gov. For questions about our DMCA policy, contact dmca@vfansmedia.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DMCATakedown;