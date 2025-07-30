/**
 * Performance monitoring and optimization utilities
 */

// Performance timing utility
export function withTiming<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();

    try {
      const result = await fn();
      const end = performance.now();

      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
      }

      resolve(result);
    } catch (error) {
      const end = performance.now();

      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${name} failed in ${(end - start).toFixed(2)}ms:`, error);
      }

      reject(error);
    }
  });
}

// API call performance wrapper
export function withAPITiming<T>(
  apiName: string,
  apiCall: () => Promise<T>,
  slowThreshold = 1000
): Promise<T> {
  return withTiming(`API: ${apiName}`, async () => {
    const result = await apiCall();

    // Log slow API calls in development
    if (process.env.NODE_ENV === 'development') {
      const timing = performance.now();
      if (timing > slowThreshold) {
        console.warn(`🐌 Slow API call detected: ${apiName} took ${timing.toFixed(2)}ms`);
      }
    }

    return result;
  });
}

// Data size monitoring
export function logDataSize(name: string, data: any): void {
  if (process.env.NODE_ENV === 'development') {
    const size = JSON.stringify(data).length;
    const sizeKB = (size / 1024).toFixed(2);

    if (size > 50000) { // Log if data is larger than 50KB
      console.warn(`📊 Large data payload: ${name} is ${sizeKB}KB`);
    } else {
      console.log(`📊 ${name}: ${sizeKB}KB`);
    }
  }
}

// Memory usage monitoring
export function logMemoryUsage(context: string): void {
  if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
    const used = process.memoryUsage();
    const formatMB = (bytes: number) => Math.round(bytes / 1024 / 1024 * 100) / 100;

    console.log(`🧠 Memory usage at ${context}:`, {
      rss: `${formatMB(used.rss)} MB`,
      heapTotal: `${formatMB(used.heapTotal)} MB`,
      heapUsed: `${formatMB(used.heapUsed)} MB`,
      external: `${formatMB(used.external)} MB`,
    });
  }
}

// Performance benchmarking
export class PerformanceBenchmark {
  private timings: Map<string, number> = new Map();

  start(label: string): void {
    this.timings.set(label, performance.now());
  }

  end(label: string): number {
    const start = this.timings.get(label);
    if (!start) {
      console.warn(`No start time found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.timings.delete(label);

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  report(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('📈 Performance Report:');
      for (const [label, startTime] of this.timings) {
        const duration = performance.now() - startTime;
        console.log(`  ${label}: ${duration.toFixed(2)}ms (still running)`);
      }
    }
  }
}

// API response size checker
export function checkResponseSize(name: string, response: any): any {
  logDataSize(name, response);

  // Warn about large responses
  const size = JSON.stringify(response).length;
  if (size > 100000) { // 100KB
    console.warn(`⚠️  Large API response from ${name}. Consider pagination or reducing populate fields.`);
  }

  return response;
}

// Database query optimization checker
export function suggestOptimizations(queryName: string, data: any): void {
  if (process.env.NODE_ENV !== 'development') return;

  const suggestions: string[] = [];

  // Check for over-populated data
  if (data?.data && Array.isArray(data.data)) {
    const firstItem = data.data[0];
    if (firstItem) {
      const fields = Object.keys(firstItem);

      // Too many fields might indicate over-population
      if (fields.length > 15) {
        suggestions.push(`Consider reducing populated fields (currently ${fields.length} fields)`);
      }

      // Check for nested data that might not be needed
      const nestedFields = fields.filter(field =>
        firstItem[field] && typeof firstItem[field] === 'object' && firstItem[field] !== null
      );

      if (nestedFields.length > 8) {
        suggestions.push(`Many nested relations found (${nestedFields.length}). Consider if all are needed`);
      }
    }

    // Check pagination
    if (data.data.length > 20) {
      suggestions.push(`Large result set (${data.data.length} items). Consider pagination`);
    }
  }

  if (suggestions.length > 0) {
    console.log(`💡 Optimization suggestions for ${queryName}:`);
    suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
  }
}

// Export all utilities
export const performanceUtils = {
  withTiming,
  withAPITiming,
  logDataSize,
  logMemoryUsage,
  checkResponseSize,
  suggestOptimizations,
  PerformanceBenchmark
};
