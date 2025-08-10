'use client';

import React, { useState, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './ArabicEditor.module.css';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Quote,
  Code,
  Eye,
  Edit,
  Heading1,
  Heading2
} from 'lucide-react';

interface ArabicMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

const ArabicMarkdownEditor: React.FC<ArabicMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'اكتب محتوى المقال هنا...',
  minHeight = 400,
  className = ''
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Helper function to wrap selected text
  const wrapText = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('.arabic-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    onChange(newText);

    // Restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  }, [value, onChange]);

  // Toolbar button handlers
  const insertBold = () => wrapText('**', '**');
  const insertItalic = () => wrapText('*', '*');
  const insertHeading1 = () => wrapText('# ', '');
  const insertHeading2 = () => wrapText('## ', '');
  const insertList = () => wrapText('- ', '');
  const insertOrderedList = () => wrapText('1. ', '');
  const insertQuote = () => wrapText('> ', '');
  const insertCode = () => wrapText('`', '`');
  const insertLink = () => wrapText('[نص الرابط](', ')');

  // Convert markdown to simple HTML for preview
  const renderPreview = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gm, '<h1 style="font-size: 2em; font-weight: bold; margin: 0.5em 0; color: #1f2937;">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5em; font-weight: bold; margin: 0.5em 0; color: #374151;">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: #f3f4f6; padding: 0.25em 0.5em; border-radius: 0.25em; font-family: monospace;">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote style="border-right: 4px solid #e5e7eb; padding-right: 1em; margin: 1em 0; color: #6b7280; font-style: italic;">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li style="margin: 0.25em 0;">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li style="margin: 0.25em 0;">$2</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: underline;">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`} dir="rtl">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-1" dir="ltr">
          <button
            type="button"
            onClick={insertBold}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="نص عريض"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertItalic}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="نص مائل"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={insertHeading1}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="عنوان رئيسي"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertHeading2}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="عنوان فرعي"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={insertList}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="قائمة"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertOrderedList}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="قائمة مرقمة"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={insertQuote}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="اقتباس"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertCode}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="كود"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="رابط"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`p-2 rounded transition-colors ${!isPreviewMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="تحرير"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`p-2 rounded transition-colors ${isPreviewMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            title="معاينة"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative" style={{ minHeight: `${minHeight}px` }}>
        {!isPreviewMode ? (
          <TextareaAutosize
            className={`${styles['arabic-editor-textarea']} w-full p-4 resize-none border-none outline-none bg-white text-gray-900 text-right`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            minRows={Math.ceil(minHeight / 24)}
            dir="rtl"
            lang="ar"
          />
        ) : (
          <div
            className="p-4 prose prose-lg max-w-none text-right"
            dir="rtl"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'IBM Plex Sans Arabic, Noto Sans Arabic, Tajawal, Arial, sans-serif',
              textAlign: 'right',
              direction: 'rtl'
            }}
            dangerouslySetInnerHTML={{
              __html: renderPreview(value) || '<p style="color: #9ca3af;">لا يوجد محتوى للمعاينة</p>'
            }}
          />
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 text-right">
        <p>يمكنك استخدام تنسيق Markdown: **نص عريض** *نص مائل* # عنوان ## عنوان فرعي - قائمة {`>`} اقتباس</p>
      </div>
    </div>
  );
};

export default ArabicMarkdownEditor;
