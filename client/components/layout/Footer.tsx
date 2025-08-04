'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FooterData } from '@/lib/types';
import { getStrapiURL } from '@/lib/utils';
import { getAllCategories } from '@/lib/strapi-client';
import CategoriesGrid from './CategoriesGrid';

interface FooterProps {
  footerData: FooterData;
}

export default function Footer({ footerData }: FooterProps) {
  // Prepare logo URLs
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [mobileLogoUrl, setMobileLogoUrl] = useState<string | null>(null);
  const [hasCategories, setHasCategories] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    if (footerData.logo.logoImage?.url) {
      setLogoUrl(getStrapiURL() + footerData.logo.logoImage.url);
    }
    if (footerData.logo.mobileImage?.url) {
      setMobileLogoUrl(getStrapiURL() + footerData.logo.mobileImage.url);
    }
  }, [footerData.logo]);

  // Check if categories exist and store the data
  useEffect(() => {
    const checkCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response?.data && Array.isArray(response.data)) {
          setCategoriesData(response.data);
          // Check if there are root categories with valid order
          const rootCategories = response.data.filter((cat: any) => !cat.parent_category);
          const orderedCategories = rootCategories.filter((cat: any) =>
            cat.order !== null && cat.order !== undefined
          );
          setHasCategories(orderedCategories.length > 0);
        } else {
          setCategoriesData([]);
          setHasCategories(false);
        }
      } catch (error) {
        console.error('Error checking categories:', error);
        setCategoriesData([]);
        setHasCategories(false);
      } finally {
        setCategoriesLoading(false);
      }
    };

    checkCategories();
  }, []);

  // Sort social links and bottom links by order
  const sortedSocialLinks = footerData?.socialLinks ? [...footerData.socialLinks].sort((a, b) => a.order - b.order) : [];
  const sortedBottomLinks = footerData?.bottomLinks ? [...footerData.bottomLinks].sort((a, b) => a.order - b.order) : [];

  // Copyright text
  const arabicYear = footerData.copyright.showCurrentYear ? new Date().getFullYear() : footerData.copyright.year;
  const copyrightText =
    footerData.copyright.customText ||
    `© ${arabicYear.toString()} ${footerData.copyright.companyName}${footerData.copyright.allRightsReserved ? '. جميع الحقوق محفوظة.' : footerData.copyright.customText }`;

  return (
    <footer className="footer-container mt-8 grid gap-[40px] lg:mt-12">

      {/* Categories Grid Section - Only render if categories exist */}
      {!categoriesLoading && hasCategories && (
        <div className="categories-section bg-gray-50 py-8 md:py-12">
          <CategoriesGrid categoriesData={categoriesData} />
        </div>
      )}

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
            {sortedSocialLinks?.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.link.href}
                  target={item.link.openInNewTab ? '_blank' : '_self'}
                  aria-label={item.platform}
                  className="text-black hover:opacity-80 transition-opacity"
                  rel={item.link.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  <Image
                    src={`/icons/${item.platform}.svg`}
                    alt={item.platform}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <div className="flex flex-row justify-center gap-2 mb-6">
            <p className="text-center font-centra text-[14px] leading-5 font-medium">
              {copyrightText}
            </p>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-8">
            {sortedBottomLinks?.map((link, idx) => (
              <Link
                key={idx}
                href={link.link.href}
                target={link.link.openInNewTab ? '_blank' : '_self'}
                rel={link.link.openInNewTab ? 'noopener noreferrer' : undefined}
                className="underline"
              >
                <h3 className="font-centra text-[12px] leading-4 text-primary-dark">
                  {link.link.text}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}