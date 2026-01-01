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
      // Only pass data if block has actual configuration, otherwise component uses defaults
      const heroComplexData = block.featuredArticle || block.mostReadArticles?.length > 0
        ? {
            title: block.title,
            subtitle: block.subtitle,
            featuredArticle: block.featuredArticle,
            mostReadArticles: block.mostReadArticles || [],
            showMostRead: block.showMostRead ?? true,
            maxMostReadArticles: block.maxMostReadArticles || 4,
            useRandomFeaturedArticle: block.useRandomFeaturedArticle ?? false,
          }
        : undefined;
      return <HeroComplexSection key={uniqueKey} data={heroComplexData} articles={articles} />;
    }

    case 'home.article-grid-section': {
      // Only pass data if block has custom configuration
      const articleGridData = block.title || block.category || block.articles?.length > 0
        ? {
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
            showSidebar: false, // Always hide sidebar
          }
        : { showSidebar: false }; // Hide sidebar for default section too
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
  // Check if sections exist in blocks
  const hasHeroSection = blocks?.some(block => block.__component === 'home.hero-complex-section');
  const hasArticleGridSection = blocks?.some(block => block.__component === 'home.article-grid-section');

  // Safety check for blocks array
  if (!blocks || !Array.isArray(blocks)) {
    console.warn('No blocks provided or blocks is not an array:', blocks);
    return (
      <div className="w-full min-h-screen">
        {/* Always render hero section even when no blocks */}
        <HeroComplexSection articles={articles} />

        {/* Always render article grid section even when no blocks */}
        <ArticleGridSection articles={articles} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Always render hero section first if not already in blocks */}
      {!hasHeroSection && <HeroComplexSection articles={articles} />}

      {blocks.map((block) => renderHomePageBlock(block, articles, categories))}

      {/* Always render article grid section if not already in blocks */}
      {!hasArticleGridSection && <ArticleGridSection articles={articles} />}
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
