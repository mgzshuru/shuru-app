'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Search,
  Download,
  Menu,
  X,
  LayoutGrid,
  Settings,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PdfViewerControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isFullscreen: boolean;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onSearch?: (query: string) => void;
  onDownload?: () => void;
  onToggleThumbnails?: () => void;
  onGoHome?: () => void;
  className?: string;
  showThumbnails?: boolean;
}

export function PdfViewerControls({
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onSearch,
  onDownload,
  onToggleThumbnails,
  onGoHome,
  className,
  showThumbnails = false,
}: PdfViewerControlsProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
      setShowSearchDialog(false);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b',
          'transition-transform duration-300',
          className
        )}
      >
        <div className="container flex items-center justify-between h-14 px-4">
          {/* Left: Home and Navigation */}
          <div className="flex items-center gap-2">
            {onGoHome && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onGoHome}
                    aria-label="العودة للرئيسية"
                  >
                    <Home className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>العودة للرئيسية</TooltipContent>
              </Tooltip>
            )}

            {!isMobile && <Separator orientation="vertical" className="h-6" />}

            {/* Page navigation */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    aria-label="الصفحة السابقة"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>الصفحة السابقة</TooltipContent>
              </Tooltip>

              {!isMobile && (
                <div className="flex items-center gap-2 mx-2">
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={pageInput}
                    onChange={(e) => handlePageInputChange(e.target.value)}
                    onBlur={handlePageInputSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handlePageInputSubmit()}
                    className="w-16 h-8 text-center"
                    aria-label="رقم الصفحة"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    من {totalPages}
                  </span>
                </div>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    aria-label="الصفحة التالية"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>الصفحة التالية</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Center: Page info on mobile */}
          {isMobile && (
            <div className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Zoom controls - desktop only */}
            {!isMobile && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onZoomOut}
                      disabled={zoom <= 50}
                      aria-label="تصغير"
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>تصغير</TooltipContent>
                </Tooltip>

                <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                  {zoom}%
                </span>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onZoomIn}
                      disabled={zoom >= 200}
                      aria-label="تكبير"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>تكبير</TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="h-6 mx-1" />
              </>
            )}

            {/* Search */}
            {onSearch && (
              <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="بحث">
                        <Search className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>بحث</TooltipContent>
                </Tooltip>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>البحث في المجلة</DialogTitle>
                    <DialogDescription>
                      ابحث عن نص معين في صفحات المجلة
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="أدخل نص البحث..."
                      className="flex-1"
                      autoFocus
                    />
                    <Button type="submit">بحث</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Thumbnails toggle */}
            {onToggleThumbnails && !isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showThumbnails ? 'default' : 'ghost'}
                    size="icon"
                    onClick={onToggleThumbnails}
                    aria-label="عرض الصور المصغرة"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>الصور المصغرة</TooltipContent>
              </Tooltip>
            )}

            {/* Download */}
            {onDownload && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDownload}
                    aria-label="تحميل"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تحميل المجلة</TooltipContent>
              </Tooltip>
            )}

            {/* Fullscreen */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFullscreen}
                  aria-label={isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
              </TooltipContent>
            </Tooltip>

            {/* Mobile menu */}
            {isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="القائمة">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onToggleThumbnails && (
                    <DropdownMenuItem onClick={onToggleThumbnails}>
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>الصور المصغرة</span>
                    </DropdownMenuItem>
                  )}
                  {onDownload && (
                    <DropdownMenuItem onClick={onDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>تحميل المجلة</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onZoomIn} disabled={zoom >= 200}>
                    <ZoomIn className="mr-2 h-4 w-4" />
                    <span>تكبير ({zoom}%)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onZoomOut} disabled={zoom <= 50}>
                    <ZoomOut className="mr-2 h-4 w-4" />
                    <span>تصغير ({zoom}%)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
