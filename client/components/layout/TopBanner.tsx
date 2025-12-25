'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopBannerProps {
  /** The Arabic text message to display in the banner */
  message?: string;
  /** Background color class for the banner */
  bgColor?: string;
  /** Text color class for the banner */
  textColor?: string;
  /** Allow users to dismiss/close the banner */
  dismissible?: boolean;
  /** Callback when banner is dismissed */
  onDismiss?: () => void;
  /** Optional link URL */
  linkUrl?: string;
  /** Optional link text */
  linkText?: string;
}

export default function TopBanner({
  message = 'مرحباً بكم في موقعنا - اشترك الآن للحصول على آخر التحديثات',
  bgColor = 'bg-gradient-to-r from-orange-500 to-orange-600',
  textColor = 'text-white',
  dismissible = true,
  onDismiss,
  linkUrl,
  linkText = 'اشترك الآن',
}: TopBannerProps) {
  return (
    <div
      className={`relative w-full ${bgColor} ${textColor} z-[1001]`}
      role="banner"
      aria-label="إعلان علوي"
    >
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-center">
          {/* Message */}
          <p className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">
            {message}
          </p>

          {/* Optional Link */}
          {linkUrl && (
            <a
              href={linkUrl}
              className="text-[10px] sm:text-xs font-bold underline hover:no-underline whitespace-nowrap transition-all duration-200 hover:scale-105"
              aria-label={linkText}
            >
              {linkText}
            </a>
          )}

          {/* Dismiss Button */}
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="absolute left-2 top-1/2 -translate-y-1/2 hover:bg-white/10 h-5 w-5 p-0 rounded-full"
              aria-label="إغلاق الإعلان"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
