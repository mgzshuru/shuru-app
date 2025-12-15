import React from 'react';
import { HeroComplexSection } from '@/components/blocks/home/hero-complex-section';
import { ArticleGridSection } from '@/components/blocks/home/article-grid-section';
import { FeaturedCategoriesSection } from '@/components/blocks/home/featured-categories-section';
import { getStrapiURL } from '@/lib/utils';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { Article, Category } from '@/lib/types';

export interface HomePageBlock {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface HomePageData {
  id: number;
  blocks: HomePageBlock[];
  seo: any;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const renderHomePageBlock = (block: HomePageBlock, articles: Article[] = [], categories: Category[] = []) => {
  // Generate a unique key for each block
  const uniqueKey = `${block.__component}-${block.id}`;

  switch (block.__component) {
    case 'home.hero-complex-section': {
      console.log('home-blocks.tsx - block data:', {
        useRandomFeaturedArticle: block.useRandomFeaturedArticle,
        hasField: 'useRandomFeaturedArticle' in block,
        allKeys: Object.keys(block)
      });
      const heroComplexData = {
        title: block.title,
        subtitle: block.subtitle,
        featuredArticle: block.featuredArticle,
        mostReadArticles: block.mostReadArticles || [],
        showMostRead: block.showMostRead ?? true,
        maxMostReadArticles: block.maxMostReadArticles || 4,
        useRandomFeaturedArticle: block.useRandomFeaturedArticle ?? false,
      };
      return <HeroComplexSection key={uniqueKey} data={heroComplexData} articles={articles} />;
    }

    case 'home.article-grid-section': {
      const articleGridData = {
        title: block.title,
        subtitle: block.subtitle,
        showTitle: block.showTitle ?? true,
        articles: block.articles || [],
        maxArticles: block.maxArticles || 6,
        gridColumns: block.gridColumns || '3',
        category: block.category,
        showCategory: block.showCategory ?? true,
        showExcerpt: block.showExcerpt ?? true,
        showDate: block.showDate ?? true,
        showAuthor: block.showAuthor ?? false,
        backgroundColor: block.backgroundColor || 'white',
        sectionSpacing: block.sectionSpacing || 'medium',
        sidebarContent: block.sidebarContent || [],
        showSidebar: block.showSidebar ?? true,
      };
      return <ArticleGridSection key={uniqueKey} data={articleGridData} articles={articles} />;
    }

    case 'home.featured-categories-section': {
      const featuredCategoriesData = {
        title: block.title,
        subtitle: block.subtitle,
        showTitle: block.showTitle ?? true,
        categories: block.categories || categories,
        maxCategories: block.maxCategories || 6,
        articlesPerCategory: block.articlesPerCategory || 3,
        layout: block.layout || 'grid',
        showCategoryDescription: block.showCategoryDescription ?? false,
        showArticleCount: block.showArticleCount ?? true,
        backgroundStyle: block.backgroundStyle || 'white',
      };
      return <FeaturedCategoriesSection key={uniqueKey} data={featuredCategoriesData} />;
    }

    // All other sections are removed - only hero-complex-section, article-grid-section and featured-categories-section are rendered
    default:
      return null;
  }
};

interface HomePageBlocksRendererProps {
  blocks?: HomePageBlock[];
  articles?: Article[];
  categories?: Category[];
}

export const HomePageBlocksRenderer: React.FC<HomePageBlocksRendererProps> = ({
  blocks,
  articles = [],
  categories = []
}) => {
  // Safety check for blocks array
  if (!blocks || !Array.isArray(blocks)) {
    console.warn('No blocks provided or blocks is not an array:', blocks);
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا يوجد محتوى متاح</h3>
              <p className="text-gray-500">يرجى إضافة المحتوى من لوحة الإدارة</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {blocks.map((block) => renderHomePageBlock(block, articles, categories))}
    </div>
  );
};

// Fetch home page data from Strapi - server handles proper population
export async function fetchHomePageData(): Promise<HomePageData | null> {
  try {
    const baseUrl = getStrapiURL();
    const path = '/api/home-page';

    console.log('Fetching home page data from:', `${baseUrl}${path}`);

    const response = await fetch(`${baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch home page data: ${response.status}`);
    }

    const result = await response.json();
    console.log('Home page data response:', result);

    if (!result.data) {
      console.warn('No home page data found');
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching home page data:', error);
    throw error;
  }
}
