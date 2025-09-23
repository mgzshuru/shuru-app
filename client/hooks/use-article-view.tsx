import { useEffect } from 'react';
import { getStrapiURL } from '@/lib/utils';

export function useArticleView(articleId: string | undefined, slug: string | undefined) {
  useEffect(() => {
    if (!articleId && !slug) return;

    // Use documentId if available, otherwise fallback to slug-based lookup
    const trackView = async () => {
      try {
        if (articleId) {
          // Direct increment using documentId
          await fetch(`${getStrapiURL()}/api/articles/${articleId}/increment-views`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } else if (slug) {
          // Find article by slug first, then increment
          const findResponse = await fetch(
            `${getStrapiURL()}/api/articles?filters[slug][$eq]=${slug}&fields[0]=documentId`
          );

          if (findResponse.ok) {
            const data = await findResponse.json();
            if (data.data && data.data[0]) {
              await fetch(`${getStrapiURL()}/api/articles/${data.data[0].documentId}/increment-views`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            }
          }
        }
      } catch (error) {
        // Fail silently to not disrupt user experience
        console.warn('Failed to track article view:', error);
      }
    };

    // Track view after a short delay to ensure the page has loaded
    const timeoutId = setTimeout(trackView, 2000);

    return () => clearTimeout(timeoutId);
  }, [articleId, slug]);
}