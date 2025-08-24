import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { formatDate } from '@/lib/utils';
import { Article } from '@/lib/types';

interface LatestArticlesProps {
  articles: Article[];
  title?: string;
  categoryName?: string;
  showMore?: boolean;
  onShowMore?: () => void;
}

export function LatestArticles({
  articles,
  title = "أحدث المقالات",
  categoryName = "عام",
  showMore = false,
  onShowMore
}: LatestArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 px-5 sm:px-10 lg:px-0" dir="rtl">
      <h2 className="text-[37px] font-medium uppercase leading-[33px] tracking-[4.8px] mb-12 md:mb-16 md:text-[60px] md:leading-[48px] md:tracking-[8px] text-right">
        {title}
      </h2>

      <section className="flex flex-col">
        <section className="mb-5 flex flex-col gap-5 lg:mb-10">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="flex flex-col gap-1 px-[20px] sm:px-0 border-t border-t-gray-200 pt-5"
              dir="rtl"
            >
              <div className="flex items-center gap-1 justify-end">
                <p className="flex items-center text-xs font-bold leading-[13px] tracking-[1.4px] text-gray-600">
                  <span className="uppercase">{categoryName}</span>
                </p>
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="flex flex-col gap-2 md:flex-row-reverse md:gap-3 lg:gap-4"
              >
                <div className="w-full space-y-3 order-2 md:order-1">
                  <p className="text-base font-bold leading-[19px] text-black md:text-[25px] md:leading-[28px] text-right">
                    {article.title}
                  </p>
                  {article.description && (
                    <p className="text-sm font-normal leading-4 tracking-[0.2px] text-gray-600 text-right">
                      {article.description}
                    </p>
                  )}
                </div>

                {article.cover_image && (
                  <div className="flex-shrink-0 order-1 md:order-2 w-full md:w-auto">
                    <Image
                      alt={article.cover_image?.alternativeText || article.title}
                      loading="lazy"
                      width={153}
                      height={86}
                      decoding="async"
                      className="w-full h-auto md:w-[153px] md:h-[86px] object-cover rounded"
                      style={{ aspectRatio: '16/9' }}
                      src={getStrapiMedia(article.cover_image.url) || ''}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 153px, 153px"
                    />
                  </div>
                )}
              </Link>
            </article>
          ))}

          {showMore && onShowMore && (
            <button
              onClick={onShowMore}
              className="mx-auto h-11 w-fit rounded-[3px] bg-black px-8 py-2 text-xs font-bold uppercase leading-[13px] tracking-[1.5px] text-white hover:bg-gray-800"
            >
              عرض المزيد
            </button>
          )}
        </section>
      </section>
    </div>
  );
}

// Alternative compact version for smaller sections
export function LatestArticlesCompact({
  articles,
  title = "مقالات ذات صلة",
  maxItems = 5
}: {
  articles: Article[];
  title?: string;
  maxItems?: number;
}) {
  const displayArticles = articles.slice(0, maxItems);

  if (!displayArticles || displayArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-16 border-t border-gray-200" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-gray-600"></div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-6">
        {displayArticles.map((article) => (
          <article
            key={article.id}
            className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0"
            dir="rtl"
          >
            <div className="flex-1 order-1">
              <Link href={`/articles/${article.slug}`}>
                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 hover:text-gray-700 transition-colors text-right">
                  {article.title}
                </h4>
              </Link>

              <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                {article.categories && article.categories.length > 0 && (
                  <>
                    <span>{article.categories[0].name}</span>
                    <span>•</span>
                  </>
                )}
                <time dateTime={article.publish_date}>
                  {formatDate(article.publish_date)}
                </time>
              </div>
            </div>

            {article.cover_image && (
              <div className="flex-shrink-0 w-24 h-16 order-2">
                <Image
                  src={getStrapiMedia(article.cover_image.url) || ''}
                  alt={article.cover_image?.alternativeText || article.title}
                  width={96}
                  height={64}
                  className="w-full h-full object-cover rounded"
                  style={{ aspectRatio: '3/2' }}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
