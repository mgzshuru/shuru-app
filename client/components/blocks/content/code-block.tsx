import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeBlock as CodeBlockType } from '@/lib/types';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  show_line_numbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  show_line_numbers = true
}: CodeBlockProps) {
  return (
    <div className="my-8 max-w-4xl mx-auto">
      {title && (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}

      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded uppercase tracking-wide">
            {language}
          </span>
        </div>

        {React.createElement(SyntaxHighlighter as any, {
          language: language,
          style: tomorrow,
          showLineNumbers: show_line_numbers,
          customStyle: {
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
            lineHeight: '1.5',
            padding: '1.5rem',
            backgroundColor: '#1a1a1a'
          },
          lineNumberStyle: {
            color: '#666',
            fontSize: '12px'
          }
        }, code)}
      </div>
    </div>
  );
}