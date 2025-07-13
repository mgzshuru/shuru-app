'use client';

import { useState, useEffect } from 'react';
import {
  // Article functions
  getAllArticles,
  getArticleBySlug,
  getFeaturedArticles,
  getArticlesByCategory,
  getArticlesByAuthor,
  getArticlesByNewsletter,
  searchArticles,
  getArticlesPaginated,
  getRelatedArticles,
  getArticleCountByCategory,
  getArticlesByDateRange,
  getArticleWithFullPopulation,
  
  // Category functions
  getAllCategories,
  getCategoryBySlug,
  getRootCategories,
  
  // Author functions
  getAllAuthors,
  getAuthorById,
  
  // Magazine Issue functions
  getAllMagazineIssues,
  getMagazineIssueBySlug,
  getFeaturedMagazineIssues,
  
  // Newsletter functions
  getAllNewsletterEditions,
  getNewsletterEditionBySlug,
  
  // Subscriber functions
  subscribe,
  
  // Page functions
  getAllPages,
  getPageBySlug,
  
  // Search functions
  searchContent
} from '@/lib/strapi-client'; // Adjust import path as needed

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  duration?: number;
}

export default function ArticleTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testInputs, setTestInputs] = useState({
    // Article inputs
    slug: 'sample-article',
    categorySlug: 'technology',
    authorId: '1',
    newsletterId: '1',
    searchTerm: 'strapi',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    
    // Category inputs
    categoryId: '1',
    
    // Magazine inputs
    magazineSlug: 'issue-1',
    
    // Newsletter inputs
    newsletterSlug: 'newsletter-1',
    
    // Subscriber inputs
    email: 'test@example.com',
    subscriberName: 'Test User',
    
    // Page inputs
    pageSlug: 'about',
    
    // Search inputs
    globalSearchTerm: 'technology'
  });

  const updateResult = (name: string, status: 'success' | 'error', data?: any, error?: string, duration?: number) => {
    setResults(prev => prev.map(result => 
      result.name === name 
        ? { ...result, status, data, error, duration }
        : result
    ));
  };

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    const startTime = Date.now();
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      updateResult(testName, 'success', result, undefined, duration);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateResult(testName, 'error', undefined, error.message, duration);
    }
  };

  const initializeTests = () => {
    const testNames = [
      // Article tests
      'getAllArticles',
      'getArticleBySlug (published)',
      'getArticleBySlug (draft)',
      'getFeaturedArticles',
      'getFeaturedArticles (with limit)',
      'getArticlesByCategory',
      'getArticlesByAuthor',
      'getArticlesByNewsletter',
      'searchArticles',
      'getArticlesPaginated',
      'getRelatedArticles',
      'getArticleCountByCategory',
      'getArticlesByDateRange',
      'getArticleWithFullPopulation',
      
      // Category tests
      'getAllCategories',
      'getCategoryBySlug',
      'getRootCategories',
      
      // Author tests
      'getAllAuthors',
      'getAuthorById',
      
      // Magazine Issue tests
      'getAllMagazineIssues',
      'getMagazineIssueBySlug',
      'getFeaturedMagazineIssues',
      'getFeaturedMagazineIssues (with limit)',
      
      // Newsletter tests
      'getAllNewsletterEditions',
      'getNewsletterEditionBySlug',
      
      // Subscriber tests
      'subscribe',
      
      // Page tests
      'getAllPages',
      'getPageBySlug',
      
      // Search tests
      'searchContent (all types)',
      'searchContent (articles only)',
      'searchContent (with limit)'
    ];

    setResults(testNames.map(name => ({ name, status: 'pending' })));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    initializeTests();

    // =====================
    // ARTICLE TESTS
    // =====================
    
    await runTest('getAllArticles', async () => {
      return await getAllArticles();
    });

    await runTest('getArticleBySlug (published)', async () => {
      return await getArticleBySlug(testInputs.slug, 'published');
    });

    await runTest('getArticleBySlug (draft)', async () => {
      return await getArticleBySlug(testInputs.slug, 'draft');
    });

    await runTest('getFeaturedArticles', async () => {
      return await getFeaturedArticles();
    });

    await runTest('getFeaturedArticles (with limit)', async () => {
      return await getFeaturedArticles(5);
    });

    await runTest('getArticlesByCategory', async () => {
      return await getArticlesByCategory(testInputs.categorySlug);
    });

    await runTest('getArticlesByAuthor', async () => {
      return await getArticlesByAuthor(testInputs.authorId);
    });

    await runTest('getArticlesByNewsletter', async () => {
      return await getArticlesByNewsletter(testInputs.newsletterId);
    });

    await runTest('searchArticles', async () => {
      return await searchArticles(testInputs.searchTerm);
    });

    await runTest('getArticlesPaginated', async () => {
      return await getArticlesPaginated(1, 5);
    });

    await runTest('getRelatedArticles', async () => {
      return await getRelatedArticles('1', testInputs.categorySlug, 3);
    });

    await runTest('getArticleCountByCategory', async () => {
      return await getArticleCountByCategory(testInputs.categorySlug);
    });

    await runTest('getArticlesByDateRange', async () => {
      return await getArticlesByDateRange(testInputs.startDate, testInputs.endDate);
    });

    await runTest('getArticleWithFullPopulation', async () => {
      return await getArticleWithFullPopulation(testInputs.slug);
    });

    // =====================
    // CATEGORY TESTS
    // =====================
    
    await runTest('getAllCategories', async () => {
      return await getAllCategories();
    });

    await runTest('getCategoryBySlug', async () => {
      return await getCategoryBySlug(testInputs.categorySlug);
    });

    await runTest('getRootCategories', async () => {
      return await getRootCategories();
    });

    // =====================
    // AUTHOR TESTS
    // =====================
    
    await runTest('getAllAuthors', async () => {
      return await getAllAuthors();
    });

    await runTest('getAuthorById', async () => {
      return await getAuthorById(testInputs.authorId);
    });

    // =====================
    // MAGAZINE ISSUE TESTS
    // =====================
    
    await runTest('getAllMagazineIssues', async () => {
      return await getAllMagazineIssues();
    });

    await runTest('getMagazineIssueBySlug', async () => {
      return await getMagazineIssueBySlug(testInputs.magazineSlug);
    });

    await runTest('getFeaturedMagazineIssues', async () => {
      return await getFeaturedMagazineIssues();
    });

    await runTest('getFeaturedMagazineIssues (with limit)', async () => {
      return await getFeaturedMagazineIssues(3);
    });

    // =====================
    // NEWSLETTER TESTS
    // =====================
    
    await runTest('getAllNewsletterEditions', async () => {
      return await getAllNewsletterEditions();
    });

    await runTest('getNewsletterEditionBySlug', async () => {
      return await getNewsletterEditionBySlug(testInputs.newsletterSlug);
    });

    // =====================
    // SUBSCRIBER TESTS
    // =====================
    
    await runTest('subscribe', async () => {
      return await subscribe(testInputs.email, testInputs.subscriberName);
    });


    // =====================
    // PAGE TESTS
    // =====================
    
    await runTest('getAllPages', async () => {
      return await getAllPages();
    });

    await runTest('getPageBySlug', async () => {
      return await getPageBySlug(testInputs.pageSlug);
    });

    // =====================
    // SEARCH TESTS
    // =====================
    
    await runTest('searchContent (all types)', async () => {
      return await searchContent(testInputs.globalSearchTerm);
    });

    await runTest('searchContent (articles only)', async () => {
      return await searchContent(testInputs.globalSearchTerm, ['articles']);
    });

    await runTest('searchContent (with limit)', async () => {
      return await searchContent(testInputs.globalSearchTerm, undefined, 5);
    });

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  const groupedResults = {
    articles: results.filter(r => r.name.includes('Article') || r.name.includes('search')),
    categories: results.filter(r => r.name.includes('Categories') || r.name.includes('Category')),
    authors: results.filter(r => r.name.includes('Author')),
    magazines: results.filter(r => r.name.includes('Magazine')),
    newsletters: results.filter(r => r.name.includes('Newsletter')),
    subscribers: results.filter(r => r.name.includes('subscribe') || r.name.includes('Subscriber')),
    pages: results.filter(r => r.name.includes('Page')),
    search: results.filter(r => r.name.includes('searchContent'))
  };

  useEffect(() => {
    initializeTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Complete Strapi Functions Test Suite
          </h1>

          {/* Test Inputs Configuration */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Test Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Article Inputs */}
              <div className="space-y-3">
                <h3 className="font-medium text-blue-800">Article Tests</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article Slug</label>
                  <input
                    type="text"
                    value={testInputs.slug}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Slug</label>
                  <input
                    type="text"
                    value={testInputs.categorySlug}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, categorySlug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author ID</label>
                  <input
                    type="text"
                    value={testInputs.authorId}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, authorId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Magazine & Newsletter Inputs */}
              <div className="space-y-3">
                <h3 className="font-medium text-blue-800">Magazine & Newsletter</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Magazine Slug</label>
                  <input
                    type="text"
                    value={testInputs.magazineSlug}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, magazineSlug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter ID</label>
                  <input
                    type="text"
                    value={testInputs.newsletterId}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, newsletterId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Slug</label>
                  <input
                    type="text"
                    value={testInputs.newsletterSlug}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, newsletterSlug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Subscriber Inputs */}
              <div className="space-y-3">
                <h3 className="font-medium text-blue-800">Subscriber Tests</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Email</label>
                  <input
                    type="email"
                    value={testInputs.email}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber Name</label>
                  <input
                    type="text"
                    value={testInputs.subscriberName}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, subscriberName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Slug</label>
                  <input
                    type="text"
                    value={testInputs.pageSlug}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, pageSlug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              {/* Search Inputs */}
              <div className="space-y-3">
                <h3 className="font-medium text-blue-800">Search Tests</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article Search</label>
                  <input
                    type="text"
                    value={testInputs.searchTerm}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Global Search</label>
                  <input
                    type="text"
                    value={testInputs.globalSearchTerm}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, globalSearchTerm: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={testInputs.startDate}
                    onChange={(e) => setTestInputs(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="mb-6">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={`px-6 py-3 rounded-lg font-medium ${
                isRunning
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Running Tests...' : `Run All Tests (${results.length})`}
            </button>
          </div>

          {/* Test Results by Category */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            
            {Object.entries(groupedResults).map(([category, categoryResults]) => (
              categoryResults.length > 0 && (
                <div key={category} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                    {category} Tests ({categoryResults.length})
                  </h3>
                  <div className="space-y-3">
                    {categoryResults.map((result, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getStatusIcon(result.status)}</span>
                            <h4 className="font-medium text-gray-900 text-sm">{result.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                              {result.status}
                            </span>
                          </div>
                          {result.duration && (
                            <span className="text-xs text-gray-500">{result.duration}ms</span>
                          )}
                        </div>

                        {result.error && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs text-red-800">
                              <strong>Error:</strong> {result.error}
                            </p>
                          </div>
                        )}

                        {result.data && (
                          <div className="mt-2">
                            <details className="cursor-pointer">
                              <summary className="text-xs font-medium text-gray-700 hover:text-gray-900">
                                View Response Data
                              </summary>
                              <div className="mt-2 p-2 bg-white border border-gray-200 rounded">
                                <pre className="text-xs text-gray-800 overflow-auto max-h-32">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Summary */}
          {results.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Test Summary</h3>
              <div className="grid grid-cols-3 gap-6 text-center mb-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {results.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">
                    {results.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-600">
                    {results.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
              
              {/* Category breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {Object.entries(groupedResults).map(([category, categoryResults]) => (
                  categoryResults.length > 0 && (
                    <div key={category} className="text-center">
                      <div className="font-medium text-gray-700 capitalize">{category}</div>
                      <div className="text-xs text-gray-500">
                        {categoryResults.filter(r => r.status === 'success').length}/{categoryResults.length} passed
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}