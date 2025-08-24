'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getStrapiURL } from '@/lib/utils';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [isProcessing, setIsProcessing] = useState(false);
  const confirmation = searchParams.get('confirmation');

  const confirmEmail = useCallback(async (confirmationCode: string) => {
    if (isProcessing) return; // Prevent multiple calls

    setIsProcessing(true);

    try {
      const baseUrl = getStrapiURL();
      const fullUrl = `${baseUrl}/api/auth/email-confirmation?confirmation=${confirmationCode}`;

      console.log('Confirming email with URL:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include', // Include credentials for CORS
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'manual', // Handle redirects manually
      });

      console.log('Response status:', response.status);
      console.log('Response type:', response.type);

      // Handle different response scenarios
      if (response.status >= 200 && response.status < 300) {
        // Success response
        console.log('Email confirmed successfully');
        setStatus('success');
        setTimeout(() => {
          router.push('/auth/login?confirmed=true');
        }, 3000);
      } else if (response.status === 302) {
        // Redirect response - Strapi's default behavior for successful confirmation
        console.log('Email confirmed successfully (redirect response)');
        setStatus('success');
        setTimeout(() => {
          router.push('/auth/login?confirmed=true');
        }, 3000);
      } else {
        // Error response
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
        } catch (jsonError) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}`;
          } catch (textError) {
            errorMessage = `HTTP ${response.status}`;
          }
        }
        console.error('Error response:', response.status, errorMessage);
        setStatus('error');
      }
    } catch (error) {
      console.error('Network/Fetch error:', error);
      // Check if it's a CORS error or network error
      if (error instanceof Error && error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Possible CORS error or network issue');
      }
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, router]);

  useEffect(() => {
    if (confirmation) {
      confirmEmail(confirmation);
    } else {
      setStatus('error');
    }
  }, [confirmation, confirmEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              تأكيد البريد الإلكتروني
            </CardTitle>
            <CardDescription className="text-gray-600">
              {status === 'confirming'
                ? 'يرجى الانتظار بينما نقوم بتأكيد بريدك الإلكتروني'
                : status === 'success'
                ? 'تم تأكيد بريدك الإلكتروني بنجاح'
                : 'فشل في تأكيد البريد الإلكتروني'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'confirming' && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-700">جاري تأكيد بريدك الإلكتروني...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <div className="space-y-2">
                  <p className="text-green-700 font-semibold">تم تأكيد البريد الإلكتروني بنجاح!</p>
                  <p className="text-gray-600">سيتم توجيهك إلى صفحة تسجيل الدخول خلال ثوانٍ قليلة...</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/auth/login?confirmed=true">
                    الانتقال إلى تسجيل الدخول
                  </Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                <div className="space-y-2">
                  <p className="text-red-700 font-semibold">فشل في تأكيد البريد الإلكتروني</p>
                  <p className="text-gray-600">
                    {!confirmation
                      ? 'رابط التأكيد غير صالح أو مفقود. يرجى التحقق من الرابط والمحاولة مرة أخرى.'
                      : 'الرابط غير صالح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/register">
                      إنشاء حساب جديد
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/auth/login">
                      تسجيل الدخول
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}