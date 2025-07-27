'use client';

import { useMemo } from 'react';

export function useBaseUrl() {
  return useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shuru.sa';
  }, []);
}
