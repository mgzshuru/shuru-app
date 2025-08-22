'use client'
import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { subscribe } from '@/lib/strapi-client';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'sidebar' | 'inline';
  className?: string;
}

export default function NewsletterSignup({
  title = "اشترك في النشرة الإخبارية",
  description = "احصل على أحدث المقالات والتحديثات مباشرة في بريدك الإلكتروني",
  variant = 'default',
  className = ""
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

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

    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Submit to both services in parallel
      const [strapiResult, listmonkResult] = await Promise.allSettled([
        // Submit to Strapi
        subscribe(email, name || 'مشترك'),
        // Submit to Listmonk newsletter service
        submitToListmonk(email, name || 'مشترك')
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
        setError('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.');
        console.error('Both subscription methods failed');
        console.error('Strapi result:', strapiResult);
        console.error('Listmonk result:', listmonkResult);
      }
    } catch (error) {
      console.error('Error during subscription:', error);
      setError('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`text-center p-6 ${className}`}>
        <div className="relative inline-block">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-100 animate-ping rounded-full"></div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2">تم الاشتراك بنجاح!</h3>
        <p className="text-sm text-gray-600">
          شكراً لك. ستصلك أحدث النشرات قريباً في صندوق الوارد.
        </p>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 lg:p-8 ${className}`}>
        <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-right">{title}</h3>
        <p className="text-gray-200 mb-4 lg:mb-6 leading-relaxed text-right text-sm lg:text-base">
          {description}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            className="w-full px-3 lg:px-4 py-2 lg:py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white/50 outline-none text-right text-sm lg:text-base"
            dir="rtl"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم (اختياري)"
            className="w-full px-3 lg:px-4 py-2 lg:py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white/50 outline-none text-right text-sm lg:text-base"
            dir="rtl"
          />
          {error && (
            <p className="text-red-300 text-sm text-right">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-gray-700 font-semibold py-2 lg:py-3 px-3 lg:px-4 hover:bg-gray-50 transition-colors text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الاشتراك...' : 'اشترك الآن'}
          </button>
        </form>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 md:p-8 ${className}`}>
        <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-right">{title}</h3>
        <p className="text-gray-200 mb-4 md:mb-6 leading-relaxed text-right text-sm md:text-base">
          {description}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            className="w-full px-3 md:px-4 py-2 md:py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white/50 outline-none text-right text-sm md:text-base"
            dir="rtl"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم (اختياري)"
            className="w-full px-3 md:px-4 py-2 md:py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white/50 outline-none text-right text-sm md:text-base"
            dir="rtl"
          />
          {error && (
            <p className="text-red-300 text-sm text-right">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-gray-700 font-semibold py-2 md:py-3 px-3 md:px-4 hover:bg-gray-50 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الاشتراك...' : 'اشترك الآن'}
          </button>
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white p-6 border border-gray-200 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-black mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-400 text-right"
            placeholder="البريد الإلكتروني *"
            required
            dir="rtl"
          />
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-400 text-right"
          placeholder="الاسم (اختياري)"
          dir="rtl"
        />

        {error && (
          <p className="text-red-500 text-sm text-right">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'جاري الاشتراك...' : 'اشترك الآن'}
        </button>
      </form>
    </div>
  );
}
