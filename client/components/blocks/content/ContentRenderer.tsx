import React from 'react';
import { CallToAction } from './call-to-action';
import { CodeBlock } from './code-block';
import { Gallery } from './gallery';
import { ImageBlock } from './image';
import { Quote } from './quote';
import { RichText } from './rich-text';
import { VideoEmbed } from './video-embed';
import {
  Block,
  CallToActionBlock,
  CodeBlock as CodeBlockType,
  GalleryBlock,
  ImageBlock as ImageBlockType,
  QuoteBlock,
  RichTextBlock,
  VideoEmbedBlock
} from '@/lib/types';

interface ContentRendererProps {
  blocks?: Block[] | null;
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  // Safety check for null or undefined blocks
  if (!blocks || blocks.length === 0) {
    console.log('No blocks to render');
    return null;
  }

  // Ensure blocks is an array
  const blocksArray = Array.isArray(blocks) ? blocks : [blocks];

  const renderBlock = (block: Block) => {
    // Safety check for malformed block
    if (!block || !block.__component) {
      console.warn('Invalid block structure:', block);
      return null;
    }

    switch (block.__component) {
      case 'content.call-to-action':
        return (
          <CallToAction
            key={block.id}
            title={block.title}
            description={block.description}
            button_text={block.button_text}
            button_url={block.button_url}
            style={block.style}
            background_color={block.background_color}
            open_in_new_tab={block.open_in_new_tab}
          />
        );

      case 'content.code-block':
        return (
          <CodeBlock
            key={block.id}
            code={block.code}
            language={block.language}
            title={block.title}
            show_line_numbers={block.show_line_numbers}
          />
        );

      case 'content.gallery':
        return (
          <Gallery
            key={block.id}
            images={block.images}
            title={block.title}
            description={block.description}
            layout={block.layout}
            columns={block.columns}
          />
        );

      case 'content.image':
        return (
          <ImageBlock
            key={block.id}
            image={{
              url: block.image.url,
              width: block.image.width || 0,
              height: block.image.height || 0,
              documentId: block.image.documentId,
              id: block.image.id,
              alternativeText: block.image.alternativeText
            }}
            caption={block.caption}
            alt_text={block.alt_text}
            width={block.width}
          />
        );

      case 'content.quote':
        return (
          <Quote
            key={block.id}
            quote_text={block.quote_text}
            author={block.author}
            author_title={block.author_title}
            style={block.style}
          />
        );

      case 'content.rich-text':
        return (
          <RichText
            key={block.id}
            content={block.content}
          />
        );

      case 'content.video-embed':
        return (
          <VideoEmbed
            key={block.id}
            video_url={block.video_url}
            title={block.title}
            description={block.description}
            thumbnail={block.thumbnail ? {
              url: block.thumbnail.url,
              width: block.thumbnail.width || 0,
              height: block.thumbnail.height || 0,
              documentId: block.thumbnail.documentId,
              id: block.thumbnail.id,
              alternativeText: block.thumbnail.alternativeText
            } : undefined}
            autoplay={block.autoplay}
          />
        );

      default:
        console.warn(`Unknown component type: ${(block as any).__component}`);
        return null;
    }
  };

  return (
    <div className="content-renderer">
      {blocksArray.map((block, index) => (
        <React.Fragment key={block.id || `block-${index}`}>
          {renderBlock(block)}
        </React.Fragment>
      ))}
    </div>
  );
}