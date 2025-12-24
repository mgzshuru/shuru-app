'use client';

import React from 'react';

interface ShareSectionProps {
  title: string;
}

export function ShareSection({ title }: ShareSectionProps) {
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('تم نسخ الرابط');
  };

  const getTwitterShareUrl = () => {
    if (typeof window === 'undefined') return '#';
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`;
  };

  return (
    <div className="pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['IBM_Plex_Sans_Arabic']">
        شارك الحلقة
      </h2>
      <div className="flex gap-3">
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors font-['IBM_Plex_Sans_Arabic']"
        >
          نسخ الرابط
        </button>
        <a
          href={getTwitterShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors font-['IBM_Plex_Sans_Arabic']"
        >
          مشاركة على تويتر
        </a>
      </div>
    </div>
  );
}
