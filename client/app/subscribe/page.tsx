'use client'
import React, { useState, useEffect } from 'react';
import { Mail, User, TrendingUp, CheckCircle } from 'lucide-react';
import { subscribe } from '@/lib/strapi-client';
import { getNewsletterPageCached } from '@/lib/strapi-optimized';
import { NewsletterPageData } from '@/lib/types';
import { renderLucideIcon, getIconName } from '@/lib/icon-utils';

const NewsletterPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newsletterData, setNewsletterData] = useState<NewsletterPageData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Utility function to strip HTML tags for preview text
  const stripHtml = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  // Fetch newsletter page data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNewsletterPageCached();
        setNewsletterData(data);
      } catch (error) {
        console.error('Error fetching newsletter data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (email && name) {
      setIsLoading(true);
      try {
        // Submit to both services in parallel
        const [strapiResult, listmonkResult] = await Promise.allSettled([
          // Submit to Strapi
          subscribe(email, name),
          // Submit to Listmonk newsletter service
          submitToListmonk(email, name)
        ]);

        // Check if at least one submission was successful
        const strapiSuccess = strapiResult.status === 'fulfilled' && strapiResult.value.success;
        const listmonkSuccess = listmonkResult.status === 'fulfilled';

        if (strapiSuccess || listmonkSuccess) {
          setIsSubmitted(true);
          setEmail('');
          setName('');
          setTimeout(() => setIsSubmitted(false), 3000);
        } else {
          console.error('Both subscription methods failed');
          console.error('Strapi result:', strapiResult);
          console.error('Listmonk result:', listmonkResult);
        }
      } catch (error) {
        console.error('Error during subscription:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Function to submit to Listmonk newsletter service
  const submitToListmonk = async (email: string, name: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('l', '0cf26f9c-5527-4c4d-b2de-99c85ecaf706'); // Shuru list ID

    const response = await fetch('https://newsletter.shuru.sa/subscription/form', {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Required for cross-origin requests to external domains
    });

    // Note: With no-cors mode, we can't read the response, so we assume success if no error is thrown
    return response;
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Get data with fallbacks
  const heroData = newsletterData?.heroSection;
  const subscriptionData = newsletterData?.subscriptionSection;
  const newsletterCategories = heroData?.newsletterCategories || [];
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Section - Mobile Optimized */}
      {heroData && (
        <section className="relative overflow-hidden" style={{ backgroundColor: heroData?.backgroundColor || '#ff6b5a' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-black mb-3 sm:mb-4 tracking-tight uppercase leading-tight px-2">
                {heroData?.title || ''}
              </h1>
            <p className="text-sm sm:text-base text-white mb-6 sm:mb-8 max-w-2xl mx-auto font-normal px-4">
              {heroData?.subtitle || 'كتشف وجهات نظر جديدة. اشترك للحصول على أهم التغطيات الإخبارية في صندوق الوارد الخاص بك.'}
            </p>            {/* Newsletter Preview Cards - Mobile Responsive */}
            {newsletterCategories.length > 0 && (
              <div className="flex justify-center items-end gap-1 sm:gap-2 md:gap-3 mt-4 sm:mt-6 px-2 overflow-x-auto sm:overflow-x-visible pb-2">
                {newsletterCategories.slice(0, 5).map((newsletter, index) => (
                  <div
                    key={index}
                    className={`
                      flex-shrink-0 w-14 sm:w-16 md:w-20 lg:w-24 xl:w-28
                      h-20 sm:h-24 md:h-32 lg:h-36 xl:h-40 bg-white
                      transform transition-all duration-300 hover:scale-105
                      ${index === 2 ? 'scale-105 sm:scale-110 z-10 -rotate-1 sm:-rotate-2' : ''}
                      ${index === 1 ? 'scale-100 sm:scale-105 rotate-0.5 sm:rotate-1' : ''}
                      ${index === 3 ? 'scale-100 sm:scale-105 -rotate-0.5 sm:-rotate-1' : ''}
                      ${index === 0 ? 'rotate-1 sm:rotate-2' : ''}
                      ${index === 4 ? '-rotate-1 sm:-rotate-2' : ''}
                    `}
                    style={{
                      transform: `
                        translateY(${index === 2 ? '0px' : index === 1 || index === 3 ? '2px' : '4px'})
                        scale(${index === 2 ? '1.05' : index === 1 || index === 3 ? '1.02' : '1'})
                        rotate(${index === 0 ? '1deg' : index === 1 ? '0.5deg' : index === 2 ? '-1deg' : index === 3 ? '-0.5deg' : '-1deg'})
                      `,
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div className="p-1 sm:p-1.5 md:p-2 h-full flex flex-col">
                      {/* Header with browser chrome */}
                      <div className="flex items-center gap-0.5 mb-0.5 sm:mb-1 md:mb-2">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-red-400 rounded-full"></div>
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-yellow-400 rounded-full"></div>
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-green-400 rounded-full"></div>
                      </div>

                      {/* Newsletter name */}
                      <h3 className="font-bold text-gray-800 mb-0.5 sm:mb-1 md:mb-1.5 text-xs sm:text-xs md:text-xs uppercase tracking-wide leading-tight" style={{ fontSize: '8px' }}>
                        {newsletter.name}
                      </h3>

                      {/* Content preview */}
                      <div className="space-y-1 sm:space-y-1.5 md:space-y-2 mb-1 sm:mb-2 md:mb-3 flex-1">
                        {/* Main content header */}
                        <div className="h-3 sm:h-4 md:h-5 lg:h-6 bg-gray-300 rounded-none mb-2"></div>

                        {newsletter.content ? (
                          <div className="text-xs text-gray-600 leading-tight">
                            <div className="text-xs leading-tight mb-2 hidden sm:block">
                              {stripHtml(newsletter.content).substring(0, 50)}...
                            </div>
                            {/* Content lines */}
                            <div className="space-y-1">
                              <div className="h-1 sm:h-1.5 bg-gray-200 rounded-none"></div>
                              <div className="h-1 sm:h-1.5 bg-gray-200 rounded-none w-3/4"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="h-1 sm:h-1.5 bg-gray-200 rounded-none"></div>
                            <div className="h-1 sm:h-1.5 bg-gray-200 rounded-none w-3/4"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </section>
      )}

      {/* Subscription Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 lg:py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* Form Section - Full Width */}
            <div className="relative w-full">

              {isSubmitted ? (
                <div className="bg-white p-6 sm:p-8 text-center rounded-none" style={{ border: '1px solid #e5e7eb' }}>
                  <div className="relative">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4 sm:mb-6" />
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-100 animate-ping"></div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                    {subscriptionData?.successTitle || 'تم الاشتراك بنجاح!'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                    {subscriptionData?.successMessage || 'شكراً لك. ستصلك أحدث النشرات قريباً في صندوق الوارد.'}
                  </p>

                  {/* Success decoration */}
                  <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-green-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 sm:p-8 relative overflow-hidden rounded-none" style={{ border: '1px solid #e5e7eb' }}>
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-gray-50 to-transparent -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>

                  <div className="relative">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-black mb-3 sm:mb-4">
                        <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        {subscriptionData?.formTitle || 'انضم إلى مجتمعنا'}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 px-2">
                        {subscriptionData?.formSubtitle || 'احصل على أحدث الأخبار والتحليلات'}
                      </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      {/* Email Input - Mobile Optimized */}
                      <div className="relative">
                        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-3 sm:py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-sm sm:text-base transition-all duration-200 bg-gray-50 focus:bg-white rounded-none"
                          placeholder={subscriptionData?.emailPlaceholder || "البريد الإلكتروني *"}
                          required
                          style={{ border: '1px solid #e5e7eb' }}
                        />
                      </div>

                      {/* Name Input - Mobile Optimized */}
                      <div className="relative">
                        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-3 sm:py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-sm sm:text-base transition-all duration-200 bg-gray-50 focus:bg-white rounded-none"
                          placeholder={subscriptionData?.namePlaceholder || "الاسم *"}
                          required
                          style={{ border: '1px solid #e5e7eb' }}
                        />
                      </div>

                      {/* Submit Button - Mobile Optimized */}
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading || !email || !name}
                        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none rounded-none touch-manipulation"
                      >
                        {isLoading
                          ? (subscriptionData?.loadingText || 'جاري الاشتراك...')
                          : (subscriptionData?.submitButtonText || 'اشترك الآن')
                        }
                      </button>

                      {/* Privacy Notice - Mobile Optimized */}
                      <div className="text-xs text-gray-500 leading-relaxed text-center bg-gray-50 p-3 sm:p-4 rounded-none">
                        {subscriptionData?.privacyPolicyUrl && (
                          <a
                            href={subscriptionData.privacyPolicyUrl}
                            className="text-gray-800 hover:text-black mx-1 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {subscriptionData?.privacyPolicyText || 'سياسة الخصوصية'}
                          </a>
                        )}
                        {subscriptionData?.termsOfServiceUrl && (
                          <a
                            href={subscriptionData.termsOfServiceUrl}
                            className="text-gray-800 hover:text-black mx-1 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {subscriptionData?.termsOfServiceText || 'شروط الخدمة'}
                          </a>
                        )}
                      </div>

                      {/* Features - Mobile Optimized */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                        {subscriptionData?.features && subscriptionData.features.length > 0 ? (
                          subscriptionData.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 justify-center sm:justify-start">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {renderLucideIcon(getIconName(feature.icon), 14, "text-gray-600") || (
                                  <span className="text-xs sm:text-sm">{feature.icon}</span>
                                )}
                              </div>
                              <span className="text-xs sm:text-xs text-gray-600">{feature.text}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-center space-x-2 justify-center sm:justify-start">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                              </div>
                              <span className="text-xs sm:text-xs text-gray-600">محتوى حصري</span>
                            </div>
                            <div className="flex items-center space-x-2 justify-center sm:justify-start">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                              </div>
                              <span className="text-xs sm:text-xs text-gray-600">أسبوعياً</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsletterPage;
