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
          const response = await fetch(`${getStrapiURL()}/api/articles/${articleId}/increment-views`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.warn('Failed to increment views for article:', {
              articleId,
              status: response.status,
              error: errorText
            });
          } else {
            // View tracked successfully - no need to log in production
            if (process.env.NODE_ENV === 'development') {
              const result = await response.json();
              console.log('Article view tracked successfully:', result);
            }
          }
        } else if (slug) {
          // Find article by slug first, then increment
          const findResponse = await fetch(
            `${getStrapiURL()}/api/articles?filters[slug][$eq]=${slug}&fields[0]=documentId`
          );

          if (findResponse.ok) {
            const data = await findResponse.json();
            if (data.data && data.data[0]) {
              const incrementResponse = await fetch(`${getStrapiURL()}/api/articles/${data.data[0].documentId}/increment-views`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (!incrementResponse.ok) {
                const errorText = await incrementResponse.text();
                console.warn('Failed to increment views for article by slug:', {
                  slug,
                  documentId: data.data[0].documentId,
                  status: incrementResponse.status,
                  error: errorText
                });
              } else {
                // View tracked successfully - no need to log in production
                if (process.env.NODE_ENV === 'development') {
                  const result = await incrementResponse.json();
                  console.log('Article view tracked successfully by slug:', result);
                }
              }
            } else {
              console.warn('Article not found for slug:', slug);
            }
          } else {
            console.warn('Failed to find article by slug:', slug);
          }
        }
      } catch (error) {
        // Fail silently to not disrupt user experience but log for debugging
        console.warn('Failed to track article view:', {
          articleId,
          slug,
          error: error instanceof Error ? error.message : error
        });
      }
    };

    // Track view after a short delay to ensure the page has loaded
    const timeoutId = setTimeout(trackView, 2000);

    return () => clearTimeout(timeoutId);
  }, [articleId, slug]);
}