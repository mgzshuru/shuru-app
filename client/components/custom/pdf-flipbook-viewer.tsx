'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../lib/pdf-config';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PdfFlipbookViewerProps {
  pdfUrl: string;
  magazineTitle?: string;
  className?: string;
  onPageChange?: (page: number) => void;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: Error) => void;
}

interface FlipBookRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    flip: (page: number) => void;
    getCurrentPageIndex: () => number;
  };
}

export function PdfFlipbookViewer({
  pdfUrl,
  magazineTitle,
  className,
  onPageChange,
  onLoadSuccess,
  onLoadError,
}: PdfFlipbookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const flipBookRef = useRef<FlipBookRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      calculatePageDimensions();
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate page dimensions based on viewport
  const calculatePageDimensions = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // For mobile: single page takes full width
      // For desktop: each page takes half width (double spread)
      const mobile = window.innerWidth < 768;
      const width = mobile ? containerWidth * 0.9 : containerWidth * 0.45;
      const height = containerHeight * 0.85;

      setPageWidth(width);
      setPageHeight(height);
    }
  }, []);

  useEffect(() => {
    calculatePageDimensions();
  }, [calculatePageDimensions]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    onLoadSuccess?.(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    setIsLoading(false);
    console.error('Error loading PDF:', error);
    onLoadError?.(error);
  };

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
    onPageChange?.(e.data);
  }, [onPageChange]);

  // Methods to control the flipbook
  const flipNext = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const flipToPage = useCallback((page: number) => {
    flipBookRef.current?.pageFlip()?.flip(page);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        flipNext();
      } else if (e.key === 'ArrowLeft') {
        flipPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev]);

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">لا يوجد ملف PDF متاح</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900",
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-[300px] h-[400px]" />
            <p className="text-sm text-muted-foreground">جاري تحميل المجلة...</p>
          </div>
        </div>
      )}

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={null}
        className="hidden"
      >
        {numPages > 0 && pageWidth > 0 && (
          <HTMLFlipBook
            ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            size={isMobile ? 'stretch' : 'fixed'}
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={isMobile}
            startPage={0}
            autoSize={false}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            className="flipbook-container"
            style={{}}
            startZIndex={0}
            renderOnlyPageLengthChange={false}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={`page_${index + 1}`} className="page bg-white shadow-lg">
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  height={pageHeight}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                  }
                />
              </div>
            ))}
          </HTMLFlipBook>
        )}
      </Document>

      {/* Page indicator */}
      {!isLoading && numPages > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
          صفحة {currentPage + 1} من {numPages}
        </div>
      )}
    </div>
  );
}

// Export control methods for parent components
export type PdfFlipbookViewerHandle = {
  flipNext: () => void;
  flipPrev: () => void;
  flipToPage: (page: number) => void;
  getCurrentPage: () => number;
};
