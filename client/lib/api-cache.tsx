/**
 * Simple in-memory cache for Strapi API responses
 * In production, consider using Redis or other external cache
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  private generateKey(collection: string, query: any): string {
    return `${collection}:${JSON.stringify(query)}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  get(collection: string, query: any): any | null {
    const key = this.generateKey(collection, query);
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(collection: string, query: any, data: any, ttl?: number): void {
    const key = this.generateKey(collection, query);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };

    this.cache.set(key, entry);

    // Clean up expired entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  // Clear cache for specific collection (useful for invalidation)
  clearCollection(collection: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${collection}:`)) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiCache = new APICache();

// Cached wrapper for client calls
export function withCache<T>(
  cacheKey: { collection: string; query: any },
  apiCall: () => Promise<T>,
  ttl?: number
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Try to get from cache first
      const cached = apiCache.get(cacheKey.collection, cacheKey.query);
      if (cached) {
        resolve(cached);
        return;
      }

      // If not in cache, make API call
      const result = await apiCall();

      // Cache the result
      apiCache.set(cacheKey.collection, cacheKey.query, result, ttl);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Cache invalidation helpers
export const cacheInvalidation = {
  // Invalidate when articles are updated
  onArticleUpdate: () => {
    apiCache.clearCollection('articles');
    apiCache.clearCollection('global'); // Global might include recent articles
  },

  // Invalidate when categories are updated
  onCategoryUpdate: () => {
    apiCache.clearCollection('categories');
    apiCache.clearCollection('articles'); // Articles include category data
  },

  // Invalidate when global settings are updated
  onGlobalUpdate: () => {
    apiCache.clearCollection('global');
  },

  // Clear all cache
  clearAll: () => {
    apiCache.clear();
  }
};
