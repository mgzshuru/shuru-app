import type { Category } from "../category/type"
import Link from "next/link"

interface CategoryHeaderProps {
  category: Category
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4 text-sm text-gray-500 border-b border-gray-100">
          <Link href="/" className="hover:text-black transition-colors">
            الرئيسية
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{category.name}</span>
        </nav>

        {/* Category Title Section */}
        <div className="py-8 md:py-12 text-center">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider text-black mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{category.description}</p>
          )}

          {/* Sub-categories as pills */}
          {category.children_categories && category.children_categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {category.children_categories.map((child) => (
                <Link
                  key={child.slug}
                  href={`/${child.slug}`}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wide"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
