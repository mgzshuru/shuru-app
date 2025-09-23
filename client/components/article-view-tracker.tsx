"use client";

import { useArticleView } from '@/hooks/use-article-view';

interface ArticleViewTrackerProps {
  articleDocumentId?: string;
  articleSlug?: string;
}

export function ArticleViewTracker({ articleDocumentId, articleSlug }: ArticleViewTrackerProps) {
  useArticleView(articleDocumentId, articleSlug);
  return null; // This component doesn't render anything
}