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

const CategoriesGrid: React.FC = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        
        if (response && response.data) {
          const categoryGroups = transformCategoriesToGroups(response.data as Category[]);
          setCategories(categoryGroups);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform Strapi categories into grouped format
  const transformCategoriesToGroups = (strapiCategories: any[]): CategoryGroup[] => {
    // Get root categories (categories without parent)
    const rootCategories = strapiCategories.filter(cat => !cat.parent_category);
    
    return rootCategories.map(rootCategory => ({
      title: rootCategory.name,
      links: [
        // Add the root category itself as a link
        {
          id: rootCategory.id,
          text: `All ${rootCategory.name}`,
          href: `/categories/${rootCategory.slug}`,
          isExternal: false,
        },
        // Add child categories as links
        ...(rootCategory.children_categories?.map((child: any) => ({
          id: child.id,
          text: child.name,
          href: `/categories/${child.slug}`,
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
      <div className="footer-client max-w-screen-xl mx-auto px-5 lg:px-6">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-6 lg:gap-10">
          {/* Loading skeleton */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="lg:min-w-[160px]">
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
    );
  }

  if (error) {
    return (
      <div className="footer-client max-w-screen-xl mx-auto px-5 lg:px-6">
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="footer-client max-w-screen-xl mx-auto px-5 lg:px-6">
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No categories found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="footer-client max-w-screen-xl mx-auto px-5 lg:px-6">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-6 lg:gap-10">
        {categories.map((category) => (
          <div key={category.title} className="lg:min-w-[160px]">
            <h4 
              className="color-accessiblegray cursor-pointer border-b border-b-primary-light pb-3 font-centra text-[13px] font-bold uppercase leading-[13px] tracking-[1.5px] lg:cursor-default lg:border-b-0 lg:pb-4"
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
                  <li key={link.id}>
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
  );
};

export default CategoriesGrid;