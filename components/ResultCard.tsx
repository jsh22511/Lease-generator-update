'use client';

import React from 'react';

interface ResultCardProps {
  success: boolean;
  message: string;
  downloadUrl?: string;
  filename?: string;
  onRetry?: () => void;
}

export function ResultCard({ success, message, downloadUrl, filename, onRetry }: ResultCardProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'lease.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${
      success 
        ? 'border-green-200 bg-green-50' 
        : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          success ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {success ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <div className="ml-4 flex-1">
          <h3 className={`text-lg font-semibold ${
            success ? 'text-green-800' : 'text-red-800'
          }`}>
            {success ? 'Lease Generated Successfully!' : 'Generation Failed'}
          </h3>
          
          <p className={`mt-2 ${
            success ? 'text-green-700' : 'text-red-700'
          }`}>
            {message}
          </p>
          
          {success && downloadUrl && (
            <div className="mt-4 space-y-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Lease Document
              </button>
              
              <p className="text-sm text-gray-600">
                Your lease document is ready for download. You can open it in Microsoft Word, Google Docs, or any compatible word processor.
              </p>
            </div>
          )}
          
          {!success && onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
