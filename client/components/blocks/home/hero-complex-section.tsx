"use client"
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { useSelectedArticles } from '@/hooks/use-selected-articles';

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
  const { selectedArticles, loading: selectedLoading } = useSelectedArticles();

  // Memoize article calculations to prevent unnecessary re-renders
  const processedArticles = useMemo(() => {
    const mainArticle = featuredArticle || articles[0];

    // Use selected articles if available, otherwise fallback to regular articles
    const sideArticles = selectedArticles.length > 0
      ? selectedArticles.slice(0, 3)
      : articles.slice(1, 4);

    console.log('Processing articles:', {
      selectedArticlesCount: selectedArticles.length,
      sideArticlesCount: sideArticles.length,
      usingSelectedArticles: selectedArticles.length > 0
    });

    const trendingArticles = mostReadArticles.length > 0
      ? mostReadArticles.slice(0, maxMostReadArticles)
      : articles.slice(0, maxMostReadArticles);
    const bottomArticles = articles.slice(4, 7);

    return { mainArticle, sideArticles, trendingArticles, bottomArticles };
  }, [featuredArticle, articles, selectedArticles, mostReadArticles, maxMostReadArticles]);

  const { mainArticle, sideArticles, trendingArticles, bottomArticles } = processedArticles;  if (!mainArticle) {
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
    <div className="grid grid-cols-4 gap-5 max-w-screen-xl mx-auto lg:px-5 md:px-10 px-5 mt-4">
      <section aria-label="homepage-hero-section" className="col-span-4 grid grid-cols-subgrid gap-y-6 lg:gap-x-5 lg:gap-y-7">

        {/* Main Featured Article - Center */}
        <div
          data-parsely-slot="hero-article"
          className="col-span-4 col-start-1 row-start-1 lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <article className="grid grid-flow-row auto-rows-max gap-2" aria-label="Landing page card">
            {/* Category Label */}
            <div className="flex items-center gap-1">
              <p className="flex items-center font-centra text-primary-dark text-left text-[13px] font-bold leading-[14px] tracking-[1.4px]">
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
            >
              {/* Hero Image */}
              <div className="relative mb-3 flex aspect-[16/9] h-auto w-full flex-col items-stretch">
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
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-500 text-sm">لا توجد صورة</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="text-right font-centra font-bold text-black text-[20px] leading-[22px] md:text-[28px] md:leading-[30px]" aria-label="Card title">
                {mainArticle.title}
              </div>

              {/* Description */}
              {mainArticle.description && (
                <p className="mt-1 text-right font-tiempos text-[14px] font-light leading-[17px] tracking-[0.2px] text-primary-dark" aria-label="Card description">
                  {mainArticle.description}
                </p>
              )}
            </Link>
          </article>
        </div>

        {/* Left Sidebar Articles */}
        <div className="col-span-4 col-start-1 row-start-4 flex flex-col gap-y-5 border-primary-light md:mt-[-1.5rem] lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-r lg:pr-6">
          {/* Section Title */}
          <div className="mb-4">
            <h3 className="text-right font-centra text-[16px] font-bold leading-[18px] text-black border-b border-primary-light pb-2">
              {selectedArticles.length > 0 ? 'مقالات مختارة' : 'أحدث المقالات'}
            </h3>
          </div>

          {/* Articles Container Box */}
          <div className="bg-white border border-primary-light rounded-none p-4 shadow-sm">
            {sideArticles.length > 0 ? sideArticles.map((article, index) => (
            <div
              key={article.id}
              data-parsely-slot={`text-only-article-${index + 1}`}
              className="border-b border-primary-light pt-2 pb-6 last-of-type:border-b-0 lg:pb-5"
            >
              <article className="grid grid-flow-row auto-rows-max gap-2" aria-label="Landing page card">
                {/* Category */}
                <div className="flex items-center gap-1">
                  {article.is_featured && (
                    <div className="h-2 w-2 rounded-full bg-premium" aria-label="Premium dot"></div>
                  )}
                  <p className="flex items-center font-centra text-primary-dark text-left text-[13px] font-bold leading-[14px] tracking-[1.4px]">
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
                  <div className="text-right font-centra font-bold text-black text-[14px] leading-[16px] md:text-[20px] md:leading-[22px]" aria-label="Card title">
                    {article.title}
                  </div>
                  {article.description && (
                    <p className="mt-1 text-right font-tiempos text-[14px] font-light leading-[17px] tracking-[0.2px] text-primary-dark" aria-label="Card description">
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
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-400 mt-1">
                  Selected: {selectedArticles.length}, Articles: {articles.length}
                </p>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Right Sidebar - Most Read */}
        <div className="col-span-4 col-start-1 row-start-2 grid gap-y-6 overflow-hidden pb-6 lg:col-start-4 lg:row-span-3 lg:row-start-1 lg:block">
          <div className="recommender__container lg:max-w-[295px]">
            {/* Tab Headers */}
            <div className="flex cursor-pointer justify-between rounded-tl-[3px] font-centra text-[13px] font-bold leading-[15px] border-l border-l-primary-light">
              <div className="relative flex h-[40px] flex-1 flex-grow items-center justify-center rounded-tl-[3px] rounded-tr-[3px] border-r border-t border-r-primary-light border-t-primary-light">
                <h4 className="whitespace-nowrap px-2 pb-3 pt-3 text-black">
                  الأكثر قراءة
                  <span className=""> ↓ </span>
                </h4>
              </div>
            </div>

            {/* Most Read Articles */}
            <div className="recommender-feed min-h-80 rounded-[3px] rounded-bl-[3px] rounded-br-[3px] rounded-tl-none rounded-tr-none border-b border-l border-r border-b-primary-light border-l-primary-light border-r-primary-light lg:min-h-max">
              {trendingArticles.length > 0 ? trendingArticles.map((article, index) => (
                <div key={article.id} className="flex w-full border-b border-b-primary-light pb-4 pt-3">
                  <p className="ml-[8px] mr-[8px] font-gt-america text-[32px] font-[275] leading-[24px] text-primary">
                    {index + 1}
                  </p>
                  <article className="card--recommender w-full">
                    <div className="flex items-center gap-[10px]">
                      <p className="flex items-center font-centra text-subhead font-bold leading-[13px] tracking-[1.4px] text-primary-dark">
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
                      <div className="mt-2 flex justify-between gap-4">
                        <h2 className="flex-1 font-centra text-[14px] font-bold leading-[16px] md:text-[20px] md:leading-[22px] lg:text-[14px] lg:leading-[16px] text-right">
                          {article.title}
                        </h2>
                        <div className="relative aspect-[16/9] flex-[0_0_120px] md:flex-[0_0_318px] lg:flex-[0_0_120px]">
                          <div className="relative">
                            {article.cover_image && getStrapiMedia(article.cover_image.url) ? (
                              <Image
                                alt={article.cover_image.alternativeText || article.title}
                                loading="lazy"
                                width={120}
                                height={70}
                                className="aspect-[16/9] w-full lg:w-auto"
                                src={getStrapiMedia(article.cover_image.url)!}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center aspect-[16/9]">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Ad Space - Hidden */}
            {/* <div className="spacer mb-6 hidden lg:block"></div>
            <div className="ad-container ad-container--rail flex-col items-center justify-center mx-auto min-h-[298px] w-full overflow-hidden mb-0 mt-0 hidden lg:relative lg:-left-[2.5px] lg:inline-flex lg:flex-col lg:items-center lg:justify-start lg:overflow-visible">
              <div className="text-center font-centra text-[10px] uppercase leading-[12px] tracking-[1px] text-primary-dark">
                إعلان
              </div>
              <div className="w-full h-[250px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mt-2">
                <div className="text-center">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h8a2 2 0 002-2V7M9 7h6M9 11h6m-3 4h3" />
                  </svg>
                  <span className="text-gray-400 text-sm font-medium">مساحة إعلانية</span>
                  <p className="text-xs text-gray-300 mt-1">300 × 250</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Articles Row */}
        <div className="col-span-4 col-start-1 row-start-5 grid gap-y-5 border-primary-light lg:col-span-3 lg:col-start-1 lg:row-start-3 lg:grid-cols-subgrid lg:border-t lg:pt-6">
          {bottomArticles.length > 0 ? bottomArticles.map((article, index) => (
            <div
              key={article.id}
              data-parsely-slot={`bottom-article-${index + 1}`}
              className="border-b border-primary-light pb-5 lg:col-start-1 lg:border-b-0"
            >
              <article className="grid grid-flow-row auto-rows-max gap-3" aria-label="Mini landing page card">
                <div className="flex items-center gap-1">
                  <p className="flex items-center font-centra text-primary-dark text-left text-[13px] font-bold leading-[13px] tracking-[1.82px] sm:text-[13px] sm:leading-[14px] sm:tracking-[1.4px]">
                    <Link
                      className=""
                      href={`/categories/${article.categories?.[0]?.slug || '#'}`}
                      target="_blank"
                    >
                      {article.categories?.[0]?.name?.toUpperCase() || 'أخبار'}
                    </Link>
                  </p>
                </div>
                <Link
                  href={`/articles/${article.slug}`}
                  aria-label={`card link`}
                  className="flex gap-5 lg:flex-col"
                >
                  <div className="relative min-w-[120px] max-w-[120px] md:max-w-none md:flex-[1]">
                    {article.cover_image && getStrapiMedia(article.cover_image.url) ? (
                      <Image
                        alt={article.cover_image.alternativeText || article.title}
                        loading="lazy"
                        width={295}
                        height={166}
                        className="aspect-video w-full"
                        sizes="(max-width: 639px) 120px, (max-width: 767px) 50vw, 295px"
                        src={getStrapiMedia(article.cover_image.url)!}
                      />
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-[4px] md:flex-[1]">
                    <div className="text-right font-centra text-[14px] font-bold leading-[16px] text-black md:text-[20px] md:leading-[22px]" aria-label="Card title">
                      {article.title}
                    </div>
                    {article.description && (
                      <p className="mt-1 text-right font-tiempos text-[14px] font-light leading-[17px] tracking-[0.2px] text-primary-dark" aria-label="Card description">
                        {article.description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            </div>
          )) : (
            <div className="col-span-3 text-center py-8">
              {/* <h4 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مقالات إضافية</h4>
              <p className="text-gray-400 text-sm">سيتم عرض المزيد من المقالات هنا عند توفرها</p> */}
            </div>
          )}
        </div>

        {/* Mobile Ad Space - Hidden */}
        {/* <div className="col-span-4 row-start-6 text-center lg:hidden">
          <div className="ad-container ad-container--rail flex flex-col items-center justify-center mx-auto min-h-[298px] w-full overflow-hidden mb-0 mt-0">
            <div className="text-center font-centra text-[10px] uppercase leading-[12px] tracking-[1px] text-primary-dark">
              إعلان
            </div>
            <div className="w-full h-[250px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mt-2">
              <div className="text-center">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v10a2 2 0 002 2h8a2 2 0 002-2V7M9 7h6M9 11h6m-3 4h3" />
                </svg>
                <span className="text-gray-400 text-sm font-medium">مساحة إعلانية</span>
                <p className="text-xs text-gray-300 mt-1">300 × 250</p>
              </div>
            </div>
          </div>
        </div> */}

      </section>
    </div>
  );
}
