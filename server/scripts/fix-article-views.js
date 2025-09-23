#!/usr/bin/env node
'use strict';

/**
 * Standalone script to fix article views
 * Run this from the server directory: node scripts/fix-article-views.js
 */

const path = require('path');

// Set up Strapi context
process.chdir(path.join(__dirname, '..'));

async function fixArticleViews() {
  console.log('🚀 Starting article views fix...');
  
  let strapi;
  
  try {
    // Import and start Strapi
    strapi = require('@strapi/strapi');
    const app = await strapi.createStrapi({ distDir: './dist' }).load();
    
    console.log('✅ Strapi loaded successfully');
    
    // Run the seeding function
    const { seedArticleViews } = require('./seed-views');
    await seedArticleViews();
    
    console.log('🎉 Article views fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing article views:', error);
    process.exit(1);
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
    process.exit(0);
  }
}

// Run the script
fixArticleViews();