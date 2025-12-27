'use client';

import { StrapiImage } from '@/components/custom/strapi-image';
import { StrapiLink } from '@/components/custom/strapi-link';
import { useState, useEffect } from 'react';
import { Menu, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { HeaderData, TopBannerData } from '@/lib/types';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';
import TopBanner from './TopBanner';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

interface HeaderProps {
  headerData: HeaderData;
  topBannerData?: TopBannerData | null;
}

export default function Header({ headerData, topBannerData }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, loading, refreshAuth } = useAuth();
  const [showBanner, setShowBanner] = useState(true);
  const [bannerContent, setBannerContent] = useState<{ message: string; bgColor?: string; linkUrl?: string; linkText?: string } | null>(null);

  // Handle banner logic with timezone-safe date comparisons
  useEffect(() => {
    if (!topBannerData || !topBannerData.isEnabled) {
      setBannerContent(null);
      return;
    }

    // Get current date at midnight for consistent comparison
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nowTime = now.getTime();

    let shouldShow = false;
    let message = '';
    let bgColor = '';
    const linkUrl = topBannerData.linkUrl;
    const linkText = topBannerData.linkText;

    if (topBannerData.type === 'majlis') {
      if (topBannerData.majlisDate) {
        const majlisDate = new Date(topBannerData.majlisDate);
        majlisDate.setHours(0, 0, 0, 0);
        const majlisTime = majlisDate.getTime();
        const diffTime = majlisTime - nowTime;
        const diffDays = diffTime / (1000 * 3600 * 24);

        if (diffDays >= 0 && diffDays <= 7) {
          shouldShow = true;
          message = topBannerData.majlisText || '';
          bgColor = 'bg-blue-600';
        }
      }
    } else if (topBannerData.type === 'magazine') {
      if (topBannerData.magazineStartDate && topBannerData.magazineEndDate) {
        const startDate = new Date(topBannerData.magazineStartDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(topBannerData.magazineEndDate);
        endDate.setHours(23, 59, 59, 999);

        if (nowTime >= startDate.getTime() && nowTime <= endDate.getTime()) {
          shouldShow = true;
          message = topBannerData.magazineText || '';
          bgColor = 'bg-gradient-to-r from-orange-500 to-orange-600';
        }
      }
    }

    if (shouldShow && message) {
      setBannerContent({ message, bgColor, linkUrl, linkText });
    } else {
      setBannerContent(null);
    }
  }, [topBannerData]);

  // Detect Safari browser
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isSafariBrowser);
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Refresh auth state immediately after logout
        await refreshAuth();
        // Navigate to home page
        router.push('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
      className={`fixed top-0 left-0 right-0 flex flex-col px-3 lg:px-5 shadow-md transition-all duration-300 safari-header safari-performance safari-text-fix safari-header-fallback ${isSafari ? 'bg-black' : ''}`}
      style={{
        zIndex: 1000,
        backgroundColor: isSafari ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        ...(isSafari && {
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          WebkitPerspective: '1000px',
          perspective: '1000px'
        })
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Banner */}
      {showBanner && bannerContent && (
        <TopBanner
          message={bannerContent.message}
          bgColor={bannerContent.bgColor}
          linkUrl={bannerContent.linkUrl}
          linkText={bannerContent.linkText}
          dismissible={true}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {/* Top Navigation Bar */}
      <div className="min-h-[40px] sm:min-h-[44px] lg:min-h-[50px] safari-grid-fix safari-grid-fallback overflow-hidden">
        {/* Left Section */}
        <div className="flex justify-start items-center gap-1 sm:gap-2 lg:gap-6 text-white rounded-none safari-flex-fix">
          <Button
            aria-label="Hamburger menu button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:h-10 lg:w-10"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>

          {/* Mobile Search Icon - positioned next to hamburger menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white h-8 w-8"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search button"
          >
            <Search className="h-4 w-4" />
          </Button>

          {!loading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white flex items-center gap-1 lg:gap-2 hover:bg-white/10 h-8 lg:h-10 px-2 lg:px-3"
                    >
                      <User className="h-4 w-4" />
                      {/* Only show username on larger screens */}
                      <span className="hidden xl:inline text-xs lg:text-sm">{user.username}</span>
                      <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 hidden lg:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 z-[1100]">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        <span>الملف الشخصي</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/change-password" className="flex items-center gap-2 w-full">
                        <Settings className="h-4 w-4" />
                        <span>الإعدادات</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="link"
                  size="sm"
                  className="text-white h-8 lg:h-10 px-2 lg:px-3"
                  onClick={() => router.push('/auth/login')}
                >
                  {/* Show full text on larger screens, just icon on mobile */}
                  <span className="hidden lg:inline text-xs lg:text-sm">{'تسجيل الدخول'}</span>
                  <User className="h-4 w-4 lg:hidden" />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Center Logo */}
        <div className="masthead flex justify-center items-center safari-flex-fix">
          <div className="flex grow-[100] items-center justify-center safari-flex-fix" aria-label="Shuru logo">
            <StrapiLink href="/">
              <StrapiImage
                src={headerData.logo.logoImage.url}
                alt={headerData.logo.logoImage.alternativeText || headerData.logo.alt}
                width={200}
                height={32}
                className="py-2 w-[120px] sm:w-[150px] lg:w-[200px] h-[50px] lg:h-[60px] object-contain block max-w-full safari-image-fix"
                priority
              />
            </StrapiLink>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-end items-stretch gap-1 sm:gap-2 lg:gap-6 h-full safari-flex-fix">
          {/* Show subscribe button only if user is not authenticated */}
            {/* <Link href="/subscribe" className="flex items-stretch">
              <Button
                variant="default"
                size="sm"
                className="text-black/90 rounded-none text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-6 h-full min-h-[40px] sm:min-h-[44px] lg:min-h-[50px] flex items-center"
              >
                {'اشترك الآن'}
              </Button>
            </Link> */}

          {/* Desktop Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-white h-8 w-8 lg:h-10 lg:w-10"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search button"
          >
            <Search className="h-4 w-4 lg:h-5 lg:w-5" />
          </Button>
        </div>
      </div>

      {/* Horizontal Categories - Hidden on mobile */}
      <div
        className={`hidden lg:flex flex-row items-center justify-center gap-2 sm:gap-4 uppercase text-white overflow-visible transition-all duration-300 safari-flex-fix ${
          isScrolled && !isHovered ? 'h-0 opacity-0' : 'h-[20px] sm:h-[23px] opacity-100'
        }`}
      >
        <ul className="flex flex-row justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-normal leading-4 tracking-[1px] sm:tracking-[1.4px] safari-flex-fix">
          {headerData.navigation.primaryMenuItems && headerData.navigation.primaryMenuItems
            .filter((item) => item.onHeader)
            .map((item) => (
            <li
              key={item.order}
              className="border-b-[4px] sm:border-b-[6px] border-transparent transition-colors duration-500 hover:border-orange-500 relative group"
            >
              {item.subItems && item.subItems.length > 0 ? (
                <>
                  <button
                    className="hover:text-orange-500 transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer text-xs sm:text-sm font-normal leading-4 tracking-[1px] sm:tracking-[1.4px] uppercase text-white"
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-black/95 backdrop-blur-md rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.subItems
                        .sort((a, b) => a.order - b.order)
                        .map((subItem, index) => (
                        <StrapiLink
                          key={index}
                          href={subItem.url}
                          isExternal={subItem.openInNewTab}
                          className="block px-4 py-2 text-sm text-white hover:bg-orange-500/20 hover:text-orange-500 transition-colors normal-case"
                        >
                          {subItem.label}
                        </StrapiLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <StrapiLink
                  href={item.url}
                  isExternal={item.openInNewTab}
                  className="hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </StrapiLink>
              )}
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