'use client';

import { StrapiImage } from '@/components/custom/strapi-image';
import { StrapiLink } from '@/components/custom/strapi-link';
import { useState, useEffect } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { HeaderData } from '@/lib/types';

interface HeaderProps {
  headerData: HeaderData;
}

export default function Header({ headerData }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className="fixed top-0 left-0 right-0 flex flex-col bg-black/90 px-5 shadow-md transition-all duration-300"
      style={{ zIndex: 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Navigation Bar */}
      <div className="grid min-h-[44px] grid-cols-3 items-center justify-between overflow-hidden">
        {/* Left Section */}
        <div className="grid-column-1 flex justify-start items-center gap-6 text-white rounded-none">
          <Button 
            aria-label="Hamburger menu button" 
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="link"
            size="sm"
            className="max-lg:hidden text-white"
            onClick={() => router.push(headerData.loginButton?.url || '/login')}
          >
            {headerData.loginButton?.text}
          </Button>
        </div>

        {/* Center Logo */}
        <div className="masthead grid-column-2">
          <div className="flex grow-[100] items-center justify-center" aria-label="Shuru logo">
            <StrapiLink href="/">
              <StrapiImage
                src={headerData.logo.logoImage.url}
                alt={headerData.logo.logoImage.alternativeText || headerData.logo.alt}
                width={200}
                height={32}
                className="py-2 max-lg:w-[150px]"
              />
            </StrapiLink>
          </div>
        </div>

        {/* Right Section */}
        <div className="grid-column-3 flex justify-end items-center gap-6">
          <StrapiLink href={headerData.subscription.url}>
            <Button
              variant="default"
              size="lg"
              className="text-white rounded-none"
            >
              {headerData.subscription.text}
            </Button>
          </StrapiLink>
          <Button
            variant="ghost"
            size="icon"
            className="mastheadSearch max-lg:absolute max-lg:left-14 max-lg:top-3 text-white"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search button"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Horizontal Categories */}
      <div 
        className={`flex flex-row items-center justify-center gap-4 uppercase text-white max-lg:hidden overflow-hidden transition-all duration-300 ${
          isScrolled && !isHovered ? 'h-0 opacity-0' : 'h-[23px] opacity-100'
        }`}
      >
        <ul className="flex flex-row justify-center gap-4 text-xs font-normal leading-4 tracking-[1.4px]">
          {headerData.navigation.primaryMenuItems && headerData.navigation.primaryMenuItems.map((item) => (
            <li 
              key={item.order}
              className="border-b-[6px] border-transparent transition-colors duration-500 hover:border-orange-500"
            >
              <StrapiLink 
                href={item.url}
                isExternal={item.openInNewTab}
                className="hover:text-orange-500 transition-colors"
              >
                {item.label}
              </StrapiLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="space-y-1 p-2 z-[1100]">
          {/* Menu items */}
          <div className="border-b border-gray-200 pb-4 mb-4 pt-8">
            {headerData.navigation.primaryMenuItems && headerData.navigation.primaryMenuItems.map((item) => (
              <StrapiLink
                key={item.order}
                href={item.url}
                isExternal={item.openInNewTab}
                className="block"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="default"
                  className="justify-start px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 text-right w-full"
                >
                  {item.label}
                </Button>
              </StrapiLink>
            ))}
          </div>
          {/* Login button in sheet */}
          <div className="px-4 pb-2">
            <Button
              variant="outline"
              size="default"
              className="justify-center mb-4 text-gray-900 border-gray-300 w-full"
              onClick={() => router.push(headerData.loginButton?.url || '/login')}
            >
              {headerData.loginButton?.text}
            </Button>
          </div>
          {/* CTA in sheet */}
          <div className="px-4">
            <StrapiLink
              href={headerData.subscription.url}
              className="block"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant="default"
                size="lg"
                className="justify-center text-white w-full"
              >
                {headerData.subscription.text}
              </Button>
            </StrapiLink>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="w-full px-4 py-2 text-lg bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-orange-500 placeholder-gray-500"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="hover:text-orange-500 hover:bg-white/40"
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}