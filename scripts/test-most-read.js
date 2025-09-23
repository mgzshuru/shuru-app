#!/usr/bin/env node
import fetch from 'node-fetch';

// Simple script to test and create some article views for testing
async function testAndSeedViews() {
  try {
    console.log('Testing most-read articles API...');

    // First, test the most-read articles endpoint
    const testResponse = await fetch('http://localhost:3000/api/most-read-articles?limit=5');

    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log(`✅ Most-read API working! Found ${data.data?.length || 0} articles`);

      if (data.data && data.data.length > 0) {
        console.log('Sample articles with views:');
        data.data.slice(0, 3).forEach((article, index) => {
          console.log(`  ${index + 1}. "${article.title}" - ${article.views || 0} views`);
        });
      }
    } else {
      console.log(`❌ Most-read API failed: ${testResponse.status}`);
    }

    // Now test creating some views
    console.log('\nTesting view increment...');

    // Get some articles first
    const articlesResponse = await fetch('http://localhost:1337/api/articles?pagination[limit]=3&fields[0]=documentId&fields[1]=title');

    if (!articlesResponse.ok) {
      console.log(`❌ Failed to fetch articles for testing: ${articlesResponse.status}`);
      return;
    }

    const articlesData = await articlesResponse.json();
    console.log(`Found ${articlesData.data?.length || 0} articles for testing`);

    if (articlesData.data && articlesData.data.length > 0) {
      for (const article of articlesData.data) {
        // Simulate some views for this article
        const viewsToAdd = Math.floor(Math.random() * 10) + 1;
        console.log(`Adding ${viewsToAdd} views to "${article.title}"...`);

        for (let i = 0; i < viewsToAdd; i++) {
          try {
            const incrementResponse = await fetch(`http://localhost:1337/api/articles/${article.documentId}/increment-views`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (i === viewsToAdd - 1) { // Only log the final result
              if (incrementResponse.ok) {
                const result = await incrementResponse.json();
                console.log(`  ✅ Final view count: ${result.views}`);
              } else {
                console.log(`  ❌ Failed to increment views: ${incrementResponse.status}`);
              }
            }
          } catch (err) {
            if (i === viewsToAdd - 1) {
              console.log(`  ❌ Error incrementing views:`, err.message);
            }
          }

          // Small delay between increments
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Delay between articles
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Test the API again to see the results
      console.log('\nTesting most-read API after adding views...');
      const finalTestResponse = await fetch('http://localhost:3000/api/most-read-articles?limit=5');

      if (finalTestResponse.ok) {
        const finalData = await finalTestResponse.json();
        console.log(`✅ Updated results - Found ${finalData.data?.length || 0} articles`);

        if (finalData.data && finalData.data.length > 0) {
          console.log('Articles sorted by views:');
          finalData.data.forEach((article, index) => {
            console.log(`  ${index + 1}. "${article.title}" - ${article.views || 0} views`);
          });
        }
      }
    }

    console.log('\n✅ Testing completed!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the testing function
testAndSeedViews();