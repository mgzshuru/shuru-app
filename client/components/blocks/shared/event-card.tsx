import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/components/custom/strapi-image';

interface EventCardData {
  title: string;
  description?: string;
  dateText?: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
  ctaText?: string;
  ctaLink?: string;
  sectionTitle?: string;
  sectionIcon?: string;
}

interface EventCardProps {
  data: EventCardData;
}

export function EventCard({ data }: EventCardProps) {
  const {
    title,
    description,
    dateText,
    image,
    ctaText = "سجل الآن",
    ctaLink = "/events",
    sectionTitle = "حفظ التاريخ",
    sectionIcon = "/_public/homepage_icons/events.gif"
  } = data;

  return (
    <article
      className="border-borderColor flex w-auto flex-col gap-[16px] border px-5 pb-6 pt-5 lg:border-0 mb-8"
      aria-label="Events promo card"
    >
      {/* Section Header */}
      <div className="flex flex-row items-center gap-[8px] border-b-[1px] border-primary-light pb-[8px]">
        <Image
          src={sectionIcon}
          width={35}
          height={35}
          alt="events-icon"
        />
        <p className="text-left font-centra text-[28px] font-bold leading-[21px]">
          {sectionTitle}
        </p>
      </div>

      {/* Event Content */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col gap-5 md:gap-3">
          {/* Date Text */}
          {dateText && (
            <p className="flex items-center font-centra text-left text-[13px] font-bold leading-[14px] tracking-[1.4px] text-primary-dark">
              <span>{dateText}</span>
            </p>
          )}

          {/* Event Image */}
          <div className="aspect-[16/9] flex items-center justify-center rounded-lg overflow-hidden">
            {image && getStrapiMedia(image.url) ? (
              <Image
                src={getStrapiMedia(image.url)!}
                alt={image.alternativeText || title}
                width={300}
                height={169}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Event Information */}
          <div>
            <div aria-label="Event promo information" className="flex flex-col gap-[4px]">
              <a
                className="text-left font-centra text-[16px] font-bold leading-[19px] tracking-[0.28125px]"
                href={ctaLink}
              >
                {title}
              </a>
              {description && (
                <p className="text-left font-tiempos text-[14px] font-normal leading-[17px] tracking-[0.2px] text-accessiblegray">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div>
        <Link
          className="inline-block w-full rounded-[3px] bg-primary px-8 py-[16px] uppercase text-center font-centra text-[13px] font-bold leading-[13px] tracking-[1.5px] text-white md:w-auto hover:bg-primary/90 transition-colors"
          href={ctaLink}
        >
          {ctaText}
        </Link>
      </div>
    </article>
  );
}
