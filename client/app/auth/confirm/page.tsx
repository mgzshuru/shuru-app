'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const confirmation = searchParams.get('confirmation');

  useEffect(() => {
    if (confirmation) {
      confirmEmail(confirmation);
    } else {
      setStatus('error');
    }
  }, [confirmation]);

  const confirmEmail = async (confirmationCode: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/email-confirmation?confirmation=${confirmationCode}`, {
        method: 'GET',
      });

      if (response.ok) {
        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?confirmed=true');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              تأكيد البريد الإلكتروني
            </CardTitle>
            <CardDescription className="text-gray-600">
              يرجى الانتظار بينما نقوم بتأكيد بريدك الإلكتروني
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
                  <p className="text-gray-600">الرابط غير صالح أو منتهي الصلاحية. يرجى المحاولة مرة أخرى.</p>
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