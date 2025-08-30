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
      <h2 className="text-[37px] font-medium uppercase leading-[42px] tracking-[4.8px] mb-12 md:mb-16 md:text-[60px] md:leading-[64px] md:tracking-[8px] text-right">
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
              <Link
                href={`/articles/${article.slug}`}
                className="flex flex-col gap-2 md:flex-row md:gap-6"
              >
                {article.cover_image && (
                  <div className="flex-shrink-0 order-1 w-full md:w-auto">
                    <Image
                      alt={article.cover_image?.alternativeText || article.title}
                      loading="lazy"
                      width={240}
                      height={160}
                      decoding="async"
                      className="w-full h-auto md:w-[240px] md:h-[160px] object-cover"
                      style={{ aspectRatio: '3/2' }}
                      src={getStrapiMedia(article.cover_image.url) || ''}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 240px, 240px"
                    />
                  </div>
                )}

                <div className="w-full space-y-3 order-2">
                  {/* Categories */}
                  {article.categories && article.categories.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mb-2" dir="rtl">
                      {article.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="text-orange-600 hover:text-orange-700 font-medium text-xs uppercase tracking-wide border border-orange-200 hover:border-orange-300 px-2 py-1 rounded transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  <p className="text-base font-bold leading-[19px] text-black md:text-[25px] md:leading-[28px] text-right">
                    {article.title}
                  </p>
                  {article.description && (
                    <p className="text-sm font-normal leading-4 tracking-[0.2px] text-gray-600 text-right">
                      {article.description}
                    </p>
                  )}
                </div>
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
            {article.cover_image && (
              <div className="flex-shrink-0 w-32 h-24 order-1">
                <Image
                  src={getStrapiMedia(article.cover_image.url) || ''}
                  alt={article.cover_image?.alternativeText || article.title}
                  width={128}
                  height={96}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
            )}

            <div className="flex-1 order-2">
              {/* Categories */}
              {article.categories && article.categories.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mb-2" dir="rtl">
                  {article.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-orange-600 hover:text-orange-700 font-medium text-xs uppercase tracking-wide border border-orange-200 hover:border-orange-300 px-1.5 py-0.5 rounded transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link href={`/articles/${article.slug}`}>
                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 hover:text-gray-700 transition-colors text-right">
                  {article.title}
                </h4>
              </Link>

              <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                <time dateTime={article.publish_date}>
                  {formatDate(article.publish_date)}
                </time>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
