'use client';

import { useState, useEffect } from 'react';
import { X, Clock, User, Folder, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { searchContent, SearchResults } from '@/lib/strapi-client';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    articles: [],
    categories: [],
    authors: [],
    magazine_issues: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Disable body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Search functionality
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults({
        articles: [],
        categories: [],
        authors: [],
        magazine_issues: [],
      });
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchContent(term, undefined, 5); // Limit to 5 results per type
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({
        articles: [],
        categories: [],
        authors: [],
        magazine_issues: [],
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setSearchResults({
          articles: [],
          categories: [],
          authors: [],
          magazine_issues: [],
        });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Reset search when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults({
        articles: [],
        categories: [],
        authors: [],
        magazine_issues: [],
      });
    }
  }, [isOpen]);

  const handleSearchResultClick = (type: string, item: any) => {
    onClose();
    setSearchTerm('');
    
    switch (type) {
      case 'article':
        router.push(`/articles/${item.slug}`);
        break;
      case 'category':
        router.push(`/categories/${item.slug}`);
        break;
      case 'author':
        router.push(`/authors/${item.id}`);
        break;
      case 'magazine':
        router.push(`/magazine/${item.slug}`);
        break;
    }
  };

  const totalResults = searchResults.articles.length + 
                      searchResults.categories.length + 
                      searchResults.authors.length + 
                      searchResults.magazine_issues.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ابحث في المقالات، التصنيفات، المؤلفين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-lg bg-transparent border-b border-gray-600 text-white focus:outline-none focus:border-[#CBD1F9] placeholder-gray-500"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#CBD1F9]"></div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close search"
            className="hover:text-[#CBD1F9] hover:bg-white/40 ml-4"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="max-h-[70vh] overflow-y-auto">
            {totalResults === 0 && !isSearching ? (
              <div className="text-center text-gray-400 py-8">
                <p>لا توجد نتائج لـ "{searchTerm}"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Articles */}
                {searchResults.articles.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      المقالات ({searchResults.articles.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.articles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleSearchResultClick('article', article)}
                          className="p-3 bg-white/10 rounded-none cursor-pointer hover:bg-white/20 transition-colors"
                        >
                          <h4 className="text-white font-medium">{article.title}</h4>
                          {article.description && (
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                              {article.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {searchResults.categories.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      التصنيفات ({searchResults.categories.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.categories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => handleSearchResultClick('category', category)}
                          className="p-3 bg-white/10 rounded-none cursor-pointer hover:bg-white/20 transition-colors"
                        >
                          <h4 className="text-white font-medium">{category.name}</h4>
                          {category.description && (
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors */}
                {searchResults.authors.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      المؤلفين ({searchResults.authors.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.authors.map((author) => (
                        <div
                          key={author.id}
                          onClick={() => handleSearchResultClick('author', author)}
                          className="p-3 bg-white/10 rounded-none cursor-pointer hover:bg-white/20 transition-colors"
                        >
                          <h4 className="text-white font-medium">{author.name}</h4>
                          {author.jobTitle && (
                            <p className="text-gray-300 text-sm mt-1">
                              {author.jobTitle}
                              {author.organization && ` - ${author.organization}`}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Magazine Issues */}
                {searchResults.magazine_issues.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      أعداد المجلة ({searchResults.magazine_issues.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.magazine_issues.map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() => handleSearchResultClick('magazine', issue)}
                          className="p-3 bg-white/10 rounded-none cursor-pointer hover:bg-white/20 transition-colors"
                        >
                          <h4 className="text-white font-medium">{issue.title}</h4>
                          {issue.description && (
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                              {issue.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 