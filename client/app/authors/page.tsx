import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllAuthors } from '@/lib/strapi-client';
import { getGlobalCached } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { Author } from '@/lib/types';
import { User, MapPin, Briefcase } from 'lucide-react';

// Generate metadata for authors page
export async function generateMetadata(): Promise<Metadata> {
  try {
    const globalData = await getGlobalCached().catch(() => null);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
    const authorsUrl = `${baseUrl}/authors`;

    const title = 'المؤلفون | شروع';
    const description = 'تعرف على فريق الكتاب والمؤلفين في شروع';

    const defaultImage = globalData?.defaultSeo?.og_image ?
      getStrapiMedia(globalData.defaultSeo.og_image.url) : null;

    return {
      title,
      description,
      keywords: 'مؤلفون، كتاب، شروع، فريق التحرير، خبراء',
      openGraph: {
        title,
        description,
        url: authorsUrl,
        siteName: globalData?.siteName || 'شروع',
        locale: 'ar_SA',
        type: 'website',
        ...(defaultImage && {
          images: [{
            url: defaultImage,
            width: globalData?.defaultSeo?.og_image?.width || 1200,
            height: globalData?.defaultSeo?.og_image?.height || 630,
            alt: globalData?.defaultSeo?.og_image?.alternativeText || title,
          }]
        }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(defaultImage && { images: [defaultImage] }),
      },
      alternates: {
        canonical: authorsUrl,
      },
    };
  } catch (error) {
    console.error('Error generating authors metadata:', error);
    return {
      title: 'المؤلفون | شروع',
      description: 'تعرف على فريق الكتاب والمؤلفين في شروع',
    };
  }
}

export default async function AuthorsPage() {
  try {
    const authorsResponse = await getAllAuthors();
    const authors = authorsResponse?.data || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">المؤلفون</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                تعرف على فريق الكتاب والخبراء الذين يقدمون محتوى شروع
              </p>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {authors.length === 0 ? (
            <div className="text-center py-16">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد مؤلفون</h3>
              <p className="mt-1 text-sm text-gray-500">لم يتم العثور على أي مؤلفين في الوقت الحالي.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {authors.map((author: any) => (
                <AuthorCard key={author.documentId} author={author} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading authors:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل المؤلفين</h2>
          <p className="text-gray-600">حدث خطأ أثناء تحميل قائمة المؤلفين. يرجى المحاولة لاحقاً.</p>
        </div>
      </div>
    );
  }
}

// Author Card Component
function AuthorCard({ author }: { author: Author }) {
  const avatarUrl = author.avatar ? getStrapiMedia(author.avatar.url) : null;

  return (
    <Link
      href={`/authors/${author.documentId}`}
      className="bg-white shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 overflow-hidden bg-gray-100">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={author.avatar?.alternativeText || author.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Author Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{author.name}</h3>

          {author.jobTitle && (
            <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
              <Briefcase className="w-4 h-4 ml-1" />
              <span>{author.jobTitle}</span>
            </div>
          )}

          {author.organization && (
            <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4 ml-1" />
              <span>{author.organization}</span>
            </div>
          )}


        </div>
      </div>
    </Link>
  );
}
