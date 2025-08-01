import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { MagazineIssue } from '@/lib/types';

interface MagazineGridProps {
  issues: MagazineIssue[];
  variant?: 'featured' | 'standard';
  className?: string;
}

export function MagazineGrid({ issues, variant = 'standard', className = '' }: MagazineGridProps) {
  const gridClass = variant === 'featured'
    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
    : 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

  return (
    <div className={`${gridClass} ${className}`}>
      {issues.map((issue) => (
        <MagazineCard
          key={issue.id}
          issue={issue}
          variant={variant}
        />
      ))}
    </div>
  );
}

interface MagazineCardProps {
  issue: MagazineIssue;
  variant?: 'featured' | 'standard';
  priority?: boolean;
}

export function MagazineCard({ issue, variant = 'standard', priority = false }: MagazineCardProps) {
  const cardClass = variant === 'featured'
    ? 'bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300'
    : 'bg-white border border-gray-300 hover:shadow-lg transition-shadow duration-300';

  const aspectRatio = 'aspect-[3/4]';

  return (
    <Link href={`/magazine/${issue.slug}`} className="group block">
      <article className={cardClass}>
        {/* Cover Image */}
        <div className={`${aspectRatio} relative overflow-hidden`}>
          <Image
            src={getStrapiMedia(issue.cover_image?.url) || '/placeholder-magazine.jpg'}
            alt={issue.cover_image?.alternativeText || issue.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />

          {/* Issue Number Badge */}
          <div className={`absolute top-4 right-4 ${
            variant === 'featured'
              ? 'bg-black text-white px-3 py-1 text-sm font-bold'
              : 'bg-black bg-opacity-90 text-white px-2 py-1 text-xs font-bold'
          }`}>
            العدد {issue.issue_number}
          </div>

          {/* Featured Badge */}
          {issue.is_featured && variant === 'standard' && (
            <div className="absolute top-4 left-4 bg-orange-500 text-black px-2 py-1 text-xs font-bold">
              مميز
            </div>
          )}
        </div>

        {/* Content */}
        <div className={variant === 'featured' ? 'p-6' : 'p-4'}>
          <h3 className={`font-bold text-black mb-3 group-hover:text-gray-600 transition-colors font-['IBM_Plex_Sans_Arabic'] line-clamp-2 ${
            variant === 'featured' ? 'text-xl' : 'text-lg'
          }`}>
            {issue.title}
          </h3>

          <div className="text-sm text-gray-500 mb-3 font-['IBM_Plex_Sans_Arabic']">
            {formatDate(issue.publish_date)}
          </div>

          {variant === 'featured' && issue.description && (
            <div
              className="text-gray-600 text-sm line-clamp-3 font-['IBM_Plex_Sans_Arabic']"
              dangerouslySetInnerHTML={{
                __html: issue.description.length > 150
                  ? issue.description.substring(0, 150) + '...'
                  : issue.description
              }}
            />
          )}

          {/* Article Count */}
          {issue.articles && issue.articles.length > 0 && (
            <div className="mt-3 text-xs text-gray-500 font-['IBM_Plex_Sans_Arabic']">
              {issue.articles.length} مقال
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

interface MagazineHeroProps {
  issue: MagazineIssue;
}

export function MagazineHero({ issue }: MagazineHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Background Image */}
      {issue.cover_image && (
        <div className="absolute inset-0">
          <Image
            src={getStrapiMedia(issue.cover_image.url) || '/placeholder-magazine.jpg'}
            alt={issue.cover_image.alternativeText || issue.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      )}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Cover Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[3/4] max-w-md mx-auto relative bg-gray-100 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={getStrapiMedia(issue.cover_image?.url) || '/placeholder-magazine.jpg'}
                alt={issue.cover_image?.alternativeText || issue.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 text-center lg:text-right">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full mb-6 font-['IBM_Plex_Sans_Arabic']">
              العدد {issue.issue_number}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-['IBM_Plex_Sans_Arabic']">
              {issue.title}
            </h1>

            <div className="flex items-center justify-center lg:justify-end text-gray-300 mb-8 font-['IBM_Plex_Sans_Arabic']">
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(issue.publish_date)}
            </div>

            {issue.description && (
              <div
                className="text-lg text-gray-300 leading-relaxed mb-8 font-['IBM_Plex_Sans_Arabic'] max-w-xl mx-auto lg:mx-0"
                dangerouslySetInnerHTML={{
                  __html: issue.description.length > 200
                    ? issue.description.substring(0, 200) + '...'
                    : issue.description
                }}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <Link
                href={`/magazine/${issue.slug}`}
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
              >
                اقرأ العدد
              </Link>

              {issue.pdf_attachment && getStrapiMedia(issue.pdf_attachment.url) && (
                <a
                  href={getStrapiMedia(issue.pdf_attachment.url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors duration-200 font-['IBM_Plex_Sans_Arabic']"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  تحميل PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MagazineStatsProps {
  totalIssues: number;
  totalArticles?: number;
  establishedYear?: number;
}

export function MagazineStats({ totalIssues, totalArticles, establishedYear }: MagazineStatsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-blue-600 mb-2 font-['IBM_Plex_Sans_Arabic']">
              {totalIssues}
            </div>
            <div className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
              عدد إجمالي
            </div>
          </div>

          {totalArticles && (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2 font-['IBM_Plex_Sans_Arabic']">
                {totalArticles}+
              </div>
              <div className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
                مقال منشور
              </div>
            </div>
          )}

          {establishedYear && (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2 font-['IBM_Plex_Sans_Arabic']">
                {new Date().getFullYear() - establishedYear}+
              </div>
              <div className="text-gray-600 font-['IBM_Plex_Sans_Arabic']">
                سنة من التميز
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
