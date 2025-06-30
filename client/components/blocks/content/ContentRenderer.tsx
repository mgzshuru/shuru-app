import { CallToAction } from './call-to-action';
import { CodeBlock } from './code-block';
import { Gallery } from './gallery';
import { ImageBlock } from './image';
import { Quote } from './quote';
import { RichText } from './rich-text';
import { VideoEmbed } from './video-embed';

// Type definitions based on your Strapi schema
interface ContentBlock {
  __component: string;
  id: number;
}

interface CallToActionBlock extends ContentBlock {
  __component: 'content.call-to-action';
  title: string;
  description?: string;
  button_text: string;
  button_url: string;
  style?: 'primary' | 'secondary' | 'outline';
  background_color?: string;
  open_in_new_tab?: boolean;
}

interface CodeBlockBlock extends ContentBlock {
  __component: 'content.code-block';
  code: string;
  language?: string;
  title?: string;
  show_line_numbers?: boolean;
}

interface GalleryBlock extends ContentBlock {
  __component: 'content.gallery';
  images: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  }>;
  title?: string;
  description?: string;
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: number;
}

interface ImageBlockBlock extends ContentBlock {
  __component: 'content.image';
  image: {
    id: number;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  };
  caption?: string;
  alt_text: string;
  width?: 'small' | 'medium' | 'large' | 'full';
}

interface QuoteBlock extends ContentBlock {
  __component: 'content.quote';
  quote_text: string;
  author?: string;
  author_title?: string;
  style?: 'default' | 'highlighted' | 'pullquote';
}

interface RichTextBlock extends ContentBlock {
  __component: 'content.rich-text';
  content: string;
}

interface VideoEmbedBlock extends ContentBlock {
  __component: 'content.video-embed';
  video_url: string;
  title?: string;
  description?: string;
  thumbnail?: {
    id: number;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  };
  autoplay?: boolean;
}

type ContentBlockTypes = 
  | CallToActionBlock
  | CodeBlockBlock
  | GalleryBlock
  | ImageBlockBlock
  | QuoteBlock
  | RichTextBlock
  | VideoEmbedBlock;

interface ContentRendererProps {
  blocks: ContentBlockTypes[];
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  const renderBlock = (block: ContentBlockTypes) => {
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
            image={block.image}
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
            thumbnail={block.thumbnail}
            autoplay={block.autoplay}
          />
        );

      default:
        console.warn(`Unknown component type: ${(block as ContentBlock).__component}`);
        return null;
    }
  };

  return (
    <div className="content-renderer">
      {blocks.map(renderBlock)}
    </div>
  );
}

// Export types for use in other files
export type {
  ContentBlockTypes,
  CallToActionBlock,
  CodeBlockBlock,
  GalleryBlock,
  ImageBlockBlock,
  QuoteBlock,
  RichTextBlock,
  VideoEmbedBlock
};