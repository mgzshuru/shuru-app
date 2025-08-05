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
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Bookmark className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                المقالات المحفوظة
              </h1>
              <p className="text-gray-600 text-lg">
                المقالات التي قمت بحفظها للقراءة لاحقاً
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/profile" className="hover:text-gray-700 font-medium">
              الملف الشخصي
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-gray-900 font-semibold">المقالات المحفوظة</span>
          </nav>
        </div>

        {/* Content */}
        {savedArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
              <Bookmark className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              لا توجد مقالات محفوظة
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              لم تقم بحفظ أي مقالات بعد. ابدأ بتصفح المقالات واحفظ المقالات المثيرة للاهتمام للقراءة لاحقاً.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 shadow-sm"
            >
              تصفح المقالات
              <ArrowRight className="h-5 w-5 rotate-180" />
            </Link>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <Bookmark className="h-4 w-4 text-orange-600" />
                <span className="text-gray-700 font-medium">
                  {savedArticles.length} مقال محفوظ
                </span>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-8">
              {savedArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="grid md:grid-cols-4 gap-6 p-8">
                    {/* Article Image */}
                    {article.cover_image && (
                      <div className="md:order-2">
                        <Link href={`/articles/${article.slug}`}>
                          <div className="relative aspect-[4/3] bg-gray-100 rounded-none overflow-hidden">
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
                          <div className="mb-4">
                            <Link
                              href={`/categories/${article.category.slug}`}
                              className="inline-block text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-full"
                            >
                              {article.category.name}
                            </Link>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="hover:text-gray-700"
                          >
                            {article.title}
                          </Link>
                        </h2>

                        {/* Description */}
                        {article.description && (
                          <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 text-lg">
                            {article.description}
                          </p>
                        )}
                      </div>

                      {/* Article Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Author */}
                          {article.author && (
                            <div className="flex items-center gap-3">
                              {article.author.avatar && (
                                <Image
                                  src={getStrapiMedia(article.author.avatar.url) || ''}
                                  alt={article.author.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full object-cover border-2 border-gray-100"
                                />
                              )}
                              <div className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">{article.author.name}</span>
                                {article.author.jobTitle && (
                                  <span className="text-gray-500 block">{article.author.jobTitle}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Publish Date */}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(article.publish_date)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <SaveButton
                            articleId={article.documentId}
                            articleTitle={article.title}
                            size="sm"
                          />
                          <Link
                            href={`/articles/${article.slug}`}
                            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                          >
                            قراءة المقال
                            <ArrowRight className="h-4 w-4 rotate-180" />
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
