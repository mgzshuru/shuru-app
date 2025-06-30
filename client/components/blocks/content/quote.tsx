import { cn } from '@/lib/utils';

interface QuoteProps {
  quote_text: string;
  author?: string;
  author_title?: string;
  style?: 'default' | 'highlighted' | 'pullquote';
}

export function Quote({
  quote_text,
  author,
  author_title,
  style = 'default'
}: QuoteProps) {
  if (style === 'pullquote') {
    return (
      <aside className="my-12 px-6 py-8 bg-gray-50 border-l-4 border-black">
        <blockquote className="text-2xl md:text-3xl font-light text-gray-900 leading-relaxed">
          "{quote_text}"
        </blockquote>
        {(author || author_title) && (
          <footer className="mt-6 text-sm text-gray-600">
            {author && <cite className="font-semibold">{author}</cite>}
            {author_title && (
              <span className="block mt-1 text-gray-500">{author_title}</span>
            )}
          </footer>
        )}
      </aside>
    );
  }

  if (style === 'highlighted') {
    return (
      <div className="my-12 bg-black text-white p-8 md:p-12">
        <blockquote className="text-xl md:text-2xl font-light leading-relaxed">
          "{quote_text}"
        </blockquote>
        {(author || author_title) && (
          <footer className="mt-6 text-sm text-gray-300">
            {author && <cite className="font-semibold">{author}</cite>}
            {author_title && (
              <span className="block mt-1 text-gray-400">{author_title}</span>
            )}
          </footer>
        )}
      </div>
    );
  }

  return (
    <blockquote className="my-8 px-6 py-4 border-l-4 border-gray-200 bg-gray-50">
      <p className="text-lg text-gray-700 leading-relaxed italic">
        "{quote_text}"
      </p>
      {(author || author_title) && (
        <footer className="mt-4 text-sm text-gray-600">
          {author && <cite className="font-semibold not-italic">{author}</cite>}
          {author_title && (
            <span className="block mt-1 text-gray-500">{author_title}</span>
          )}
        </footer>
      )}
    </blockquote>
  );
}