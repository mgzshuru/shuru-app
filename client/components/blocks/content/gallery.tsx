import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GalleryBlock } from '@/lib/types';

interface GalleryProps {
  images: GalleryBlock['images'];
  title?: string;
  description?: string;
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: number;
}

export function Gallery({
  images,
  title,
  description,
  layout = 'grid',
  columns = 3
}: GalleryProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {layout === 'grid' && (
          <div className={cn('grid gap-6', gridCols[columns as keyof typeof gridCols])}>
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden bg-gray-100 aspect-square"
              >
                <Image
                  src={image.url}
                  alt={image.alternativeText || ''}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}

        {layout === 'carousel' && (
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {images.map((image) => (
              <div
                key={image.id}
                className="flex-none w-80 h-60 relative overflow-hidden bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={image.alternativeText || ''}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {layout === 'masonry' && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="break-inside-avoid mb-6 group relative overflow-hidden bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={image.alternativeText || ''}
                  width={image.width || 400}
                  height={image.height || 300}
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}