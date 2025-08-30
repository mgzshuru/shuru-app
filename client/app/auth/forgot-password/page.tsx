"use client";

import React, { useActionState, useEffect } from "react";
import { forgotPasswordAction } from "@/app/actions/auth";
import { FormState } from "@/lib/types";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ForgotPassword() {
  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, { position: "top-center" });
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              استعادة كلمة المرور
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
          </div>

          {/* Error Messages */}
          {!state?.success && state?.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm leading-relaxed">{state.message}</span>
            </div>
          )}

          {/* Success Message */}
          {state.success && state.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm leading-relaxed">{state.message}</span>
            </div>
          )}

          {state.success ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 border border-green-300 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 text-sm">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                يرجى فحص بريدك الإلكتروني واتباع التعليمات لإعادة تعيين كلمة المرور
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-6">
              {/* Email Field */}
              <div>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={state.values?.email}
                    disabled={isPending}
                    className={`w-full pr-10 pl-4 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                      state?.errors?.email
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-black'
                    }`}
                    placeholder="البريد الإلكتروني"
                    autoComplete="email"
                  />
                </div>
                {state.errors?.email && (
                  <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
                )}
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
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال رابط إعادة التعيين'
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
