import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';
import { getStrapiURL } from '@/lib/utils';

interface SelectedArticlesData {
  data: {
    id: number;
    documentId: string;
    title: string;
    description?: string;
    articles: Article[];
    maxArticles: number;
    showInHero: boolean;
    displayOrder: 'manual' | 'newest' | 'oldest' | 'mostRead';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export function useSelectedArticles() {
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [maxArticles, setMaxArticles] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSelectedArticles() {
      try {
        setLoading(true);
        const response = await fetch(`${getStrapiURL()}/api/selected-article`);

        if (!response.ok) {
          // If the endpoint is not configured or returns error, use empty array
          console.warn('Selected articles endpoint not available, using fallback');
          setSelectedArticles([]);
          setError(null);
          return;
        }

        const data: SelectedArticlesData = await response.json();

        if (data.data?.articles && data.data.showInHero) {
          console.log('Fetched selected articles:', data.data.articles);
          console.log('Max articles setting:', data.data.maxArticles);
          setSelectedArticles(data.data.articles);
          setMaxArticles(data.data.maxArticles || 3);
        } else {
          console.log('No selected articles or showInHero is false');
          setSelectedArticles([]);
          setMaxArticles(3);
        }

        setError(null);
      } catch (err) {
        console.warn('Failed to fetch selected articles:', err);
        setSelectedArticles([]);
        setError(null); // Don't show error to user, just use fallback
      } finally {
        setLoading(false);
      }
    }

    fetchSelectedArticles();
  }, []);

  return { selectedArticles, maxArticles, loading, error };
}
