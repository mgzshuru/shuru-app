/**
 * Performance testing script for optimized API calls
 * Run this script to compare performance before and after optimization
 */

import {
  getArticlesOptimized,
  getArticleForDetail,
  getArticleForSEO,
  getGlobalCached,
  getAllCategories,
  getCategoryBySlug
} from '@/lib/strapi-optimized';

import {
  getArticlesPaginated,
  getArticleWithFullPopulation,
  getGlobal,
  getAllCategories as getAllCategoriesOld
} from '@/lib/strapi-client';

import { withAPITiming, logDataSize, PerformanceBenchmark } from '@/lib/performance-utils';

export class PerformanceComparison {
  private benchmark = new PerformanceBenchmark();

  async compareArticlesList() {
    console.log('\n🔥 Testing Articles List Performance\n');

    // Test old method
    this.benchmark.start('old-articles-list');
    const oldResult = await withAPITiming('Old Articles List', () =>
      getArticlesPaginated(1, 12)
    );
    this.benchmark.end('old-articles-list');
    logDataSize('Old Articles List', oldResult);

    // Test new method
    this.benchmark.start('new-articles-list');
    const newResult = await withAPITiming('New Articles List', () =>
      getArticlesOptimized({ page: 1, pageSize: 12 })
    );
    this.benchmark.end('new-articles-list');
    logDataSize('New Articles List', newResult);

    return { old: oldResult, new: newResult };
  }

  async compareArticleDetail(slug: string = 'sample-article') {
    console.log('\n🔥 Testing Article Detail Performance\n');

    // Test old method
    this.benchmark.start('old-article-detail');
    const oldResult = await withAPITiming('Old Article Detail', () =>
      getArticleWithFullPopulation(slug)
    );
    this.benchmark.end('old-article-detail');
    logDataSize('Old Article Detail', oldResult);

    // Test new method
    this.benchmark.start('new-article-detail');
    const newResult = await withAPITiming('New Article Detail', () =>
      getArticleForDetail(slug)
    );
    this.benchmark.end('new-article-detail');
    logDataSize('New Article Detail', newResult);

    return { old: oldResult, new: newResult };
  }

  async compareGlobalData() {
    console.log('\n🔥 Testing Global Data Performance\n');

    // Test old method (multiple calls)
    this.benchmark.start('old-global-multiple');
    const oldResults = await Promise.all([
      withAPITiming('Old Global Call 1', () => getGlobal()),
      withAPITiming('Old Global Call 2', () => getGlobal()),
      withAPITiming('Old Global Call 3', () => getGlobal()),
    ]);
    this.benchmark.end('old-global-multiple');

    // Test new method (cached)
    this.benchmark.start('new-global-cached');
    const newResults = await Promise.all([
      withAPITiming('New Global Call 1', () => getGlobalCached()),
      withAPITiming('New Global Call 2', () => getGlobalCached()),
      withAPITiming('New Global Call 3', () => getGlobalCached()),
    ]);
    this.benchmark.end('new-global-cached');

    return { old: oldResults, new: newResults };
  }

  async compareSEOData(slug: string = 'sample-article') {
    console.log('\n🔥 Testing SEO Data Performance\n');

    // Test old method (full population)
    this.benchmark.start('old-seo-full');
    const oldResult = await withAPITiming('Old SEO (Full Article)', () =>
      getArticleWithFullPopulation(slug)
    );
    this.benchmark.end('old-seo-full');
    logDataSize('Old SEO (Full Article)', oldResult);

    // Test new method (SEO only)
    this.benchmark.start('new-seo-minimal');
    const newResult = await withAPITiming('New SEO (Minimal)', () =>
      getArticleForSEO(slug)
    );
    this.benchmark.end('new-seo-minimal');
    logDataSize('New SEO (Minimal)', newResult);

    return { old: oldResult, new: newResult };
  }

  async runFullComparison() {
    console.log('🚀 Starting Performance Comparison Tests\n');
    console.log('='.repeat(50));

    try {
      // Run all comparisons
      const results = {
        articlesList: await this.compareArticlesList(),
        // articleDetail: await this.compareArticleDetail(),
        globalData: await this.compareGlobalData(),
        // seoData: await this.compareSEOData(),
      };

      console.log('\n📊 Performance Summary:');
      console.log('='.repeat(50));
      this.benchmark.report();

      return results;
    } catch (error) {
      console.error('❌ Error during performance testing:', error);
      throw error;
    }
  }

  // Memory usage comparison
  async compareMemoryUsage() {
    console.log('\n🧠 Memory Usage Comparison\n');

    const initialMemory = process.memoryUsage();
    console.log('Initial memory:', this.formatMemory(initialMemory));

    // Old method - load multiple heavy requests
    const oldMemoryStart = process.memoryUsage();
    await Promise.all([
      getArticlesPaginated(1, 12),
      getGlobal(),
      getAllCategoriesOld(),
    ]);
    const oldMemoryEnd = process.memoryUsage();
    console.log('After old methods:', this.formatMemory(oldMemoryEnd));

    // Clear some memory (simplified)
    if (global.gc) {
      global.gc();
    }

    // New method - optimized requests
    const newMemoryStart = process.memoryUsage();
    await Promise.all([
      getArticlesOptimized({ page: 1, pageSize: 12 }),
      getGlobalCached(),
      getAllCategories(),
    ]);
    const newMemoryEnd = process.memoryUsage();
    console.log('After new methods:', this.formatMemory(newMemoryEnd));

    return {
      old: {
        before: oldMemoryStart,
        after: oldMemoryEnd,
        difference: this.calculateMemoryDiff(oldMemoryStart, oldMemoryEnd)
      },
      new: {
        before: newMemoryStart,
        after: newMemoryEnd,
        difference: this.calculateMemoryDiff(newMemoryStart, newMemoryEnd)
      }
    };
  }

  private formatMemory(memory: NodeJS.MemoryUsage) {
    return {
      rss: `${Math.round(memory.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(memory.external / 1024 / 1024 * 100) / 100} MB`,
    };
  }

  private calculateMemoryDiff(before: NodeJS.MemoryUsage, after: NodeJS.MemoryUsage) {
    return {
      rss: after.rss - before.rss,
      heapTotal: after.heapTotal - before.heapTotal,
      heapUsed: after.heapUsed - before.heapUsed,
      external: after.external - before.external,
    };
  }
}

// Usage example:
// const comparison = new PerformanceComparison();
// comparison.runFullComparison().then(results => {
//   console.log('Performance test completed!', results);
// });

export default PerformanceComparison;
