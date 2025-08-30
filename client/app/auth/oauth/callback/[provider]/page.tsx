"use client";

import { useEffect } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { createSession } from '@/lib/session';
import { getStrapiURL } from '@/lib/utils';

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const provider = params.provider as string;

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error(`OAuth ${provider} error:`, error);
        router.push(`/auth/login?error=${encodeURIComponent('Authentication failed')}`);
        return;
      }

      if (!code) {
        console.error(`No authorization code received from ${provider}`);
        router.push(`/auth/login?error=${encodeURIComponent('No authorization code received')}`);
        return;
      }

      try {
        // Exchange code for tokens with Strapi
        const strapiUrl = getStrapiURL();
        const response = await fetch(`/api/auth/oauth/callback/${provider}?code=${code}`);

        if (!response.ok) {
          throw new Error(`OAuth ${provider} callback failed`);
        }

        // Get redirect destination from localStorage or default to profile
        const redirectTo = localStorage.getItem('oauth_redirect_to') || '/profile';
        localStorage.removeItem('oauth_redirect_to');

        // Redirect to intended destination
        router.push(redirectTo);

      } catch (error) {
        console.error(`OAuth ${provider} callback error:`, error);
        router.push(`/auth/login?error=${encodeURIComponent('Authentication failed')}`);
      }
    };

    handleCallback();
  }, [searchParams, provider, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
}
