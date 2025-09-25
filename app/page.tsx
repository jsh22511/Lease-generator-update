'use client';

import React, { useState } from 'react';
import SimpleLeaseForm from '@/components/SimpleLeaseForm';
import { ResultCard } from '@/components/ResultCard';
import { LeaseInput } from '@/lib/schema';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    downloadUrl?: string;
    filename?: string;
  } | null>(null);

  const handleSubmit = async (data: LeaseInput) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Add captcha token if needed (this would be integrated with your captcha solution)
      const formData = {
        ...data,
        captchaToken: 'mock-token', // Replace with actual captcha integration
      };

      console.log('Submitting form data:', JSON.stringify(formData, null, 2));

      const response = await fetch('/api/generate-lease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Create download URL from blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'lease.docx';
        
        setResult({
          success: true,
          message: 'Your lease document has been generated successfully!',
          downloadUrl: url,
          filename,
        });
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setResult({
          success: false,
          message: errorData.message || 'Failed to generate lease. Please try again.',
        });
      }
    } catch (error) {
      console.error('Lease generation error:', error);
      setResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Free Lease Generator
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Generate a professional residential lease in minutes
            </p>
            <p className="mt-1 text-sm text-gray-500">
              <strong>Disclaimer:</strong> This tool generates lease templates for informational purposes only. 
              This is not legal advice. Consult with an attorney for legal guidance.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Generating Your Lease Agreement
              </h2>
              <p className="text-gray-600">
                Please wait while we create your professional lease document...
              </p>
            </div>
          </div>
        ) : result ? (
          <ResultCard
            success={result.success}
            message={result.message}
            downloadUrl={result.downloadUrl}
            filename={result.filename}
            onRetry={handleRetry}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Create Your Lease Agreement
              </h2>
              <p className="text-gray-600">
                Fill out the form below to generate a customized residential lease agreement. 
                The form is divided into logical sections to make it easy to complete.
              </p>
            </div>

            <SimpleLeaseForm onGenerate={handleSubmit} isGenerating={isLoading} result={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> This lease generator is for informational purposes only 
              and does not constitute legal advice. Laws vary by jurisdiction and may change over time.
            </p>
            <p className="mb-4">
              Always consult with a qualified attorney before using any lease agreement.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </a>
              <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
