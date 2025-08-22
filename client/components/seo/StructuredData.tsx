import React from 'react';
import { Article, Page, MagazineIssue, Category } from '@/lib/types';
import { getStrapiMedia } from '@/components/custom/strapi-image';

interface ArticleStructuredDataProps {
  article: Article;
  globalData?: any;
}

interface PageStructuredDataProps {
  page: Page & { description?: string; featured_image?: { url: string; alternativeText?: string; width?: number; height?: number } };
  globalData?: any;
}

interface MagazineStructuredDataProps {
  issue: MagazineIssue;
  globalData?: any;
}

interface CategoryStructuredDataProps {
  category: Category;
  globalData?: any;
}

export function ArticleStructuredData({ article, globalData }: ArticleStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description || "مقال في مجلة شروع للابتكار وريادة الأعمال",
    "url": articleUrl,
    "datePublished": article.publish_date,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.author?.name || globalData?.siteName || "شروع",
      ...(article.author?.linkedin_url && { "url": article.author.linkedin_url }),
      ...(article.author?.jobTitle && { "jobTitle": article.author.jobTitle }),
      ...(article.author?.organization && { "worksFor": { "@type": "Organization", "name": article.author.organization } })
    },
    "publisher": {
      "@type": "Organization",
      "name": globalData?.siteName || "شروع للنشر الرقمي",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "inLanguage": "ar-SA",
    "articleSection": article.categories?.[0]?.name || "أعمال",
    ...(article.cover_image && {
      "image": {
        "@type": "ImageObject",
        "url": getStrapiMedia(article.cover_image.url) || `${baseUrl}/og-image.jpg`,
        "width": article.cover_image.width || 1200,
        "height": article.cover_image.height || 630,
        "caption": article.cover_image.alternativeText || article.title
      }
    }),
    ...(article.SEO?.meta_keywords && {
      "keywords": article.SEO.meta_keywords.split(',').map(k => k.trim()).join(', ')
    })
  };

  // Add breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "المقالات",
        "item": `${baseUrl}/articles`
      },
      ...(article.categories?.[0] ? [{
        "@type": "ListItem",
        "position": 3,
        "name": article.categories[0].name,
        "item": `${baseUrl}/categories/${article.categories[0].slug}`
      }] : []),
      {
        "@type": "ListItem",
        "position": article.categories?.[0] ? 4 : 3,
        "name": article.title,
        "item": articleUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

export function PageStructuredData({ page, globalData }: PageStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
  const pageUrl = `${baseUrl}/p/${page.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title,
    "description": page.description || "صفحة في موقع شروع للابتكار وريادة الأعمال",
    "url": pageUrl,
    "dateModified": page.updatedAt,
    "publisher": {
      "@type": "Organization",
      "name": globalData?.siteName || "شروع",
      "url": baseUrl
    },
    "inLanguage": "ar-SA",
    "mainEntity": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": page.title,
        "item": pageUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

export function MagazineStructuredData({ issue, globalData }: MagazineStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
  const issueUrl = `${baseUrl}/magazine/${issue.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    "name": issue.title,
    "description": issue.description || `العدد ${issue.issue_number} من مجلة شروع`,
    "url": issueUrl,
    "datePublished": issue.publish_date,
    "issueNumber": issue.issue_number.toString(),
    "isPartOf": {
      "@type": "Periodical",
      "name": "مجلة شروع",
      "description": "مجلة متخصصة في الابتكار وريادة الأعمال والقيادة",
      "publisher": {
        "@type": "Organization",
        "name": globalData?.siteName || "شروع للنشر الرقمي",
        "url": baseUrl
      }
    },
    "inLanguage": "ar-SA",
    ...(issue.cover_image && {
      "image": {
        "@type": "ImageObject",
        "url": getStrapiMedia(issue.cover_image.url) || `${baseUrl}/og-image.jpg`,
        "width": issue.cover_image.width || 800,
        "height": issue.cover_image.height || 1000,
        "caption": issue.cover_image.alternativeText || issue.title
      }
    })
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "المجلة",
        "item": `${baseUrl}/magazine`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": issue.title,
        "item": issueUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}

export function CategoryStructuredData({ category, globalData }: CategoryStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
  const categoryUrl = `${baseUrl}/categories/${category.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description || `مقالات فئة ${category.name} في مجلة شروع`,
    "url": categoryUrl,
    "publisher": {
      "@type": "Organization",
      "name": globalData?.siteName || "شروع",
      "url": baseUrl
    },
    "inLanguage": "ar-SA",
    "mainEntity": {
      "@type": "ItemList",
      "name": `مقالات ${category.name}`,
      "description": `جميع المقالات في فئة ${category.name}`
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الفئات",
        "item": `${baseUrl}/categories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": categoryUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}
