'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getMagazineIssueBySlug } from '@/lib/strapi-client';
import { getMagazineIssueBySlugOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { DownloadPdfButton } from '@/components/custom/download-pdf-button';
import { useEffect } from 'react';

export default function MagazineReadPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobileCheck);
    };

    checkMobile();
  }, []);

  useEffect(() => {
    async function loadIssue() {
      try {
        const data = await getMagazineIssueBySlugOptimized(slug).catch(() => getMagazineIssueBySlug(slug));
        setIssue(data);
      } catch (error) {
        console.error('Error loading issue:', error);
      } finally {
        setLoading(false);
      }
    }
    loadIssue();
  }, [slug]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-white font-['IBM_Plex_Sans_Arabic']">جاري التحميل...</div>
      </div>
    );
  }

  if (!issue || !issue.pdf_attachment) {
    notFound();
  }

  const pdfUrl = getStrapiMedia(issue.pdf_attachment.url);

  if (!pdfUrl) {
    notFound();
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 z-[9999]">
      {/* Compact Header */}
      <header className="bg-black border-b border-gray-700 flex-shrink-0 z-10">
        <div className="px-4 py-2 flex items-center justify-between">
          <Link
            href={`/magazine/${slug}`}
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors font-['IBM_Plex_Sans_Arabic'] text-sm"
          >
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة
          </Link>

          <h1 className="text-sm font-bold text-white font-['IBM_Plex_Sans_Arabic'] truncate max-w-md mx-4">
            {issue.title} - العدد {issue.issue_number}
          </h1>

          <DownloadPdfButton
            pdfUrl={pdfUrl}
            fileName={`${issue.title}-العدد-${issue.issue_number}.pdf`}
            className="inline-flex items-center px-3 py-1.5 bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic'] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            تحميل
          </DownloadPdfButton>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 overflow-hidden">
        {isMobile ? (
          /* Mobile: Show message and button to open PDF */
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="bg-white rounded-lg p-8 max-w-md shadow-xl">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-4 font-['IBM_Plex_Sans_Arabic']">
                {issue.title}
              </h2>
              <p className="text-gray-600 mb-6 font-['IBM_Plex_Sans_Arabic']">
                العدد {issue.issue_number}
              </p>
              <p className="text-gray-700 mb-8 font-['IBM_Plex_Sans_Arabic']">
                لقراءة المجلة على الهاتف، يرجى فتح الملف في نافذة جديدة أو تحميله
              </p>
              <div className="space-y-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
                >
                  <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  فتح في نافذة جديدة
                </a>
                <DownloadPdfButton
                  pdfUrl={pdfUrl}
                  fileName={`${issue.title}-العدد-${issue.issue_number}.pdf`}
                  className="block w-full px-6 py-4 bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic'] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  تحميل المجلة
                </DownloadPdfButton>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop: Show iframe */
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={`قراءة ${issue.title}`}
          />
        )}
      </main>
    </div>
  );
}
