'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  articleContentId?: string;
}

export function TableOfContents({ articleContentId = 'article-content' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const tocNavRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const articleElement = document.getElementById(articleContentId);
    if (!articleElement) return;

    // Find all headings in the article content
    const headings = articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const tagName = heading.tagName.toLowerCase();
      const level = parseInt(tagName.replace('h', ''));
      const text = heading.textContent || '';

      // Create or use existing ID
      let id = heading.id;
      if (!id) {
        // Generate ID from text content (RTL-friendly)
        id = `heading-${index}-${text
          .toLowerCase()
          .replace(/[^\w\s\u0600-\u06FF-]/g, '') // Keep Arabic characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .trim()}`;
        heading.id = id;
      }

      items.push({ id, text, level });
    });

    setTocItems(items);

    // Set up intersection observer for active heading detection
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleHeadings.length > 0) {
          const newActiveId = visibleHeadings[0].target.id;
          setActiveId(newActiveId);

          // Auto-scroll table of contents to show active item
          if (tocNavRef.current) {
            const activeButton = tocNavRef.current.querySelector(`[data-heading-id="${newActiveId}"]`);
            if (activeButton) {
              activeButton.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
              });
            }
          }
        }
      },
      {
        rootMargin: '-10% 0% -60% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [articleContentId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });

      // Update active state immediately for better UX
      setActiveId(id);
    }
  };

  if (tocItems.length === 0) {
    return (
      <div className="bg-gray-50 p-4 md:p-6 border border-gray-200">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 text-right" dir="rtl">في هذا المقال</h3>
        <p className="text-gray-500 text-xs md:text-sm text-right" dir="rtl">
          جاري تحميل المحتويات...
        </p>
      </div>
    );
  }

  // Mobile version with always expanded design (no collapse)
  if (isMobile) {
    return (
      <div className="bg-white border border-gray-200 mb-6 shadow-sm">
        <div className="p-4 bg-gray-50" dir="rtl">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <h3 className="text-base font-semibold text-gray-900">في هذا المقال</h3>
          </div>
        </div>

        <nav className="p-4 space-y-1 max-h-80 overflow-y-auto scrollbar-none" dir="rtl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            const paddingRight = Math.max(0, (item.level - 1) * 12);

            return (
              <button
                key={item.id}
                data-heading-id={item.id}
                onClick={() => {
                  scrollToHeading(item.id);
                  // Note: Removed setIsExpanded(false) to keep it always open
                }}
                className={`
                  block w-full text-right py-2 px-2 text-sm transition-all duration-300 border-r-2 hover:bg-gray-50 hover:border-gray-400
                  ${isActive
                    ? 'text-gray-900 border-gray-700 bg-gray-100 font-semibold'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                  }
                `}
                style={{ paddingRight: `${paddingRight + 8}px` }}
                title={item.text}
              >
                <span className="block leading-tight text-right break-words">
                  {item.text}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Reading Progress */}
        <div className="p-4 pt-0 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 justify-end" dir="rtl">
            <span>تقدم القراءة</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="w-full bg-gray-200 h-1.5" dir="rtl">
            <div
              className="bg-gray-600 h-1.5 transition-all duration-500 ease-out ml-auto"
              style={{
                width: `${Math.min(100, Math.max(0, (tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length * 100))}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version (original design)
  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 text-right" dir="rtl">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        في هذا المقال
      </h3>
      <nav
        ref={tocNavRef}
        className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        dir="rtl"
      >
        {tocItems.map((item) => {
          const isActive = activeId === item.id;
          const paddingRight = Math.max(0, (item.level - 1) * 16);

          return (
            <button
              key={item.id}
              data-heading-id={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`
                block w-full text-right py-3 px-3 text-sm transition-all duration-300 border-r-3 hover:bg-gray-50 hover:border-gray-400
                ${isActive
                  ? 'text-gray-900 border-gray-700 bg-gray-100 font-semibold shadow-sm'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
                }
              `}
              style={{ paddingRight: `${paddingRight + 12}px` }}
              title={item.text}
            >
              <span className="block leading-tight text-right break-words">
                {item.text}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Reading Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 justify-end" dir="rtl">
          <span>تقدم القراءة</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="w-full bg-gray-200 h-2" dir="rtl">
          <div
            className="bg-gray-600 h-2 transition-all duration-500 ease-out ml-auto"
            style={{
              width: `${Math.min(100, Math.max(0, (tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length * 100))}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1" dir="rtl">
          <span>البداية</span>
          <span>النهاية</span>
        </div>
      </div>
    </div>
  );
}
