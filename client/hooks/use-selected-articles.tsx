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
    useRandomArticles: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export function useSelectedArticles() {
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [maxArticles, setMaxArticles] = useState<number>(3);
  const [useRandom, setUseRandom] = useState<boolean>(false);
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

        if (data.data?.showInHero) {
          console.log('Fetched selected articles config:', {
            articlesCount: data.data.articles?.length || 0,
            maxArticles: data.data.maxArticles,
            useRandom: data.data.useRandomArticles
          });
          setSelectedArticles(data.data.articles || []);
          setMaxArticles(data.data.maxArticles || 3);
          setUseRandom(data.data.useRandomArticles || false);
        } else {
          console.log('showInHero is false');
          setSelectedArticles([]);
          setMaxArticles(3);
          setUseRandom(false);
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

  return { selectedArticles, maxArticles, useRandom, loading, error };
}
