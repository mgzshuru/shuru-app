'use client';

import { cn } from '@/lib/utils';
import { marked } from 'marked';
import { useMemo } from 'react';

interface RichTextProps {
  content: string;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  // Configure marked options for better rendering
  const htmlContent = useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    // Check if content is already HTML or if it's Markdown
    const isMarkdown = content.includes('#') || content.includes('**') || content.includes('- ');
    
    if (isMarkdown) {
      return marked(content);
    }
    
    // If it's already HTML, return as is
    return content;
  }, [content]);

  return (
    <div
      className={cn(
        'prose prose-lg max-w-none',
        // Headings
        'prose-headings:font-bold prose-headings:text-gray-900',
        'prose-h1:text-4xl prose-h1:mb-6 prose-h1:leading-tight',
        'prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12',
        'prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8',
        'prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6',
        // Paragraphs
        'prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6',
        // Links
        'prose-a:text-black prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2',
        'hover:prose-a:decoration-gray-400 prose-a:transition-colors',
        // Lists
        'prose-ul:mb-6 prose-ol:mb-6',
        'prose-li:text-gray-700 prose-li:mb-2',
        // Blockquotes
        'prose-blockquote:border-l-4 prose-blockquote:border-gray-200',
        'prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6',
        'prose-blockquote:italic prose-blockquote:text-gray-700',
        // Code
        'prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded',
        'prose-code:text-sm prose-code:font-mono prose-code:text-gray-800',
        'prose-code:before:content-none prose-code:after:content-none',
        // Pre
        'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4',
        'prose-pre:overflow-x-auto prose-pre:rounded-none',
        // Tables
        'prose-table:border-collapse prose-table:w-full',
        'prose-thead:border-b prose-thead:border-gray-300',
        'prose-th:text-left prose-th:font-semibold prose-th:p-3',
        'prose-td:p-3 prose-td:border-b prose-td:border-gray-200',
        // Strong and emphasis
        'prose-strong:font-bold prose-strong:text-gray-900',
        'prose-em:italic',
        // Images
        'prose-img:rounded-none prose-img:shadow-lg',
        // HR (horizontal rules)
        'prose-hr:border-gray-200 prose-hr:my-8',
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}