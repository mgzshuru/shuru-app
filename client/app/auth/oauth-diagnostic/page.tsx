"use client";

import React, { useState, useEffect } from 'react';
import { getStrapiURL } from '@/lib/utils';

export default function OAuthDiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState({
    strapiUrl: '',
    googleEndpoint: '',
    linkedinEndpoint: '',
    googleStatus: 'checking...',
    linkedinStatus: 'checking...',
    errors: [] as string[]
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const strapiUrl = getStrapiURL();
      const newDiagnostics = {
        strapiUrl,
        googleEndpoint: `${strapiUrl}/api/connect/google`,
        linkedinEndpoint: `${strapiUrl}/api/connect/linkedin`,
        googleStatus: 'checking...',
        linkedinStatus: 'checking...',
        errors: [] as string[]
      };

      // Test Google endpoint
      try {
        const googleResponse = await fetch(`${strapiUrl}/api/connect/google`, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        newDiagnostics.googleStatus = 'Available (no-cors)';
      } catch (error) {
        newDiagnostics.googleStatus = `Error: ${error}`;
        newDiagnostics.errors.push(`Google OAuth endpoint error: ${error}`);
      }

      // Test LinkedIn endpoint
      try {
        const linkedinResponse = await fetch(`${strapiUrl}/api/connect/linkedin`, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        newDiagnostics.linkedinStatus = 'Available (no-cors)';
      } catch (error) {
        newDiagnostics.linkedinStatus = `Error: ${error}`;
        newDiagnostics.errors.push(`LinkedIn OAuth endpoint error: ${error}`);
      }

      setDiagnostics(newDiagnostics);
    };

    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">تشخيص OAuth</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">معلومات التكوين</h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>Strapi URL:</strong> {diagnostics.strapiUrl}</p>
            <p><strong>Google Endpoint:</strong> {diagnostics.googleEndpoint}</p>
            <p><strong>LinkedIn Endpoint:</strong> {diagnostics.linkedinEndpoint}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Google OAuth Status</h3>
            <p className={`text-sm ${diagnostics.googleStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {diagnostics.googleStatus}
            </p>
          </div>

          <div className="bg-white border p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">LinkedIn OAuth Status</h3>
            <p className={`text-sm ${diagnostics.linkedinStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {diagnostics.linkedinStatus}
            </p>
          </div>
        </div>

        {diagnostics.errors.length > 0 && (
          <div className="bg-red-50 border border-red-300 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3 text-red-800">أخطاء مكتشفة</h3>
            <ul className="space-y-2">
              {diagnostics.errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">خطوات إصلاح المشكلة</h3>
          <ol className="space-y-3 text-blue-700 text-sm">
            <li>1. تحقق من تفعيل موفري OAuth في لوحة إدارة Strapi:</li>
            <ul className="mr-4 mt-1 space-y-1">
              <li>• Settings → Users & Permissions plugin → Providers</li>
              <li>• تأكد من تفعيل Google و LinkedIn</li>
              <li>• تحقق من صحة Client ID و Client Secret</li>
            </ul>

            <li>2. تحقق من URLs الاستدعاء في Google/LinkedIn Developer Console:</li>
            <ul className="mr-4 mt-1 space-y-1">
              <li>• Google: https://cms.shuru.sa/api/auth/google/callback</li>
              <li>• LinkedIn: https://cms.shuru.sa/api/auth/linkedin/callback</li>
            </ul>

            <li>3. تحقق من سجلات خادم Strapi للأخطاء التفصيلية</li>

            <li>4. تأكد من أن متغيرات البيئة محددة بشكل صحيح في Strapi</li>

            <li>5. أعد تشغيل خادم Strapi بعد أي تغييرات في التكوين</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            إعادة تشغيل التشخيص
          </button>
        </div>
      </div>
    </div>
  );
}
