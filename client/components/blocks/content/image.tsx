import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ImageBlock as ImageBlockType } from '@/lib/types';

interface ImageProps {
  image: ImageBlockType['image'];
  caption?: string;
  alt_text: string;
  width?: 'small' | 'medium' | 'large' | 'full';
}

export function ImageBlock({
  image,
  caption,
  alt_text,
  width = 'medium'
}: ImageProps) {
  const widthClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-full'
  };

  return (
    <figure className={cn('mx-auto my-8', widthClasses[width])}>
      <div className="relative overflow-hidden bg-gray-100">
        <Image
          src={image.url}
          alt={alt_text}
          width={image.width || 800}
          height={image.height || 600}
          className="w-full h-auto"
          sizes={
            width === 'full'
              ? '100vw'
              : width === 'large'
              ? '(min-width: 1024px) 896px, 100vw'
              : width === 'medium'
              ? '(min-width: 768px) 672px, 100vw'
              : '(min-width: 640px) 448px, 100vw'
          }
        />
      </div>

      {caption && (
        <figcaption className="mt-4 text-sm text-gray-600 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}