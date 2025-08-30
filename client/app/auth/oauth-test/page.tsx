"use client";

import OAuthButtons from "@/components/auth/OAuthButtons";

export default function OAuthTestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-black mb-3 uppercase tracking-tight">
              اختبار OAuth
            </h1>
            <p className="text-gray-600 text-sm">
              اختبر تسجيل الدخول باستخدام Google أو LinkedIn
            </p>
          </div>

          <OAuthButtons redirectTo="/profile" />
        </div>
      </div>
    </div>
  );
}
