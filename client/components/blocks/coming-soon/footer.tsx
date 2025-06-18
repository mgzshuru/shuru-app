'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StrapiLink } from '@/components/custom/strapi-link';

interface NavigationItem {
  id: number;
  text: string;
  href: string;
  isExternal: boolean;
  icon: string | null;
}

interface FooterProps {
  copyright_text: string;
  logo: {
    logoText: string;
    image: {
      src: string;
      alternativeText: string | null;
    };
    mobileImage?: {
      src: string;
      alternativeText: string | null;
    };
  };
  socialMedia: NavigationItem[];
  bottomLinks: NavigationItem[];
}

export const Footer = ({ 
  copyright_text,
  logo,
  socialMedia,
  bottomLinks
}: FooterProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [mobileLogoUrl, setMobileLogoUrl] = useState<string | null>(null);

  // Get the processed logo URLs on component mount
  useEffect(() => {
    if (logo?.image?.src) {
      setLogoUrl(logo.image.src);
    }
    if (logo?.mobileImage?.src) {
      setMobileLogoUrl(logo.mobileImage.src);
    }
  }, [logo]);

  return (
    <footer className="footer-container mt-8 grid gap-[40px] lg:mt-12">
      {/* Bottom Section with Logo Background */}
      <div 
        className="footer-server grid w-full gap-12 bg-bottom bg-no-repeat px-5 pt-8 md:pt-16 pb-6 md:pb-12 relative"
      >
        {/* Logo background with transparency */}
        {logoUrl && (
          <>
            <div 
              className="absolute inset-0 z-0 bg-bottom bg-no-repeat hidden md:block"
              style={{ 
                backgroundImage: `url(${logoUrl})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                opacity: 0.15,
                backgroundRepeat: 'no-repeat'
              }}
            />
            {mobileLogoUrl && (
              <div 
                className="absolute inset-0 z-0 bg-bottom bg-no-repeat md:hidden"
                style={{ 
                  backgroundImage: `url(${mobileLogoUrl})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  opacity: 0.15,
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}
          </>
        )}
        
        {/* Content with proper z-index to stay above the background */}
        <div className="relative z-10 flex flex-col justify-around h-full">
          {/* Social Media Links */}
          <ul className="flex flex-row justify-center gap-5 mb-4 md:mb-8">
            {socialMedia?.map((item) => (
              <li key={item.id}>
                <StrapiLink
                  href={item.href}
                  isExternal={item.isExternal}
                  aria-label={item.text}
                  className="text-black hover:opacity-80 transition-opacity"
                >
                  {item.icon && (
                    <Image
                      src={`/icons/${item.icon}.svg`}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                  )}
                </StrapiLink>
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <div className="flex flex-row justify-center gap-2 mb-6">
            <p className="text-center font-centra text-[14px] leading-5 font-medium">
              {copyright_text}
            </p>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-8">
            {bottomLinks?.map((link) => (
              <StrapiLink
                key={link.id}
                href={link.href}
                isExternal={link.isExternal}
                className="underline"
              >
                <h3 className="font-centra text-[12px] leading-4 text-primary-dark">
                  {link.text}
                </h3>
              </StrapiLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
