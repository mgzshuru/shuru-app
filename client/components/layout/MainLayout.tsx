"use client";

import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { GlobalData, TopBannerData } from '@/lib/types';

interface MainLayoutProps {
  children: React.ReactNode;
  globalData: GlobalData;
  topBannerData?: TopBannerData | null;
}

export default function MainLayout({ children, globalData, topBannerData }: MainLayoutProps) {
  const [headerHeight, setHeaderHeight] = useState(73); // Default fallback

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    // Update height on initial load
    updateHeaderHeight();

    // Update height on window resize
    window.addEventListener('resize', updateHeaderHeight);

    // Update height on scroll (for dynamic header changes)
    window.addEventListener('scroll', updateHeaderHeight, { passive: true });

    // Use ResizeObserver for more accurate header height tracking
    let resizeObserver: ResizeObserver | null = null;
    const header = document.querySelector('header');

    if (header && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      resizeObserver.observe(header);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', updateHeaderHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Map old headerData to new HeaderProps
  const headerData = globalData.header;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        headerData={headerData}
        topBannerData={topBannerData}
      />
      <main
        className="flex-grow transition-all duration-300"
        style={{ marginTop: `${headerHeight}px` }}
      >
        {children}
      </main>
      <Footer footerData={globalData.footer} />
    </div>
  );
}