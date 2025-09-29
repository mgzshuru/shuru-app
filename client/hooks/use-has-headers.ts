'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if an article has headers (h1-h6) for table of contents
 * @param contentId - The ID of the article content container
 * @returns boolean indicating if headers are found
 */
export function useHasHeaders(contentId: string = 'article-content'): boolean {
  const [hasHeaders, setHasHeaders] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);

  useEffect(() => {
    const checkForHeaders = () => {
      const articleElement = document.getElementById(contentId);
      if (!articleElement) {
        setHasHeaders(false);
        setHasScanned(true);
        return;
      }

      const headings = articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      setHasHeaders(headings.length > 0);
      setHasScanned(true);
    };

    // Check immediately if DOM is ready
    if (document.readyState === 'complete') {
      checkForHeaders();
    } else {
      // Wait for DOM to be ready
      const handleLoad = () => {
        checkForHeaders();
      };

      window.addEventListener('load', handleLoad);

      // Also check after a short delay in case content is dynamically loaded
      const timeoutId = setTimeout(checkForHeaders, 100);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeoutId);
      };
    }
  }, [contentId]);

  // Return false until we've scanned to prevent layout shift
  return hasScanned ? hasHeaders : false;
}