'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              تأكيد البريد الإلكتروني
            </CardTitle>
            <CardDescription className="text-gray-600">
              تم تأكيد بريدك الإلكتروني بنجاح
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-green-700 font-semibold">تم تأكيد البريد الإلكتروني بنجاح!</p>
                <p className="text-gray-600">يمكنك الآن تسجيل الدخول إلى حسابك</p>
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login?confirmed=true">
                  الانتقال إلى تسجيل الدخول
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}