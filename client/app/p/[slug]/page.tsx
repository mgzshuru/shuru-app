import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ContentRenderer } from '@/components/blocks/content/ContentRenderer';
import { getPageBySlug, getAllPages } from '@/lib/strapi-client';
import { Block, Page } from '@/lib/types';

// Use the Page type from types.ts with additional fields
interface PageData extends Omit<Page, 'blocks'> {
  description?: string;
  featured_image?: {
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  };
  blocks?: Block[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch page data from Strapi using the service
async function getPageData(slug: string): Promise<PageData | null> {
  try {
    const page = await getPageBySlug(slug);
    if (!page) return null;

    // Map the Strapi response to PageData
    return {
      id: page.id,
      documentId: page.documentId,
      title: page.title,
      slug: page.slug,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      publishedAt: page.publishedAt,
      description: page.description,
      featured_image: page.featured_image
        ? {
            url: page.featured_image.url,
            alternativeText: page.featured_image.alternativeText,
            width: page.featured_image.width,
            height: page.featured_image.height,
          }
        : undefined,
      blocks: page.blocks || [], // Changed from 'content' to 'blocks'
      SEO: page.SEO, // Changed from 'seo' to 'SEO'
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const metaTitle = page.SEO?.meta_title || page.title; // Updated field names
  const metaDescription = page.SEO?.meta_description || page.description;
  const ogImage = page.SEO?.og_image?.url || page.featured_image?.url;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const pages = await getAllPages();

    return pages.data.map((page: any) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PageComponent({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {page.title}
            </h1>

            {page.description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {page.description}
              </p>
            )}
                        {/* Metadata */}
            <div className="mt-8 flex items-center justify-center text-sm text-gray-500 space-x-4">
              <time dateTime={page.publishedAt}>
                {page.publishedAt && new Date(page.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {page.updatedAt !== page.publishedAt && (
                <>
                  <span>•</span>
                  <span>
                    Updated {new Date(page.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {page.featured_image && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <img
              src={page.featured_image.url}
              alt={page.featured_image.alternativeText || page.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        {page.blocks && page.blocks.length > 0 ? (
          <ContentRenderer blocks={page.blocks} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No content available for this page.</p>
          </div>
        )}
      </main>
    </div>
  );
}