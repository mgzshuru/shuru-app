// Path: nextjs-frontend/src/app/auth/login/page.tsx

"use client";

import { useActionState } from "react";
import { signinAction } from "@/app/actions/auth";
import { FormState } from "@/lib/types";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { useSearchParams } from "next/navigation";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');

  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    signinAction,
    initialState
  );

  if (state.success) {
    toast.success(state.message, { position: "top-center" });
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              سجل الدخول للوصول إلى حسابك
            </p>
          </div>

          {/* Error Messages */}
          {(!state?.success && state?.message) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm leading-relaxed">{state.message}</span>
            </div>
          )}

          {/* OAuth Error Messages */}
          {oauthError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm leading-relaxed">{decodeURIComponent(oauthError)}</span>
            </div>
          )}

          {/* Success Message */}
          {state.success && state.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm leading-relaxed">{state.message}</span>
            </div>
          )}
          {/* Login Form */}
          <form action={formAction} className="space-y-6">
            {!state?.success && state?.message && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-sm leading-relaxed">{state.message}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            {/* <div className="mb-6">
              <OAuthButtons />
            </div> */}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="identifier"
                  type="email"
                  name="identifier"
                  defaultValue={state?.values?.identifier}
                  disabled={isPending}
                  className={`w-full pr-10 pl-4 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    state?.errors?.identifier
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="البريد الإلكتروني"
                  autoComplete="email"
                />
              </div>
              {state?.errors?.identifier && (
                <p className="text-red-500 text-xs mt-1">{state.errors.identifier}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  defaultValue={state?.values?.password}
                  disabled={isPending}
                  className={`w-full pr-10 pl-12 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    state?.errors?.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="كلمة المرور"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <Link
                href="/auth/forgot-password"
                className="text-gray-500 hover:text-black transition-colors underline text-sm"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 text-base transition-all duration-200 uppercase tracking-wide"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin ml-2"></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
              ليس لديك حساب؟
            </p>
            <Link
              href="/auth/signup"
              className="text-black hover:text-gray-700 font-semibold underline"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
