'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'react-toastify';

interface SaveButtonProps {
  articleId: string;
  articleTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function SaveButton({
  articleId,
  articleTitle = 'المقال',
  size = 'md',
  showText = false,
  className = ''
}: SaveButtonProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  // Check if article is saved when component mounts
  useEffect(() => {
    // Reset state when articleId changes
    setInitialCheckDone(false);
    setIsSaved(false);

    const shouldCheck = !authLoading && isAuthenticated && articleId;

    console.log('SaveButton useEffect:', {
      authLoading,
      isAuthenticated,
      articleId,
      shouldCheck
    });

    if (shouldCheck) {
      checkSavedStatus();
    } else if (!authLoading && !isAuthenticated) {
      setIsSaved(false);
      setInitialCheckDone(true);
    }
  }, [articleId, isAuthenticated, authLoading]);

  const checkSavedStatus = async () => {
    console.log('Checking saved status for article:', articleId);
    try {
      const response = await fetch(`/api/saved-articles/check/${articleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('Check saved status response:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Saved status data:', data);
        setIsSaved(data.saved);
      } else {
        console.log('Failed to check saved status:', response.status);
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    } finally {
      setInitialCheckDone(true);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً لحفظ المقالات', {
        position: 'top-center'
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/saved-articles/toggle/${articleId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);

        if (data.saved) {
          toast.success(`تم حفظ ${articleTitle} بنجاح`, {
            position: 'top-center'
          });
        } else {
          toast.success(`تم إلغاء حفظ ${articleTitle}`, {
            position: 'top-center'
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'حدث خطأ أثناء حفظ المقال');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ غير متوقع', {
        position: 'top-center'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if user is not authenticated
  if (!authLoading && !isAuthenticated) {
    return null;
  }

  // Show loading state during auth check or initial save status check
  if (authLoading || !initialCheckDone) {
    return (
      <button
        disabled
        className={`
          inline-flex items-center gap-2 rounded-lg border border-gray-300
          bg-white text-gray-400 transition-colors disabled:cursor-not-allowed
          ${sizeClasses[size]} ${className}
        `}
      >
        <div className={`animate-pulse bg-gray-300 rounded ${iconSizes[size]}`} />
        {showText && <span className="text-sm">جاري التحميل...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 rounded-lg border transition-all duration-200
        ${isSaved
          ? 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'
          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-700'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        ${sizeClasses[size]} ${className}
      `}
      title={isSaved ? `إلغاء حفظ ${articleTitle}` : `حفظ ${articleTitle}`}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`} />
      ) : isSaved ? (
        <BookmarkCheck className={iconSizes[size]} />
      ) : (
        <Bookmark className={iconSizes[size]} />
      )}

      {showText && (
        <span className="text-sm font-medium">
          {isLoading ? 'جاري الحفظ...' : isSaved ? 'محفوظ' : 'حفظ'}
        </span>
      )}
    </button>
  );
}
