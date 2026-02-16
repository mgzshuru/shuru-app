'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if an article has headers (h1-h6) for table of contents.
 * Uses a MutationObserver to handle dynamically-rendered content (e.g. dangerouslySetInnerHTML).
 * Once headers are found the observer disconnects automatically.
 *
 * @param contentId - The ID of the article content container
 * @returns boolean — true once at least one heading is detected, false otherwise
 */
export function useHasHeaders(contentId: string = 'article-content'): boolean {
  const [hasHeaders, setHasHeaders] = useState(false);

  useEffect(() => {
    let observer: MutationObserver | null = null;

    const check = () => {
      const el = document.getElementById(contentId);
      if (!el) return false;
      const found = el.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
      if (found) {
        setHasHeaders(true);
        observer?.disconnect();
        observer = null;
      }
      return found;
    };

    // Try immediately — if content already rendered we're done
    if (check()) return;

    // Otherwise watch the DOM until the container appears and headings arrive
    const target = document.getElementById(contentId) ?? document.body;
    observer = new MutationObserver(() => {
      check();
    });
    observer.observe(target, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
    };
  }, [contentId]);

  return hasHeaders;
}