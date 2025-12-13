'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface SearchAndFilterClientProps {
  categories: Category[];
  currentSearch?: string;
  currentCategory?: string;
}

export function SearchAndFilterClient({
  categories,
  currentSearch,
  currentCategory
}: SearchAndFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);

    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }

    params.delete('page'); // Reset to first page when changing category

    const queryString = params.toString();
    router.push(`/articles${queryString ? `?${queryString}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;

    const params = new URLSearchParams(searchParams);

    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }

    params.delete('page'); // Reset to first page when searching

    const queryString = params.toString();
    router.push(`/articles${queryString ? `?${queryString}` : ''}`);
  };

  const handleClearFilters = () => {
    router.push('/articles');
  };

  const hasActiveFilters = currentSearch || currentCategory;

  return (
    <div className="bg-white border border-gray-200 p-8 mb-12">
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gray-600"></div>
          <h3 className="text-xl font-bold text-gray-900">
            البحث والتصفية
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            مسح الفلاتر
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Input - Takes 2 columns */}
        <div className="md:col-span-2" dir="rtl">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
            البحث في المقالات
          </label>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="ابحث في العناوين والأوصاف..."
              defaultValue={currentSearch}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-600 text-right"
              dir="rtl"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-4 py-1 text-sm font-medium hover:bg-gray-800"
            >
              بحث
            </button>
          </form>
        </div>

        {/* Category Filter - Takes 1 column */}
        <div dir="rtl">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
            تصفية حسب الفئة
          </label>
          <select
            id="category"
            value={currentCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-600 text-right"
            dir="rtl"
          >
            <option value="">جميع الفئات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
