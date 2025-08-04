import React from 'react';
import { FileText } from 'lucide-react';

export default function SubmitLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Loading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black mb-6">
            <FileText className="w-10 h-10 text-white animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Progress Bar Loading */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded border-2 animate-pulse"></div>
                {step < 3 && <div className="w-20 h-0.5 bg-gray-200 animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Form Loading */}
        <div className="bg-white p-8 lg:p-12" style={{ border: '1px solid #e5e7eb' }}>
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((field) => (
                <div key={field} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-12 bg-gray-100 rounded border-2 animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Large Text Area */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-32 bg-gray-100 rounded border-2 animate-pulse"></div>
            </div>

            {/* File Upload Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((upload) => (
                <div key={upload} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-24 bg-gray-100 rounded border-2 border-dashed animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons Loading */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <div className="h-12 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-800 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Guidelines Loading */}
        <div className="mt-12 bg-white p-8" style={{ border: '1px solid #e5e7eb' }}>
          <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((section) => (
              <div key={section}>
                <div className="h-5 bg-gray-200 rounded w-28 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-start">
                      <div className="w-2 h-2 bg-gray-300 mt-2 ml-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
