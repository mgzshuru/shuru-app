"use client"
import { useState } from 'react';
import { Send } from 'lucide-react';
import { submitToNewsletter } from '@/lib/strapi-client';

// Define the type for the data prop
interface NewsletterData {
  header: {
    label: string;
    title: string;
    description: string;
  };
  form: {
    emailPlaceholder: string;
    submitButton: { text: string };
  };
  messages: {
    success: string;
    privacy: string;
  };
}

export const Newsletter = ({ data }: { data: NewsletterData }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await submitToNewsletter(email);
      console.log(result, "result")
      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        // Handle specific error messages in Arabic
        if (result.error === 'Email already subscribed to newsletter') {
          setErrorMessage('هذا البريد الإلكتروني مشترك بالفعل في النشرة الإخبارية');
        } else {
          setErrorMessage('فشل في الاشتراك. يرجى المحاولة مرة أخرى.');
        }
      }
    } catch (error) {
      setErrorMessage('حدث خطأ ما. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-16">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            {data.header.label}
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-8">
            {data.header.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {data.header.description}
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-12">
          <div className="space-y-6">
            <input
              type="email"
              placeholder={data.form.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 border-2 border-gray-300 text-right focus:border-[#808080] focus:outline-none text-lg disabled:opacity-50"
              dir="rtl"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#808080] hover:bg-[#A9A9A9] text-white px-10 py-5 font-black text-sm uppercase tracking-[0.2em] transition-colors flex items-center justify-center space-x-4 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span>{isLoading ? 'جاري الإرسال...' : data.form.submitButton.text}</span>
            </button>
          </div>
        </form>
        
        {isSubscribed && (
          <div className="mb-12 p-6 bg-green-50 border-2 border-green-200 max-w-md mx-auto">
            <p className="text-green-800">{data.messages.success}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-12 p-6 bg-red-50 border-2 border-red-200 max-w-md mx-auto">
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-500">
          {data.messages.privacy}
        </p>
      </div>
    </section>
  );
};