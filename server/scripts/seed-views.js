'use strict';

/**
 * Script to seed article views and clean up orphaned records
 */

async function seedArticleViews() {
  console.log('Starting article views cleanup and seeding...');

  try {
    // First, get all articles
    const articles = await strapi.documents('api::article.article').findMany({
      status: 'published'
    });

    console.log(`Found ${articles.length} published articles`);

    // Get all existing article views
    const existingViews = await strapi.db.query('api::article-view.article-view').findMany({
      populate: ['article']
    });

    console.log(`Found ${existingViews.length} existing article views`);

    // Clean up orphaned views (views without valid articles)
    const orphanedViews = [];
    const validViews = [];

    for (const view of existingViews) {
      if (!view.article || !view.article.id) {
        orphanedViews.push(view.id);
      } else {
        // Check if the referenced article still exists
        const articleExists = articles.find(a => a.id === view.article.id);
        if (!articleExists) {
          orphanedViews.push(view.id);
        } else {
          validViews.push(view);
        }
      }
    }

    // Delete orphaned views
    if (orphanedViews.length > 0) {
      console.log(`Deleting ${orphanedViews.length} orphaned article views...`);
      await strapi.db.query('api::article-view.article-view').deleteMany({
        where: {
          id: {
            $in: orphanedViews
          }
        }
      });
    }

    // Create views for articles that don't have them yet
    const articlesWithViews = new Set(validViews.map(v => v.article.id));
    const articlesNeedingViews = articles.filter(article => !articlesWithViews.has(article.id));

    console.log(`Creating views for ${articlesNeedingViews.length} articles...`);

    // Seed some realistic view counts
    const viewsToCreate = [];
    for (const article of articlesNeedingViews) {
      // Generate random view counts (0-100) with some articles having higher counts
      let viewCount = 0;
      const random = Math.random();

      if (random > 0.95) {
        viewCount = Math.floor(Math.random() * 500) + 100; // High traffic articles
      } else if (random > 0.8) {
        viewCount = Math.floor(Math.random() * 100) + 20; // Medium traffic
      } else if (random > 0.5) {
        viewCount = Math.floor(Math.random() * 20) + 1; // Low traffic
      }
      // else viewCount remains 0 for new articles

      viewsToCreate.push({
        article: article.id,
        views: viewCount,
        last_viewed: viewCount > 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null // Random date within last 30 days
      });
    }

    // Create all the views
    for (const viewData of viewsToCreate) {
      await strapi.db.query('api::article-view.article-view').create({
        data: viewData
      });
    }

    console.log(`✅ Article views seeding completed successfully!`);
    console.log(`- Deleted ${orphanedViews.length} orphaned views`);
    console.log(`- Kept ${validViews.length} valid existing views`);
    console.log(`- Created ${viewsToCreate.length} new views`);
    console.log(`- Total articles with views: ${validViews.length + viewsToCreate.length}`);

    // Verify the data
    const finalViews = await strapi.db.query('api::article-view.article-view').findMany({
      populate: ['article']
    });

    const validFinalViews = finalViews.filter(v => v.article && v.article.id);
    console.log(`✅ Verification: ${validFinalViews.length} valid article views in database`);

    if (validFinalViews.length !== finalViews.length) {
      console.warn(`⚠️  Warning: ${finalViews.length - validFinalViews.length} views still have invalid article references`);
    }

  } catch (error) {
    console.error('❌ Error seeding article views:', error);
    throw error;
  }
}

module.exports = { seedArticleViews };

// If run directly
if (require.main === module) {
  console.log('This script should be run from within Strapi context');
  console.log('Use: node scripts/seed-views.js from the server directory with Strapi running');
}