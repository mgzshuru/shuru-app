import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';

export function useMostReadArticles(limit: number = 4) {
  const [mostReadArticles, setMostReadArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMostReadArticles() {
      try {
        setLoading(true);
        const response = await fetch(`/api/most-read-articles?limit=${limit}`);

        if (!response.ok) {
          console.warn('Most read articles endpoint not available, using fallback');
          setMostReadArticles([]);
          setError(null);
          return;
        }

        const data = await response.json();

        console.log('Most read articles API response:', data);

        if (data.data && Array.isArray(data.data)) {
          console.log('Fetched most read articles:', data.data.length);
          setMostReadArticles(data.data);
        } else {
          console.log('No most read articles data');
          setMostReadArticles([]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching most read articles:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMostReadArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMostReadArticles();
  }, [limit]);

  return { mostReadArticles, loading, error };
}