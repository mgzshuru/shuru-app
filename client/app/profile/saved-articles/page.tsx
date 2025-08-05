import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { verifySession } from '@/lib/dal';
import { redirect } from 'next/navigation';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { SaveButton } from '@/components/custom/save-button';
import { formatDate } from '@/lib/utils';
import { getStrapiURL } from '@/lib/utils';
import { Bookmark, ArrowRight, Clock, User } from 'lucide-react';

interface SavedArticle {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  publish_date: string;
  cover_image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
    jobTitle?: string;
    avatar?: {
      url: string;
      alternativeText?: string;
    };
  };
}

async function getSavedArticles(jwt: string): Promise<SavedArticle[]> {
  try {
    const strapiUrl = getStrapiURL();
    const response = await fetch(`${strapiUrl}/api/saved-articles/user`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch saved articles:', response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return [];
  }
}

export default async function SavedArticlesPage() {
  // Verify user is authenticated
  const { isAuth, session } = await verifySession();

  if (!isAuth || !session?.jwt) {
    redirect('/auth/login');
  }

  const savedArticles = await getSavedArticles(session.jwt as string);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bookmark className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                المقالات المحفوظة
              </h1>
              <p className="text-gray-600 mt-1">
                المقالات التي قمت بحفظها للقراءة لاحقاً
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/profile" className="hover:text-gray-700 transition-colors">
              الملف الشخصي
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-gray-900 font-medium">المقالات المحفوظة</span>
          </nav>
        </div>

        {/* Content */}
        {savedArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              لا توجد مقالات محفوظة
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              لم تقم بحفظ أي مقالات بعد. ابدأ بتصفح المقالات واحفظ المقالات المثيرة للاهتمام للقراءة لاحقاً.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              تصفح المقالات
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                {savedArticles.length} مقال محفوظ
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 md:gap-8">
              {savedArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="grid md:grid-cols-4 gap-6 p-6">
                    {/* Article Image */}
                    {article.cover_image && (
                      <div className="md:order-2">
                        <Link href={`/articles/${article.slug}`}>
                          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                            <Image
                              src={getStrapiMedia(article.cover_image.url) || ''}
                              alt={article.cover_image.alternativeText || article.title}
                              width={article.cover_image.width || 400}
                              height={article.cover_image.height || 300}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className={`md:order-1 ${article.cover_image ? 'md:col-span-3' : 'md:col-span-4'} flex flex-col justify-between`}>
                      <div>
                        {/* Category */}
                        {article.category && (
                          <div className="mb-3">
                            <Link
                              href={`/categories/${article.category.slug}`}
                              className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded"
                            >
                              {article.category.name}
                            </Link>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="hover:text-gray-700 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h2>

                        {/* Description */}
                        {article.description && (
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                            {article.description}
                          </p>
                        )}
                      </div>

                      {/* Article Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          {/* Author */}
                          {article.author && (
                            <div className="flex items-center gap-2">
                              {article.author.avatar && (
                                <Image
                                  src={getStrapiMedia(article.author.avatar.url) || ''}
                                  alt={article.author.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full object-cover"
                                />
                              )}
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">{article.author.name}</span>
                                {article.author.jobTitle && (
                                  <span className="text-gray-500"> • {article.author.jobTitle}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Publish Date */}
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(article.publish_date)}</span>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-2">
                          <SaveButton
                            articleId={article.documentId}
                            articleTitle={article.title}
                            size="sm"
                          />
                          <Link
                            href={`/articles/${article.slug}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            قراءة المقال
                            <ArrowRight className="h-3 w-3 rotate-180" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
