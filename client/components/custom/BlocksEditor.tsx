"use client";

import React from 'react';
import { Plus, X, ArrowUp, ArrowDown, Type, Image } from 'lucide-react';
import ArabicMarkdownEditor from './ArabicMarkdownEditor';

interface ContentBlock {
  id: string;
  __component: string;
  [key: string]: any;
}

interface RichTextBlock extends ContentBlock {
  __component: 'content.rich-text';
  content: string;
}

interface ImageBlock extends ContentBlock {
  __component: 'content.image';
  image: File | null;
  caption?: string;
  alt_text: string;
  width: 'small' | 'medium' | 'large' | 'full';
}

type BlockType = RichTextBlock | ImageBlock;

interface BlocksEditorProps {
  blocks: BlockType[];
  onChange: (blocks: BlockType[]) => void;
  errors?: { [key: string]: string };
}

export default function BlocksEditor({ blocks, onChange, errors }: BlocksEditorProps) {
  const generateBlockId = (): string => {
    return 'block-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const addBlock = (type: string) => {
    let newBlock: BlockType;

    switch (type) {
      case 'content.rich-text':
        newBlock = {
          id: generateBlockId(),
          __component: 'content.rich-text',
          content: ''
        } as RichTextBlock;
        break;
      case 'content.image':
        newBlock = {
          id: generateBlockId(),
          __component: 'content.image',
          image: null,
          caption: '',
          alt_text: '',
          width: 'medium'
        } as ImageBlock;
        break;
      default:
        return;
    }

    onChange([...blocks, newBlock]);
  };

  const updateBlock = (blockId: string, updates: Partial<BlockType>) => {
    onChange(blocks.map(block =>
      block.id === blockId
        ? { ...block, ...updates } as BlockType
        : block
    ) as BlockType[]);
  };

  const removeBlock = (blockId: string) => {
    if (blocks.length <= 1) return; // Keep at least one block
    onChange(blocks.filter(block => block.id !== blockId));
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(block => block.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];
    onChange(newBlocks);
  };

  const renderBlock = (block: BlockType, index: number) => {
    const canMoveUp = index > 0;
    const canMoveDown = index < blocks.length - 1;
    const canDelete = blocks.length > 1;

    return (
      <div key={block.id} className="border border-gray-200 rounded-lg p-4 mb-4">
        {/* Block Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {block.__component === 'content.rich-text' && <Type className="w-4 h-4" />}
            {block.__component === 'content.image' && <Image className="w-4 h-4" />}
            <span className="text-sm font-medium text-gray-600">
              {block.__component === 'content.rich-text' && 'نص منسق'}
              {block.__component === 'content.image' && 'صورة'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => moveBlock(block.id, 'up')}
              disabled={!canMoveUp}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => moveBlock(block.id, 'down')}
              disabled={!canMoveDown}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => removeBlock(block.id)}
              disabled={!canDelete}
              className="p-1 text-red-400 hover:text-red-600 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Block Content */}
        {block.__component === 'content.rich-text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محتوى النص
            </label>
            <ArabicMarkdownEditor
              value={(block as RichTextBlock).content}
              onChange={(value: string) => updateBlock(block.id, { content: value })}
              placeholder="اكتب محتوى المقال هنا..."
            />
          </div>
        )}

        {block.__component === 'content.image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصورة *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  updateBlock(block.id, { image: file });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {(block as ImageBlock).image && (
                <div className="mt-2 text-sm text-gray-600">
                  ملف محدد: {((block as ImageBlock).image as File).name}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الصورة (Alt Text) *
                </label>
                <input
                  type="text"
                  value={(block as ImageBlock).alt_text}
                  onChange={(e) => updateBlock(block.id, { alt_text: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="وصف الصورة للوصولية"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حجم الصورة
                </label>
                <select
                  value={(block as ImageBlock).width}
                  onChange={(e) => updateBlock(block.id, { width: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                  <option value="full">عرض كامل</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعليق على الصورة
              </label>
              <input
                type="text"
                value={(block as ImageBlock).caption || ''}
                onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="تعليق اختياري على الصورة"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">محتوى المقال</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => addBlock('content.rich-text')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            <Type className="w-4 h-4" />
            نص
          </button>
          <button
            type="button"
            onClick={() => addBlock('content.image')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
          >
            <Image className="w-4 h-4" />
            صورة
          </button>
        </div>
      </div>

      {/* Render all blocks */}
      {blocks.map((block, index) => renderBlock(block, index))}

      {/* Error display */}
      {errors?.blocks && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
          <span>{errors.blocks}</span>
        </div>
      )}

      {/* Add block button at the bottom */}
      <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="text-gray-500">إضافة عنصر جديد:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addBlock('content.rich-text')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <Type className="w-4 h-4" />
              نص
            </button>
            <button
              type="button"
              onClick={() => addBlock('content.image')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
            >
              <Image className="w-4 h-4" />
              صورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
