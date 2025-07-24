'use client';

import { StrapiImage } from '@/components/custom/strapi-image';
import { StrapiLink } from '@/components/custom/strapi-link';
import { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { HeaderData } from '@/lib/types';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';

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

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
                className="py-2 max-lg:w-[150px] h-[60px]"
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
              className="text-black/90 rounded-none"
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
        <ul className="flex flex-row justify-center gap-4 text-sm font-normal leading-4 tracking-[1.4px]">
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

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        headerData={headerData}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}