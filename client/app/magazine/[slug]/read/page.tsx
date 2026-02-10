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

      {/* Full Screen PDF Viewer */}
      <main className="flex-1 overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title={`قراءة ${issue.title}`}
        />
      </main>
    </div>
  );
}
