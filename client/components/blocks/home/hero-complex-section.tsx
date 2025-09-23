"use client"
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { useSelectedArticles } from '@/hooks/use-selected-articles';
import { useMostReadArticles } from '@/hooks/use-most-read-articles';

interface HeroComplexSectionData {
  title?: string;
  subtitle?: string;
  featuredArticle?: Article;
  mostReadArticles?: Article[];
  showMostRead?: boolean;
  maxMostReadArticles?: number;
}

interface HeroComplexSectionProps {
  data: HeroComplexSectionData;
  articles?: Article[];
}

export function HeroComplexSection({ data, articles = [] }: HeroComplexSectionProps) {
  const {
    featuredArticle,
    mostReadArticles = [],
    showMostRead = true,
    maxMostReadArticles = 4,
  } = data;

  // Fetch selected articles from the new endpoint
  const { selectedArticles, maxArticles, loading: selectedLoading } = useSelectedArticles();

  // Fetch most read articles
  const { mostReadArticles: apiMostReadArticles, loading: mostReadLoading } = useMostReadArticles(maxMostReadArticles);

  // Memoize article calculations to prevent unnecessary re-renders
  const processedArticles = useMemo(() => {
    const mainArticle = featuredArticle || articles[0];

    // Use selected articles if available, otherwise fallback to regular articles
    const sideArticles = selectedArticles.length > 0
      ? selectedArticles.slice(0, maxArticles)
      : articles.slice(1, 4);

    console.log('Processing articles:', {
      selectedArticlesCount: selectedArticles.length,
      maxArticles,
      sideArticlesCount: sideArticles.length,
      usingSelectedArticles: selectedArticles.length > 0
    });

    // Use API most read articles first, then CMS most read, then fallback to regular articles
    // Filter out the main article to avoid duplicates
    let trendingPool = apiMostReadArticles.length > 0
      ? apiMostReadArticles
      : mostReadArticles.length > 0
      ? mostReadArticles
      : articles;

    const trendingArticles = trendingPool
      .filter(article => article.id !== mainArticle?.id)
      .slice(0, maxMostReadArticles);

    return { mainArticle, sideArticles, trendingArticles };
  }, [featuredArticle, articles, selectedArticles, maxArticles, mostReadArticles, maxMostReadArticles, apiMostReadArticles]);

  const { mainArticle, sideArticles, trendingArticles } = processedArticles;

  if (!mainArticle) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-[400px]">
        <div className="grid grid-cols-4 gap-5 max-w-screen-xl mx-auto lg:px-5 md:px-10 px-5 pt-8 pb-16">
          <div className="col-span-4 text-center py-20">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مقالات متاحة</h3>
              <p className="text-gray-500">يرجى إضافة المحتوى من لوحة الإدارة</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-5 mt-4 mb-8 md:mb-6 lg:mb-8">
      <section aria-label="homepage-hero-section" className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-5 lg:gap-6">

        {/* Left Sidebar Articles */}
        <div className="lg:col-span-1 order-3 lg:order-1">
          <div className="h-full flex flex-col">
            {/* Section Title */}
            <div className="mb-4">
              <h3 className="text-right font-centra text-[14px] md:text-[16px] font-bold leading-[16px] md:leading-[18px] text-black border-b border-primary-light pb-2">
                {selectedArticles.length > 0 ? 'مقالات مختارة' : 'أحدث المقالات'}
              </h3>
            </div>

            {/* Articles Container Box */}
            <div className="bg-white border border-primary-light rounded-none p-3 md:p-4 shadow-sm flex-1">
              {sideArticles.length > 0 ? sideArticles.map((article, index) => (
              <div
                key={article.id}
                data-parsely-slot={`text-only-article-${index + 1}`}
                className="border-b border-primary-light pt-2 pb-4 md:pb-5 last:border-b-0"
              >
                <article className="grid grid-flow-row auto-rows-max gap-2" aria-label="Landing page card">
                  {/* Category */}
                  <div className="flex items-center gap-1">
                    {article.is_featured && (
                      <div className="h-2 w-2 rounded-full bg-premium" aria-label="Premium dot"></div>
                    )}
                    <p className="flex items-center font-centra text-primary-dark text-left text-[11px] md:text-[13px] font-bold leading-[12px] md:leading-[14px] tracking-[1.2px] md:tracking-[1.4px]">
                      <Link
                        className=""
                        href={`/categories/${article.categories?.[0]?.slug || '#'}`}
                        target="_blank"
                      >
                        {article.categories?.[0]?.name?.toUpperCase() || 'مميز'}
                      </Link>
                    </p>
                  </div>

                  <Link
                    href={`/articles/${article.slug}`}
                    aria-label={`card link`}
                  >
                    <div className="text-right font-centra font-bold text-black text-[13px] md:text-[14px] leading-[15px] md:leading-[16px] mb-1" aria-label="Card title">
                      {article.title}
                    </div>
                    {article.description && (
                      <p className="text-right font-tiempos text-[12px] md:text-[14px] font-light leading-[14px] md:leading-[17px] tracking-[0.2px] text-primary-dark line-clamp-2" aria-label="Card description">
                        {article.description}
                      </p>
                    )}
                  </Link>
                </article>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  {selectedLoading ? 'جارٍ تحميل المقالات المختارة...' : 'لا توجد مقالات متاحة'}
                </p>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Main Featured Article - Center */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="h-full">
            <article className="grid grid-flow-row auto-rows-max gap-2 md:gap-3 h-full" aria-label="Landing page card">
              {/* Category Label */}
              <div className="flex items-center gap-1">
                <p className="flex items-center font-centra text-primary-dark text-left text-[11px] md:text-[13px] font-bold leading-[12px] md:leading-[14px] tracking-[1.2px] md:tracking-[1.4px]">
                  <Link
                    className=""
                    href={`/categories/${mainArticle.categories?.[0]?.slug || '#'}`}
                    target="_blank"
                  >
                    {mainArticle.categories?.[0]?.name?.toUpperCase() || 'أخبار'}
                  </Link>
                </p>
              </div>

              <Link
                href={`/articles/${mainArticle.slug}`}
                aria-label={`card link`}
                className="flex flex-col h-full"
              >
                {/* Hero Image */}
                <div className="relative mb-2 md:mb-3 flex aspect-[16/9] h-auto w-full flex-col items-stretch">
                  {mainArticle.cover_image && getStrapiMedia(mainArticle.cover_image.url) ? (
                    <Image
                      alt={mainArticle.cover_image.alternativeText || mainArticle.title}
                      fetchPriority="high"
                      width={640}
                      height={360}
                      className="w-full h-full object-cover object-center"
                      sizes="(max-width: 1023px) 90vw, 610px"
                      src={getStrapiMedia(mainArticle.cover_image.url)!}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-500 text-xs md:text-sm">لا توجد صورة</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* Title */}
                  <div className="text-right font-centra font-bold text-black text-[18px] leading-[20px] md:text-[24px] md:leading-[26px] lg:text-[28px] lg:leading-[30px] mb-2" aria-label="Card title">
                    {mainArticle.title}
                  </div>

                  {/* Description */}
                  {mainArticle.description && (
                    <p className="text-right font-tiempos text-[13px] md:text-[14px] lg:text-[15px] font-light leading-[15px] md:leading-[17px] lg:leading-[18px] tracking-[0.2px] text-primary-dark line-clamp-3 mt-auto" aria-label="Card description">
                      {mainArticle.description}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          </div>
        </div>

        {/* Right Sidebar - Most Read */}
        <div className="lg:col-span-1 order-2 lg:order-3">
          <div className="h-full flex flex-col">
            <div className="recommender__container flex-1">
              {/* Tab Headers */}
              <div className="flex cursor-pointer justify-between rounded-tl-[3px] font-centra text-[12px] md:text-[13px] font-bold leading-[14px] md:leading-[15px] border-l border-l-primary-light">
                <div className="relative flex h-[36px] md:h-[40px] flex-1 flex-grow items-center justify-center rounded-tl-[3px] rounded-tr-[3px] border-r border-t border-r-primary-light border-t-primary-light">
                  <h4 className="whitespace-nowrap px-2 pb-3 pt-3 text-black">
                    الأكثر قراءة
                    <span className=""> ↓ </span>
                  </h4>
                </div>
              </div>

              {/* Most Read Articles */}
              <div className="recommender-feed min-h-[300px] md:min-h-[400px] lg:min-h-[500px] rounded-[3px] rounded-bl-[3px] rounded-br-[3px] rounded-tl-none rounded-tr-none border-b border-l border-r border-b-primary-light border-l-primary-light border-r-primary-light flex-1">
                {trendingArticles.length > 0 ? trendingArticles.map((article, index) => (
                  <div key={article.id} className="flex w-full border-b border-b-primary-light pb-3 pt-3 last:border-b-0">
                    <div className="flex-shrink-0 ml-2 mr-2 md:ml-3 md:mr-3">
                      <p className="font-gt-america text-[24px] md:text-[32px] font-[275] leading-[20px] md:leading-[24px] text-primary">
                        {index + 1}
                      </p>
                    </div>
                    <article className="card--recommender w-full min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="flex items-center font-centra text-[11px] md:text-[13px] font-bold leading-[12px] md:leading-[13px] tracking-[1.2px] md:tracking-[1.4px] text-primary-dark">
                          <Link
                            className=""
                            href={`/categories/${article.categories?.[0]?.slug || '#'}`}
                            target="_blank"
                          >
                            {article.categories?.[0]?.name?.toUpperCase() || 'أخبار'}
                          </Link>
                        </p>
                      </div>
                      <Link href={`/articles/${article.slug}`}>
                        <div className="flex justify-between gap-3 md:gap-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="font-centra text-[13px] md:text-[14px] lg:text-[14px] font-bold leading-[15px] md:leading-[16px] lg:leading-[16px] text-right mb-1">
                              {article.title}
                            </h2>
                            {article.description && (
                              <p className="text-[11px] md:text-[12px] lg:text-[12px] text-gray-600 leading-[13px] md:leading-[14px] text-right line-clamp-2">
                                {article.description}
                              </p>
                            )}
                          </div>
                          <div className="relative flex-shrink-0 w-[100px] h-[75px]">
                            <div className="relative w-full h-full">
                              {article.cover_image && getStrapiMedia(article.cover_image.url) ? (
                                <Image
                                  alt={article.cover_image.alternativeText || article.title}
                                  loading="lazy"
                                  fill
                                  className="object-cover"
                                  sizes="100px"
                                  src={getStrapiMedia(article.cover_image.url)!}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  </div>
                )) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">لا توجد مقالات شائعة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
