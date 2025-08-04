'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllCategories } from '@/lib/strapi-client';

// Import types
import { Category } from '@/lib/types';

interface CategoryGroup {
  title: string;
  links: Array<{
    id: number;
    text: string;
    href: string;
    isExternal?: boolean;
  }>;
}

interface StrapiLinkProps {
  href: string;
  isExternal?: boolean;
  className?: string;
  children: React.ReactNode;
}

// StrapiLink component for handling internal/external links
const StrapiLink: React.FC<StrapiLinkProps> = ({
  href,
  isExternal = false,
  className = '',
  children
}) => {
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

interface CategoriesGridProps {
  categoriesData?: any[];
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categoriesData }) => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCategories = async () => {
      try {
        setLoading(true);

        // Use passed data if available, otherwise fetch
        let data = categoriesData;
        if (!data) {
          const response = await getAllCategories();
          data = response?.data;
        }

        if (data && Array.isArray(data)) {
          const categoryGroups = transformCategoriesToGroups(data as Category[]);
          setCategories(categoryGroups);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    processCategories();
  }, [categoriesData]);

  // Transform Strapi categories into grouped format
  const transformCategoriesToGroups = (strapiCategories: any[]): CategoryGroup[] => {
    // Get root categories (categories without parent)
    const rootCategories = strapiCategories.filter(cat => !cat.parent_category);

    // Filter out categories with null/undefined order and sort by order
    const orderedCategories = rootCategories
      .filter(cat => cat.order !== null && cat.order !== undefined)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return orderedCategories.map(rootCategory => ({
      title: rootCategory.name,
      links: [
        // Add child categories as links
        ...(rootCategory.children_categories?.map((child: any) => ({
          id: child.id,
          text: child.name,
          href: `/c/${child.slug}`,
          isExternal: false,
        })) || [])
      ]
    }));
  };

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategory(
      expandedCategory === categoryTitle ? null : categoryTitle
    );
  };

  if (loading) {
    return (
      <div className="footer-client w-full flex justify-center py-8">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-6 w-full">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-6 lg:gap-10 justify-items-center">
            {/* Loading skeleton */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="w-full max-w-[200px]">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, linkIndex) => (
                    <div key={linkIndex} className="h-3 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="footer-client w-full flex justify-center py-8">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-6 w-full">
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">Error loading categories: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    // Don't render anything if there are no ordered categories
    return null;
  }

  return (
    <div className="footer-client w-full flex justify-center py-8">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-6 w-full">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-6 lg:gap-10 justify-items-center">
          {categories.map((category) => (
            <div key={category.title} className="w-full max-w-[200px] text-center lg:text-left">
              <h4
                className="color-accessiblegray cursor-pointer border-b border-b-primary-light pb-3 font-centra text-[13px] font-bold uppercase leading-[13px] tracking-[1.5px] lg:cursor-default lg:border-b-0 lg:pb-4 text-center lg:text-left"
                onClick={() => toggleCategory(category.title)}
              >
                {category.title}
                <span className="inline-block pl-1 lg:hidden">
                  {expandedCategory === category.title ? '↑' : '↓'}
                </span>
              </h4>
              <div className={`${
                expandedCategory === category.title ? 'block' : 'hidden'
              } pt-4 lg:block`}>
                <ul className="space-y-3 lg:space-y-4">
                  {category.links?.map((link) => (
                    <li key={link.id} className="text-center lg:text-left">
                      <StrapiLink
                        href={link.href}
                        isExternal={link.isExternal}
                        className="block"
                      >
                        <span className="font-centra text-[12px] font-normal leading-[14px] hover:text-primary-dark transition-colors duration-200">
                          {link.text}
                        </span>
                      </StrapiLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;