#!/usr/bin/env node

/**
 * SEO Metadata Test Script
 *
 * This script helps test the metadata generation for articles
 * Usage: node scripts/test-seo.js [article-slug]
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ARTICLE_SLUG = process.argv[2] || 'sample-article';

/**
 * Fetch HTML content and extract metadata
 */
async function testArticleMetadata(slug) {
  const url = `${BASE_URL}/articles/${slug}`;

  console.log(`🔍 Testing SEO metadata for: ${url}`);
  console.log('=' .repeat(60));

  try {
    const html = await fetchHTML(url);

    // Extract metadata
    const metadata = extractMetadata(html);

    // Display results
    displayResults(metadata);

    // Validate
    validateMetadata(metadata);

  } catch (error) {
    console.error('❌ Error testing metadata:', error.message);
  }
}

/**
 * Fetch HTML content from URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Extract metadata from HTML
 */
function extractMetadata(html) {
  const metadata = {};

  // Basic meta tags
  metadata.title = extractTag(html, '<title>(.*?)</title>');
  metadata.description = extractTag(html, '<meta name="description" content="(.*?)"');
  metadata.keywords = extractTag(html, '<meta name="keywords" content="(.*?)"');

  // Open Graph
  metadata.ogTitle = extractTag(html, '<meta property="og:title" content="(.*?)"');
  metadata.ogDescription = extractTag(html, '<meta property="og:description" content="(.*?)"');
  metadata.ogImage = extractTag(html, '<meta property="og:image" content="(.*?)"');
  metadata.ogType = extractTag(html, '<meta property="og:type" content="(.*?)"');
  metadata.ogUrl = extractTag(html, '<meta property="og:url" content="(.*?)"');

  // Twitter
  metadata.twitterCard = extractTag(html, '<meta name="twitter:card" content="(.*?)"');
  metadata.twitterTitle = extractTag(html, '<meta name="twitter:title" content="(.*?)"');
  metadata.twitterDescription = extractTag(html, '<meta name="twitter:description" content="(.*?)"');

  // Article specific
  metadata.articleAuthor = extractTag(html, '<meta property="article:author" content="(.*?)"');
  metadata.articleSection = extractTag(html, '<meta property="article:section" content="(.*?)"');
  metadata.articlePublishedTime = extractTag(html, '<meta property="article:published_time" content="(.*?)"');

  // Structured data
  metadata.hasStructuredData = html.includes('"@type":"Article"');
  metadata.hasBreadcrumbs = html.includes('"@type":"BreadcrumbList"');

  return metadata;
}

/**
 * Extract content from HTML using regex
 */
function extractTag(html, pattern) {
  const match = html.match(new RegExp(pattern, 'i'));
  return match ? match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&') : null;
}

/**
 * Display extracted metadata
 */
function displayResults(metadata) {
  console.log('📋 BASIC METADATA');
  console.log('-'.repeat(40));
  console.log(`Title: ${metadata.title || 'Not found'}`);
  console.log(`Description: ${metadata.description || 'Not found'}`);
  console.log(`Keywords: ${metadata.keywords || 'Not found'}`);

  console.log('\n📱 OPEN GRAPH (Social Sharing)');
  console.log('-'.repeat(40));
  console.log(`OG Title: ${metadata.ogTitle || 'Not found'}`);
  console.log(`OG Description: ${metadata.ogDescription || 'Not found'}`);
  console.log(`OG Image: ${metadata.ogImage || 'Not found'}`);
  console.log(`OG Type: ${metadata.ogType || 'Not found'}`);
  console.log(`OG URL: ${metadata.ogUrl || 'Not found'}`);

  console.log('\n🐦 TWITTER CARDS');
  console.log('-'.repeat(40));
  console.log(`Twitter Card: ${metadata.twitterCard || 'Not found'}`);
  console.log(`Twitter Title: ${metadata.twitterTitle || 'Not found'}`);
  console.log(`Twitter Description: ${metadata.twitterDescription || 'Not found'}`);

  console.log('\n📄 ARTICLE METADATA');
  console.log('-'.repeat(40));
  console.log(`Author: ${metadata.articleAuthor || 'Not found'}`);
  console.log(`Section: ${metadata.articleSection || 'Not found'}`);
  console.log(`Published: ${metadata.articlePublishedTime || 'Not found'}`);

  console.log('\n🏗️ STRUCTURED DATA');
  console.log('-'.repeat(40));
  console.log(`Article Schema: ${metadata.hasStructuredData ? '✅ Found' : '❌ Missing'}`);
  console.log(`Breadcrumbs: ${metadata.hasBreadcrumbs ? '✅ Found' : '❌ Missing'}`);
}

/**
 * Validate metadata for SEO best practices
 */
function validateMetadata(metadata) {
  console.log('\n🔍 SEO VALIDATION');
  console.log('-'.repeat(40));

  const issues = [];
  const warnings = [];

  // Critical issues
  if (!metadata.title) issues.push('Missing page title');
  if (!metadata.description) issues.push('Missing meta description');
  if (!metadata.ogTitle) issues.push('Missing Open Graph title');
  if (!metadata.ogDescription) issues.push('Missing Open Graph description');
  if (!metadata.ogImage) issues.push('Missing Open Graph image');

  // Warnings
  if (metadata.title && metadata.title.length > 60) {
    warnings.push(`Title too long (${metadata.title.length} chars, recommended: 50-60)`);
  }
  if (metadata.description && metadata.description.length > 160) {
    warnings.push(`Description too long (${metadata.description.length} chars, recommended: 150-160)`);
  }
  if (metadata.ogType !== 'article') {
    warnings.push('Open Graph type should be "article" for article pages');
  }
  if (!metadata.hasStructuredData) {
    warnings.push('Missing Article structured data');
  }

  // Display results
  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ All SEO checks passed!');
  } else {
    if (issues.length > 0) {
      console.log('❌ Critical Issues:');
      issues.forEach(issue => console.log(`   • ${issue}`));
    }

    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(warning => console.log(`   • ${warning}`));
    }
  }

  // SEO Score
  const totalChecks = 10;
  const passedChecks = totalChecks - issues.length - (warnings.length * 0.5);
  const score = Math.round((passedChecks / totalChecks) * 100);

  console.log(`\n📊 SEO Score: ${score}%`);

  if (score >= 90) console.log('🏆 Excellent SEO implementation!');
  else if (score >= 70) console.log('👍 Good SEO, with room for improvement');
  else console.log('⚠️  SEO needs attention');
}

/**
 * Display usage information
 */
function showUsage() {
  console.log('Usage: node scripts/test-seo.js [article-slug]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/test-seo.js my-article-slug');
  console.log('  node scripts/test-seo.js latest-news');
  console.log('');
  console.log('Environment Variables:');
  console.log('  NEXT_PUBLIC_SITE_URL - Your site URL (default: http://localhost:3000)');
}

// Main execution
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showUsage();
} else {
  testArticleMetadata(ARTICLE_SLUG);
}
