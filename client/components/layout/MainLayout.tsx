import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { GlobalData } from '@/lib/types';

interface MainLayoutProps {
  children: React.ReactNode;
  globalData: GlobalData;
}

export default function MainLayout({ children, globalData }: MainLayoutProps) {
  // Map old headerData to new HeaderProps
  const headerData = globalData.header;
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        headerData={headerData}
      />
      <main className="flex-grow mt-[73px]">
        {children}
      </main>
      <Footer footerData={globalData.footer} />
    </div>
  );
}