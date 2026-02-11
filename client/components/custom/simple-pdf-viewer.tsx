'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SimplePdfViewerProps {
  pdfUrl: string;
  magazineTitle: string;
  magazineSlug: string;
  downloadUrl?: string;
  className?: string;
}

export function SimplePdfViewer({
  pdfUrl,
  magazineTitle,
  magazineSlug,
  downloadUrl,
  className,
}: SimplePdfViewerProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load last read page
  useEffect(() => {
    const lastPage = localStorage.getItem(`magazine_${magazineSlug}_lastPage`);
    if (lastPage) {
      const page = parseInt(lastPage, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [magazineSlug]);

  // Save current page
  useEffect(() => {
    if (currentPage > 0 && magazineSlug) {
      localStorage.setItem(`magazine_${magazineSlug}_lastPage`, String(currentPage));
    }
  }, [currentPage, magazineSlug]);

  // Build PDF.js viewer URL
  const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
    toast.success('تم تحميل المجلة بنجاح');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('فشل تحميل المجلة');
    toast.error('فشل تحميل المجلة');
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Send message to iframe to change page
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'goToPage',
        page: page
      }, '*');
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 200));
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'zoomIn'
      }, '*');
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50));
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'zoomOut'
      }, '*');
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error('Failed to exit fullscreen:', err);
        setIsFullscreen(false);
      });
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  const handleSearch = useCallback((query: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'search',
        query: query
      }, '*');
    }
  }, []);

  const handleGoHome = useCallback(() => {
    router.push(`/magazine/${magazineSlug}`);
  }, [router, magazineSlug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          handlePageChange(Math.max(1, currentPage - 1));
          break;
        case 'ArrowLeft':
          handlePageChange(Math.min(totalPages, currentPage + 1));
          break;
        case 'Home':
          handlePageChange(1);
          break;
        case 'End':
          handlePageChange(totalPages);
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
  }, [currentPage, totalPages, isFullscreen, toggleFullscreen, handleZoomIn, handleZoomOut, handlePageChange]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ في تحميل المجلة</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
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
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-[300px] h-[400px]" />
            <p className="text-sm text-muted-foreground">جاري تحميل المجلة...</p>
          </div>
        </div>
      )}

      {/* PDF Viewer Iframe */}
      <div className="w-full h-full">
        <iframe
          ref={iframeRef}
          src={viewerUrl}
          className="w-full h-full border-0"
          title={magazineTitle}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
