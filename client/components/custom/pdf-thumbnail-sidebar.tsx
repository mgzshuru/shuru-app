'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Lazy load react-pdf components to avoid SSR issues
const Document = dynamic(
  () => import('react-pdf').then(mod => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then(mod => mod.Page),
  { ssr: false }
);

// Import PDF config only on client side
if (typeof window !== 'undefined') {
  import('../../lib/pdf-config');
}

interface PdfThumbnailSidebarProps {
  pdfUrl: string;
  totalPages: number;
  currentPage: number;
  isOpen: boolean;
  onClose: () => void;
  onPageSelect: (page: number) => void;
  className?: string;
}

export function PdfThumbnailSidebar({
  pdfUrl,
  totalPages,
  currentPage,
  isOpen,
  onClose,
  onPageSelect,
  className,
}: PdfThumbnailSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const thumbnailRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to current page thumbnail
  useEffect(() => {
    if (isOpen && currentPage) {
      const thumbnail = thumbnailRefs.current.get(currentPage);
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentPage, isOpen]);

  const handlePageClick = (page: number) => {
    onPageSelect(page);
    if (isMobile) {
      onClose();
    }
  };

  const thumbnailSize = isMobile ? 120 : 150;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">الصفحات</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${thumbnailSize}px, 1fr))` }}>
          {Array.from(new Array(totalPages), (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;

            return (
              <div
                key={`thumbnail_${pageNumber}`}
                ref={(el) => {
                  if (el) thumbnailRefs.current.set(pageNumber, el);
                }}
                className={cn(
                  'relative cursor-pointer rounded-lg overflow-hidden transition-all hover:scale-105',
                  'border-2',
                  isActive
                    ? 'border-primary shadow-lg'
                    : 'border-transparent hover:border-muted-foreground/20'
                )}
                onClick={() => handlePageClick(pageNumber)}
              >
                <div className="aspect-[3/4] bg-muted relative">
                  <Document file={pdfUrl} loading={null}>
                    <Page
                      pageNumber={pageNumber}
                      width={thumbnailSize}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-pulse bg-muted-foreground/20 w-full h-full" />
                        </div>
                      }
                    />
                  </Document>
                </div>
                <div
                  className={cn(
                    'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2',
                    'flex items-center justify-center'
                  )}
                >
                  <span className="text-xs font-medium text-white">
                    {pageNumber}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile: Use Sheet (slide-out panel)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <div
      className={cn(
        'fixed left-0 top-14 bottom-0 w-72 bg-background border-r transform transition-transform duration-300 z-40',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}
    >
      {sidebarContent}
    </div>
  );
}
