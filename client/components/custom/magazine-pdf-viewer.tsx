'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PdfViewerControls } from './pdf-viewer-controls';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MagazinePdfViewerProps {
  pdfUrl: string;
  magazineTitle: string;
  magazineSlug: string;
  downloadUrl?: string;
  className?: string;
}

interface FlipBookRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    flip: (page: number) => void;
    getCurrentPageIndex: () => number;
  };
}

export function MagazinePdfViewer({
  pdfUrl,
  magazineTitle,
  magazineSlug,
  downloadUrl,
  className,
}: MagazinePdfViewerProps) {
  const router = useRouter();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);

  const flipBookRef = useRef<FlipBookRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

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

  // Calculate page dimensions based on viewport and zoom
  const calculatePageDimensions = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight - 56; // Subtract controls height

      const mobile = window.innerWidth < 768;
      const baseWidth = mobile ? containerWidth * 0.9 : containerWidth * 0.45;
      const baseHeight = containerHeight * 0.85;

      // Apply zoom
      const zoomFactor = zoom / 100;
      setPageWidth(baseWidth * zoomFactor);
      setPageHeight(baseHeight * zoomFactor);
      setScale(zoomFactor);
    }
  }, [zoom]);

  useEffect(() => {
    calculatePageDimensions();
  }, [calculatePageDimensions, zoom]);

  // Save last read page to localStorage
  useEffect(() => {
    if (currentPage > 0 && magazineSlug) {
      localStorage.setItem(`magazine_${magazineSlug}_lastPage`, String(currentPage));
    }
  }, [currentPage, magazineSlug]);

  // Load last read page on mount
  useEffect(() => {
    const lastPage = localStorage.getItem(`magazine_${magazineSlug}_lastPage`);
    if (lastPage) {
      const page = parseInt(lastPage, 10);
      if (!isNaN(page) && page > 1) {
        setTimeout(() => {
          flipToPage(page);
        }, 1000);
      }
    }
  }, [magazineSlug]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    toast.success(`تم تحميل المجلة بنجاح (${numPages} صفحة)`);
  };

  const onDocumentLoadError = (error: Error) => {
    setIsLoading(false);
    setError(error);
    toast.error('فشل تحميل المجلة');
    console.error('Error loading PDF:', error);
  };

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data + 1);
  }, []);

  // Flipbook control methods
  const flipNext = useCallback(() => {
    if (currentPage < numPages) {
      flipBookRef.current?.pageFlip()?.flipNext();
    }
  }, [currentPage, numPages]);

  const flipPrev = useCallback(() => {
    if (currentPage > 1) {
      flipBookRef.current?.pageFlip()?.flipPrev();
    }
  }, [currentPage]);

  const flipToPage = useCallback((page: number) => {
    if (page >= 1 && page <= numPages) {
      flipBookRef.current?.pageFlip()?.flip(page - 1);
    }
  }, [numPages]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50));
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
        // Fallback for iOS
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error('Failed to exit fullscreen:', err);
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          flipPrev(); // RTL: right arrow goes to previous
          break;
        case 'ArrowLeft':
          flipNext(); // RTL: left arrow goes to next
          break;
        case 'Home':
          flipToPage(1);
          break;
        case 'End':
          flipToPage(numPages);
          break;
        case 'PageUp':
          flipPrev();
          break;
        case 'PageDown':
          flipNext();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleZoomIn();
          }
          break;
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleZoomOut();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev, flipToPage, numPages, isFullscreen, toggleFullscreen, handleZoomIn, handleZoomOut]);

  // Touch gestures for mobile
  useGesture(
    {
      onPinch: ({ offset: [scale] }) => {
        const newZoom = Math.round(scale * 100);
        setZoom(Math.max(50, Math.min(200, newZoom)));
      },
      onWheel: ({ event, delta: [, dy] }) => {
        if (event.ctrlKey) {
          event.preventDefault();
          const zoomDelta = dy > 0 ? -10 : 10;
          setZoom((prev) => Math.max(50, Math.min(200, prev + zoomDelta)));
        }
      },
    },
    {
      target: viewerRef,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: 0.5, max: 2 } },
    }
  );

  // Download handler
  const handleDownload = useCallback(async () => {
    try {
      const url = downloadUrl || pdfUrl;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${magazineTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('تم بدء التحميل');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('فشل تحميل الملف');
    }
  }, [pdfUrl, downloadUrl, magazineTitle]);

  // Search handler (placeholder)
  const handleSearch = useCallback((query: string) => {
    toast.info(`البحث عن: ${query} (قريباً...)`);
    // TODO: Implement search functionality
  }, []);

  const handleGoHome = useCallback(() => {
    router.push(`/magazine/${magazineSlug}`);
  }, [router, magazineSlug]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ في تحميل المجلة</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message}
          </AlertDescription>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              إعادة المحاولة
            </Button>
            <Button onClick={handleGoHome} variant="default">
              العودة للمجلة
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Controls */}
      <PdfViewerControls
        currentPage={currentPage}
        totalPages={numPages}
        zoom={zoom}
        isFullscreen={isFullscreen}
        onPageChange={flipToPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFullscreen={toggleFullscreen}
        onSearch={handleSearch}
        onDownload={handleDownload}
        onToggleThumbnails={() => setShowThumbnails(!showThumbnails)}
        onGoHome={handleGoHome}
        showThumbnails={showThumbnails}
      />

      {/* Thumbnail Sidebar */}
      {numPages > 0 && (
        <PdfThumbnailSidebar
          pdfUrl={pdfUrl}
          totalPages={numPages}
          currentPage={currentPage}
          isOpen={showThumbnails}
          onClose={() => setShowThumbnails(false)}
          onPageSelect={flipToPage}
        />
      )}

      {/* PDF Viewer */}
      <div
        ref={viewerRef}
        className={cn(
          'w-full h-full flex items-center justify-center pt-14',
          showThumbnails && !isMobile && 'pl-72'
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
            <div className="flipbook-wrapper" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
              <HTMLFlipBook
                ref={flipBookRef}
                width={pageWidth / scale}
                height={pageHeight / scale}
                size={isMobile ? 'stretch' : 'fixed'}
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                drawShadow={true}
                flippingTime={800}
                usePortrait={isMobile}
                startPage={0}
                autoSize={false}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={handleFlip}
                className="magazine-flipbook"
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
                  <div key={`page_${index + 1}`} className="magazine-page">
                    <Page
                      pageNumber={index + 1}
                      width={pageWidth / scale}
                      height={pageHeight / scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      loading={
                        <div className="flex items-center justify-center h-full bg-white">
                          <Skeleton className="w-full h-full" />
                        </div>
                      }
                    />
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}
