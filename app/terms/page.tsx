export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using the Free Lease Generator service, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
            <p className="text-gray-600 mb-6">
              The Free Lease Generator is a tool that helps users create residential lease agreements. The service generates lease templates based on user input and jurisdiction-specific requirements.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Legal Disclaimer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 font-semibold">
                IMPORTANT: This service is for informational purposes only and does not constitute legal advice.
              </p>
            </div>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>The generated lease documents are templates and should not be used without legal review</li>
              <li>Laws vary by jurisdiction and may change over time</li>
              <li>You should consult with a qualified attorney before using any lease agreement</li>
              <li>We make no warranties about the legal accuracy or completeness of generated documents</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Provide accurate and complete information when using the service</li>
              <li>Review all generated documents before use</li>
              <li>Seek legal counsel for any lease agreements</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              The service is provided "as is" without warranties of any kind. We shall not be liable for any damages arising from the use of this service, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Privacy</h2>
            <p className="text-gray-600 mb-6">
              We collect and process personal information in accordance with our Privacy Policy. By using this service, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Modifications</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of any modifications.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us through our support channels.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a 
              href="/" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Lease Generator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
