import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthorById, getArticlesByAuthor } from '@/lib/strapi-client';
import { getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { SaveButton } from '@/components/custom/save-button';
import { formatDate } from '@/lib/utils';
import { Author, Article } from '@/lib/types';
import { User, MapPin, Briefcase, Calendar, BookOpen } from 'lucide-react';

interface AuthorPageProps {
  params: Promise<{ documentId: string }>;
}

// Generate metadata for individual author pages
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  try {
    const { documentId } = await params;

    const [author, globalData] = await Promise.all([
      getAuthorById(documentId),
      getGlobalCached().catch(() => null)
    ]);

    if (!author) {
      return {
        title: 'المؤلف غير موجود',
        description: 'المؤلف المطلوب غير متوفر.',
        robots: { index: false, follow: false },
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const authorUrl = `${baseUrl}/authors/${(author as any).documentId}`;

    const title = (author as any).name || 'مؤلف شروع';

    // Create description with bio if available, fallback to job info
    let description = '';
    if ((author as any).bio) {
      // Use first 150 characters of bio for meta description
      description = `${(author as any).bio.substring(0, 150)}${(author as any).bio.length > 150 ? '...' : ''}`;
    } else if ((author as any).jobTitle && (author as any).organization) {
      description = `${(author as any).name} - ${(author as any).jobTitle} في ${(author as any).organization}. تعرف على مقالات وكتابات ${(author as any).name} في شروع.`;
    } else {
      description = `${(author as any).name} - كاتب ومؤلف في شروع. تعرف على مقالات وكتابات ${(author as any).name}.`;
    }

    const avatarImage = (author as any).avatar ? getStrapiMedia((author as any).avatar.url) : null;
    const defaultImage = globalData?.defaultSeo?.og_image ?
      getStrapiMedia(globalData.defaultSeo.og_image.url) : null;

    return {
      title,
      description,
      keywords: `${(author as any).name}, مؤلف, كاتب, شروع, ${(author as any).jobTitle || ''}, ${(author as any).organization || ''}`.replace(/,\s*,/g, ','),
      openGraph: {
        title,
        description,
        url: authorUrl,
        siteName: globalData?.siteName || 'شروع',
        locale: 'ar_SA',
        type: 'profile',
        images: [{
          url: avatarImage || defaultImage || '',
          width: (author as any).avatar?.width || globalData?.defaultSeo?.og_image?.width || 400,
          height: (author as any).avatar?.height || globalData?.defaultSeo?.og_image?.height || 400,
          alt: (author as any).avatar?.alternativeText || `صورة ${(author as any).name}`,
        }].filter(img => img.url),
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: avatarImage || defaultImage ? [avatarImage || defaultImage || ''] : [],
      },
      alternates: {
        canonical: authorUrl,
      },
    };
  } catch (error) {
    console.error('Error generating author metadata:', error);
    return {
      title: 'خطأ في تحميل المؤلف',
      description: 'حدث خطأ أثناء تحميل صفحة المؤلف.',
    };
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  try {
    const { documentId } = await params;

    const [author, articlesResponse] = await Promise.all([
      getAuthorById(documentId),
      getArticlesByAuthor(documentId)
    ]);

    if (!author) {
      notFound();
    }

    // Cast to any to avoid type issues with Strapi response
    const authorData = author as any;

    const articles = articlesResponse?.data || [];
    const avatarUrl = authorData.avatar ? getStrapiMedia(authorData.avatar.url) : null;    return (
      <div className="min-h-screen bg-gray-50">
        {/* Author Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 overflow-hidden bg-gray-100">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={authorData.avatar?.alternativeText || authorData.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{authorData.name}</h1>

                <div className="space-y-2 mb-6">
                  {authorData.jobTitle && (
                    <div className="flex items-center justify-center md:justify-start text-lg text-gray-600">
                      <Briefcase className="w-5 h-5 ml-2" />
                      <span>{authorData.jobTitle}</span>
                    </div>
                  )}

                  {authorData.organization && (
                    <div className="flex items-center justify-center md:justify-start text-gray-600">
                      <MapPin className="w-5 h-5 ml-2" />
                      <span>{authorData.organization}</span>
                    </div>
                  )}
                </div>

                {/* Author Bio */}
                {authorData.bio && (
                  <div className="mb-6 text-center md:text-right">
                    <p className="text-gray-700 leading-relaxed">{authorData.bio}</p>
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {authorData.linkedin_url && (
                    <a
                      href={authorData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                    >
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Articles Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">المقالات</h2>
            <p className="text-gray-600">جميع المقالات المنشورة بواسطة {authorData.name}</p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقالات منشورة</h3>
              <p className="text-gray-500">لم ينشر {authorData.name} أي مقالات بعد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading author:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل المؤلف</h2>
          <p className="text-gray-600">حدث خطأ أثناء تحميل صفحة المؤلف. يرجى المحاولة لاحقاً.</p>
        </div>
      </div>
    );
  }
}

// Article Card Component
function ArticleCard({ article }: { article: any }) {
  const coverImageUrl = article.cover_image ? getStrapiMedia(article.cover_image.url) : null;

  return (
    <article className="bg-white shadow-sm border border-gray-200 overflow-hidden">
      <Link href={`/articles/${article.slug}`}>
        {/* Cover Image */}
        {coverImageUrl && (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={coverImageUrl}
              alt={article.cover_image?.alternativeText || article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6">
          {/* Article Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>

          {/* Article Description */}
          {article.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.description}
            </p>
          )}

          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 ml-1" />
              <time>{formatDate(article.publish_date)}</time>
            </div>

            {article.is_featured && (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                مميز
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Save Button */}
      <div className="px-6 pb-4">
        <SaveButton
          articleId={article.id.toString()}
          className="w-full justify-center"
        />
      </div>
    </article>
  );
}
