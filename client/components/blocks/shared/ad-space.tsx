import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/components/custom/strapi-image';

interface AdSpaceData {
  title?: string;
  width?: number;
  height?: number;
  image?: {
    url: string;
    alternativeText?: string;
  };
  link?: string;
  linkTarget?: '_self' | '_blank';
  altText?: string;
  customHtml?: string;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

interface AdSpaceProps {
  data: AdSpaceData;
}

export function AdSpace({ data }: AdSpaceProps) {
  const {
    title = "إعلان",
    width = 300,
    height = 250,
    image,
    link,
    linkTarget = "_blank",
    altText,
    customHtml,
    showPlaceholder = true,
    placeholderText = "مساحة إعلانية"
  } = data;

  // If custom HTML is provided, render it
  if (customHtml) {
    return (
      <div className="ad-container flex flex-col items-center justify-center mx-auto mb-8 mt-7 w-full overflow-hidden">
        <div className="text-center font-centra text-[10px] uppercase leading-[12px] tracking-[1px] text-primary-dark mb-2">
          {title}
        </div>
        <div dangerouslySetInnerHTML={{ __html: customHtml }} />
      </div>
    );
  }

  const adContent = (
    <>
      {/* Ad Label */}
      <div className="text-center font-centra text-[10px] uppercase leading-[12px] tracking-[1px] text-primary-dark">
        {title}
      </div>

      {/* Ad Content */}
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mt-2"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {image && getStrapiMedia(image.url) ? (
          <Image
            src={getStrapiMedia(image.url)!}
            alt={altText || image.alternativeText || "Advertisement"}
            width={width}
            height={height}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
        ) : showPlaceholder ? (
          <div className="text-center w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h8a2 2 0 002-2V7M9 7h6M9 11h6m-3 4h3" />
            </svg>
            <span className="text-gray-400 text-sm font-medium">{placeholderText}</span>
            <p className="text-xs text-gray-300 mt-1">{width} × {height}</p>
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="ad-container flex flex-col items-center justify-center mx-auto mb-8 mt-7 w-full overflow-hidden">
      {link ? (
        <Link
          href={link}
          target={linkTarget}
          className="flex flex-col items-center justify-center w-full"
        >
          {adContent}
        </Link>
      ) : (
        adContent
      )}
    </div>
  );
}
