#!/usr/bin/env node

/**
 * Enhanced SEO Testing Script for Shuru Magazine
 *
 * Tests comprehensive SEO metadata across all page types
 * Usage: node scripts/seo-validator.js [url]
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Test URLs
const TEST_URLS = [
  '/',
  '/articles',
  '/categories',
  '/magazine',
  // Add specific article/category URLs when available
];

/**
 * Comprehensive SEO validation for Arabic content
 */
async function validateSEO(url) {
  console.log(`\n🔍 Testing SEO for: ${url}`);
  console.log('='.repeat(80));

  try {
    const html = await fetchHTML(url);
    const metadata = extractMetadata(html);

    // Display results
    displayResults(metadata, url);

    // Validate and score
    const score = validateMetadata(metadata);

    return { url, score, metadata };
  } catch (error) {
    console.error(`❌ Error testing ${url}:`, error.message);
    return { url, score: 0, error: error.message };
  }
}

/**
 * Fetch HTML content from URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let html = '';
      res.on('data', (chunk) => html += chunk);
      res.on('end', () => resolve(html));
    });

    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Extract comprehensive metadata from HTML
 */
function extractMetadata(html) {
  const metadata = {};

  // Basic meta tags
  metadata.title = extractTag(html, '<title>(.*?)</title>');
  metadata.description = extractTag(html, '<meta name="description" content="(.*?)"');
  metadata.keywords = extractTag(html, '<meta name="keywords" content="(.*?)"');
  metadata.canonical = extractTag(html, '<link rel="canonical" href="(.*?)"');

  // Language and direction
  metadata.lang = extractTag(html, '<html[^>]*lang="([^"]*)"');
  metadata.dir = extractTag(html, '<html[^>]*dir="([^"]*)"') || extractTag(html, 'dir="([^"]*)"');

  // Open Graph
  metadata.ogTitle = extractTag(html, '<meta property="og:title" content="(.*?)"');
  metadata.ogDescription = extractTag(html, '<meta property="og:description" content="(.*?)"');
  metadata.ogImage = extractTag(html, '<meta property="og:image" content="(.*?)"');
  metadata.ogType = extractTag(html, '<meta property="og:type" content="(.*?)"');
  metadata.ogUrl = extractTag(html, '<meta property="og:url" content="(.*?)"');
  metadata.ogSiteName = extractTag(html, '<meta property="og:site_name" content="(.*?)"');
  metadata.ogLocale = extractTag(html, '<meta property="og:locale" content="(.*?)"');

  // Twitter Cards
  metadata.twitterCard = extractTag(html, '<meta name="twitter:card" content="(.*?)"');
  metadata.twitterTitle = extractTag(html, '<meta name="twitter:title" content="(.*?)"');
  metadata.twitterDescription = extractTag(html, '<meta name="twitter:description" content="(.*?)"');
  metadata.twitterImage = extractTag(html, '<meta name="twitter:image" content="(.*?)"');
  metadata.twitterCreator = extractTag(html, '<meta name="twitter:creator" content="(.*?)"');
  metadata.twitterSite = extractTag(html, '<meta name="twitter:site" content="(.*?)"');

  // Article specific (if applicable)
  metadata.articleAuthor = extractTag(html, '<meta property="article:author" content="(.*?)"');
  metadata.articleSection = extractTag(html, '<meta property="article:section" content="(.*?)"');
  metadata.articlePublishedTime = extractTag(html, '<meta property="article:published_time" content="(.*?)"');
  metadata.articleModifiedTime = extractTag(html, '<meta property="article:modified_time" content="(.*?)"');

  // Structured data
  metadata.hasArticleSchema = html.includes('"@type":"Article"');
  metadata.hasWebPageSchema = html.includes('"@type":"WebPage"');
  metadata.hasBreadcrumbSchema = html.includes('"@type":"BreadcrumbList"');
  metadata.hasOrganizationSchema = html.includes('"@type":"Organization"');

  // Robots
  metadata.robots = extractTag(html, '<meta name="robots" content="(.*?)"');

  // Performance indicators
  metadata.hasMetadataBase = html.includes('<base href=') || html.includes('metadataBase');

  return metadata;
}

/**
 * Extract content using regex
 */
function extractTag(html, pattern) {
  const match = html.match(new RegExp(pattern, 'i'));
  return match ? match[1].trim() : null;
}

/**
 * Display formatted results
 */
function displayResults(metadata, url) {
  console.log('📋 BASIC METADATA');
  console.log('-'.repeat(40));
  console.log(`Title: ${metadata.title || '❌ Missing'}`);
  console.log(`Description: ${metadata.description || '❌ Missing'}`);
  console.log(`Keywords: ${metadata.keywords || '⚠️  Not set'}`);
  console.log(`Canonical: ${metadata.canonical || '❌ Missing'}`);
  console.log(`Language: ${metadata.lang || '⚠️  Not set'}`);
  console.log(`Direction: ${metadata.dir || '⚠️  Not set'}`);

  console.log('\n📱 OPEN GRAPH (Social Media)');
  console.log('-'.repeat(40));
  console.log(`OG Title: ${metadata.ogTitle || '❌ Missing'}`);
  console.log(`OG Description: ${metadata.ogDescription || '❌ Missing'}`);
  console.log(`OG Image: ${metadata.ogImage || '❌ Missing'}`);
  console.log(`OG Type: ${metadata.ogType || '❌ Missing'}`);
  console.log(`OG URL: ${metadata.ogUrl || '❌ Missing'}`);
  console.log(`OG Site Name: ${metadata.ogSiteName || '⚠️  Not set'}`);
  console.log(`OG Locale: ${metadata.ogLocale || '⚠️  Not set'}`);

  console.log('\n🐦 TWITTER CARDS');
  console.log('-'.repeat(40));
  console.log(`Card Type: ${metadata.twitterCard || '❌ Missing'}`);
  console.log(`Twitter Title: ${metadata.twitterTitle || '❌ Missing'}`);
  console.log(`Twitter Description: ${metadata.twitterDescription || '❌ Missing'}`);
  console.log(`Twitter Image: ${metadata.twitterImage || '❌ Missing'}`);
  console.log(`Twitter Creator: ${metadata.twitterCreator || '⚠️  Not set'}`);
  console.log(`Twitter Site: ${metadata.twitterSite || '⚠️  Not set'}`);

  console.log('\n📄 ARTICLE METADATA');
  console.log('-'.repeat(40));
  console.log(`Author: ${metadata.articleAuthor || 'N/A'}`);
  console.log(`Section: ${metadata.articleSection || 'N/A'}`);
  console.log(`Published: ${metadata.articlePublishedTime || 'N/A'}`);
  console.log(`Modified: ${metadata.articleModifiedTime || 'N/A'}`);

  console.log('\n🏗️ STRUCTURED DATA');
  console.log('-'.repeat(40));
  console.log(`Article Schema: ${metadata.hasArticleSchema ? '✅ Found' : 'N/A'}`);
  console.log(`WebPage Schema: ${metadata.hasWebPageSchema ? '✅ Found' : 'N/A'}`);
  console.log(`Breadcrumb Schema: ${metadata.hasBreadcrumbSchema ? '✅ Found' : '❌ Missing'}`);
  console.log(`Organization Schema: ${metadata.hasOrganizationSchema ? '✅ Found' : '⚠️  Not found'}`);

  console.log('\n⚙️ TECHNICAL SEO');
  console.log('-'.repeat(40));
  console.log(`Robots: ${metadata.robots || '⚠️  Not set'}`);
  console.log(`Metadata Base: ${metadata.hasMetadataBase ? '✅ Configured' : '⚠️  Check configuration'}`);
}

/**
 * Validate metadata and return score
 */
function validateMetadata(metadata) {
  const checks = [];
  let score = 0;
  const maxScore = 20;

  // Critical checks (2 points each)
  if (metadata.title) { score += 2; checks.push('✅ Title present'); }
  else checks.push('❌ Missing title');

  if (metadata.description) { score += 2; checks.push('✅ Description present'); }
  else checks.push('❌ Missing description');

  if (metadata.ogTitle) { score += 2; checks.push('✅ OG title present'); }
  else checks.push('❌ Missing OG title');

  if (metadata.ogDescription) { score += 2; checks.push('✅ OG description present'); }
  else checks.push('❌ Missing OG description');

  if (metadata.ogImage) { score += 2; checks.push('✅ OG image present'); }
  else checks.push('❌ Missing OG image');

  // Important checks (1 point each)
  if (metadata.canonical) { score += 1; checks.push('✅ Canonical URL set'); }
  else checks.push('⚠️  Missing canonical URL');

  if (metadata.twitterCard) { score += 1; checks.push('✅ Twitter card configured'); }
  else checks.push('⚠️  Missing Twitter card');

  if (metadata.dir === 'rtl') { score += 1; checks.push('✅ RTL direction set'); }
  else checks.push('⚠️  RTL direction not set');

  if (metadata.ogLocale && metadata.ogLocale.includes('ar')) { score += 1; checks.push('✅ Arabic locale set'); }
  else checks.push('⚠️  Arabic locale not set');

  if (metadata.hasBreadcrumbSchema) { score += 1; checks.push('✅ Breadcrumb schema found'); }
  else checks.push('⚠️  No breadcrumb schema');

  // Quality checks
  if (metadata.title && metadata.title.length > 60) {
    checks.push('⚠️  Title too long (>60 chars)');
  }

  if (metadata.description && metadata.description.length > 160) {
    checks.push('⚠️  Description too long (>160 chars)');
  }

  console.log('\n🔍 SEO VALIDATION');
  console.log('-'.repeat(40));
  checks.forEach(check => console.log(check));

  const percentage = Math.round((score / maxScore) * 100);
  console.log(`\n📊 SEO Score: ${score}/${maxScore} (${percentage}%)`);

  if (percentage >= 90) console.log('🏆 Excellent SEO implementation!');
  else if (percentage >= 70) console.log('👍 Good SEO, with room for improvement');
  else if (percentage >= 50) console.log('⚠️  SEO needs improvement');
  else console.log('❌ Critical SEO issues need attention');

  return percentage;
}

/**
 * Test multiple URLs and generate report
 */
async function runFullSEOAudit() {
  console.log('🚀 Starting comprehensive SEO audit for Shuru Magazine');
  console.log('='.repeat(80));

  const results = [];

  for (const path of TEST_URLS) {
    const url = BASE_URL + path;
    const result = await validateSEO(url);
    results.push(result);

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary report
  console.log('\n📊 SEO AUDIT SUMMARY');
  console.log('='.repeat(80));

  results.forEach(result => {
    const status = result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌';
    console.log(`${status} ${result.url}: ${result.score}%`);
  });

  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  console.log(`\n🎯 Average SEO Score: ${Math.round(averageScore)}%`);
}

/**
 * Main execution
 */
async function main() {
  const url = process.argv[2];

  if (url) {
    // Test single URL
    await validateSEO(url);
  } else {
    // Run full audit
    await runFullSEOAudit();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateSEO, runFullSEOAudit };
