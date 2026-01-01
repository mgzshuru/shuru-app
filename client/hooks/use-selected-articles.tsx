import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';

export function useSelectedArticles() {
  // Return configuration for random article selection
  // The actual random selection will be done in the component using the articles prop
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate brief loading for skeleton feedback
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    selectedArticles: [], // Empty array - will use random selection from all articles
    maxArticles: 5, // Default number of articles to show
    useRandom: true, // Always use random selection
    loading,
    error: null
  };
}
