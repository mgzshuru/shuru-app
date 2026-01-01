"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { EventCard } from '@/components/blocks/shared/event-card';
import { AdSpace } from '@/components/blocks/shared/ad-space';

interface SidebarContentItem {
  __component: string;
  id: number;
  [key: string]: any;
}

interface ArticleGridSectionData {
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
  articles?: Article[];
  maxArticles?: number;
  gridColumns?: '2' | '3' | '4';
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  showCategory?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  backgroundColor?: 'white' | 'gray-50' | 'gray-100';
  sectionSpacing?: 'small' | 'medium' | 'large';
  sidebarContent?: SidebarContentItem[];
  showSidebar?: boolean;
}

interface ArticleGridSectionProps {
  data?: ArticleGridSectionData;
  articles?: Article[];
}

export function ArticleGridSection({ data = {}, articles = [] }: ArticleGridSectionProps) {
  const {
    title = "أحدث القصص",
    subtitle,
    showTitle = true,
    articles: sectionArticles = [],
    maxArticles = 10,
    gridColumns = '3',
    category,
    showCategory = true,
    showExcerpt = true,
    showDate = true,
    showAuthor = false,
    backgroundColor = 'white',
    sectionSpacing = 'medium',
    sidebarContent = [],
    showSidebar = true,
  } = data;

  // Get articles to display
  const articlesToDisplay = React.useMemo(() => {
    let filteredArticles = sectionArticles.length > 0 ? sectionArticles : articles;

    // Filter by category if specified
    if (category) {
      filteredArticles = filteredArticles.filter(article =>
        article.categories?.some((cat: any) => cat.id === category.id)
      );
    }

    return filteredArticles.slice(0, maxArticles);
  }, [sectionArticles, articles, category, maxArticles]);

  // Render sidebar content based on component type
  const renderSidebarContent = (item: SidebarContentItem) => {
    switch (item.__component) {
      case 'shared.event-card':
        return <EventCard key={item.id} data={item as any} />;
      case 'shared.ad-space':
        return <AdSpace key={item.id} data={item as any} />;
      default:
        return null;
    }
  };

  if (articlesToDisplay.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-5">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مقالات متاحة</h3>
            <p className="text-gray-500">يرجى إضافة المحتوى من لوحة الإدارة</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div aria-label="homepage river row 2" className="grid grid-cols-4 gap-5 max-w-screen-xl mx-auto lg:px-5 md:px-10 px-5 mb-8">
      <div aria-label="homepage river section 1 & header" className="col-span-4 grid grid-cols-subgrid lg:col-span-3 lg:col-start-1">

        {/* Section Header */}
        {showTitle && (
          <div aria-label="latest-stories-section-header" className="col-span-4 grid grid-cols-[35px_1fr] items-center gap-2 border-b border-primary-light sm:pb-[2px] lg:col-span-3 mb-4">
            <Image
              src="/_public/homepage_icons/latest_news.gif"
              alt="latest_news"
              width={35}
              height={35}
              loading="lazy"
            />
            <div className="font-centra text-[28px] font-bold">{title}</div>
          </div>
        )}

        {/* Articles List */}
        <div className="divide-y col-span-4 lg:col-span-3" aria-label="Homepage post river chunk">
          {articlesToDisplay.map((article) => (
            <article key={article.id} className="card--latestStories flex flex-col gap-[8px] md:px-0 py-4 px-0">

              {/* Categories */}
              <div className="flex items-center gap-1 flex-wrap">
                {showCategory && article.categories && article.categories.length > 0 && (
                  article.categories.map((category, index) => (
                    <div key={category.id} className="flex items-center">
                      <p className="flex items-center font-centra text-primary-dark text-right text-[13px] font-bold leading-[14px] tracking-[1.4px]">
                        <Link
                          className=""
                          href={`/categories/${category.slug}`}
                          target="_blank"
                        >
                          {category.name?.toUpperCase()}
                        </Link>
                      </p>
                      {index < (article.categories?.length || 0) - 1 && (
                        <span className="text-gray-400 mx-1">•</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Article Content */}
              <div className="flex flex-row items-start gap-5">

                {/* Article Image */}
                <div className="relative order-2 aspect-[16/9] w-full min-w-[120px] flex-[1] object-contain md:order-1 md:min-w-[156px] lg:max-w-[295px] lg:flex-[3]">
                  {article.cover_image && getStrapiMedia(article.cover_image.url) ? (
                    <Image
                      data-testid="latest-stories-card-image"
                      alt={article.cover_image.alternativeText || article.title}
                      loading="lazy"
                      width={295}
                      height={166}
                      className="order-2 aspect-[16/9] w-full min-w-[120px] flex-[1] object-contain md:order-1 md:min-w-[156px] lg:max-w-[295px] lg:flex-[3]"
                      sizes="(max-width: 768px) 22vw, (max-width: 1200px) 21vw, 295px"
                      src={getStrapiMedia(article.cover_image.url)!}
                    />
                  ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500 text-sm">لا توجد صورة</span>
                    </div>
                  </div>
                )}
                </div>

                {/* Article Text */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="order-1 col-start-2 col-end-5 flex-[3] text-right font-centra text-[14px] font-bold leading-[16px] text-black md:order-2 md:text-[20px] md:leading-[22px] lg:flex-[5]"
                  aria-label="Card title"
                >
                  <span className="mb-1 block">{article.title}</span>
                  {showExcerpt && article.description && (
                    <p className="text-right font-tiempos text-[14px] font-light leading-[17px] tracking-[0.2px] text-primary-dark" aria-label="Card description">
                      {article.description}
                    </p>
                  )}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      {showSidebar && (
        <div aria-label="row 2 right rail" className="col-span-4 col-start-1 grid grid-cols-subgrid lg:col-span-1 lg:col-start-4">
          <div className="lg:sticky lg:top-[97px] w-full initial h-fit lg:col-span-1 col-span-4">
            {sidebarContent && sidebarContent.length > 0 ? (
              sidebarContent.map(renderSidebarContent)
            ) : (
              // Default content when no dynamic content is provided
              <>
                {/* Default Events Promo Card */}
                <article className="border-borderColor flex w-auto flex-col gap-[16px] border px-5 pb-6 pt-5 lg:border-0 mb-8" aria-label="Events promo card">
                  <div className="flex flex-row items-center gap-[8px] border-b-[1px] border-primary-light pb-[8px]">
                    <Image
                      src="/_public/homepage_icons/events.gif"
                      width={35}
                      height={35}
                      alt="events-icon"
                    />
                    <p className="text-right font-centra text-[28px] font-bold leading-[21px]">حفظ التاريخ</p>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <div className="flex flex-col gap-5 md:gap-3">
                      <p className="flex items-center font-centra text-right text-[13px] font-bold leading-[14px] tracking-[1.4px] text-primary-dark">
                        <span>15-18 سبتمبر | الرياض</span>
                      </p>

                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-[16/9] flex items-center justify-center rounded-lg">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>

                      <div>
                        <div aria-label="Event promo information" className="flex flex-col gap-[4px]">
                          <a className="text-right font-centra text-[16px] font-bold leading-[19px] tracking-[0.28125px]" href="/events">
                            مهرجان شُرو للابتكار
                          </a>
                          <p className="text-right font-tiempos text-[14px] font-normal leading-[17px] tracking-[0.2px] text-accessiblegray">
                            حدث الابتكار لهذا العام سيجمع آلاف الصناع والمبتكرين من جميع أنحاء العالم—قادة استثناائيون وصناع يشكلون المستقبل—لأربعة أيام من المحادثات الملهمة والتواصل الهادف والنتائج المفيدة.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      className="inline-block w-full rounded-[3px] bg-primary px-8 py-[16px] uppercase text-center font-centra text-[13px] font-bold leading-[13px] tracking-[1.5px] text-white md:w-auto hover:bg-primary/90 transition-colors"
                      href="/events"
                    >
                      سجل الآن
                    </Link>
                  </div>
                </article>

                {/* Default Ad Space Placeholder */}
                <div className="ad-container ad-container--homepage_rail flex flex-col items-center justify-center mx-auto mb-8 mt-7 min-h-[298px] w-full overflow-hidden">
                  <div className="text-center font-centra text-[10px] uppercase leading-[12px] tracking-[1px] text-primary-dark">
                    إعلان
                  </div>
                  <div className="w-full h-[250px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mt-2">
                    <div className="text-center">
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h8a2 2 0 002-2V7M9 7h6M9 11h6m-3 4h3" />
                      </svg>
                      <span className="text-gray-400 text-sm font-medium">مساحة إعلانية</span>
                      <p className="text-xs text-gray-300 mt-1">300 × 600</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
