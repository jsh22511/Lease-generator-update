export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you use our lease generation service.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li><strong>Lease Information:</strong> Property details, tenant/landlord information, lease terms, and other data you enter into the form</li>
              <li><strong>Contact Information:</strong> Email addresses and other contact details you provide (optional)</li>
              <li><strong>Usage Data:</strong> Information about how you use our service, including IP addresses and browser information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Generate lease documents based on your input</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our service and develop new features</li>
              <li>Comply with legal obligations and protect our rights</li>
              <li>Send you updates about our service (if you opt-in)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Retention</h2>
            <p className="text-gray-600 mb-6">
              We retain your information only as long as necessary to provide our services and comply with legal obligations. Generated lease documents are not stored on our servers after delivery.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-600 mb-6">
              We may use cookies and similar technologies to improve your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-600 mb-6">
              Our service may integrate with third-party services (such as captcha providers) that have their own privacy policies. We encourage you to review their privacy practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Depending on your jurisdiction, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Access and receive a copy of your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Data portability (receive your data in a structured format)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels.
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
