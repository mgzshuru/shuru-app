"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/actions/auth";
import { FormState } from "@/lib/types";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import OAuthButtons from "@/components/auth/OAuthButtons";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function SignUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // create a form state
  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  // use the action state to handle the form submission
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              إنشاء حساب
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              انضم إلينا وابدأ رحلتك معنا
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
          {/* Signup Form */}
          <form action={formAction} className="space-y-6">
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
            {/* Username Field */}
            <div>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  defaultValue={state?.values?.username as string}
                  disabled={isPending}
                  className={`w-full pr-10 pl-4 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    state?.errors?.username
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="اسم المستخدم"
                  autoComplete="username"
                />
              </div>
              {state?.errors?.username && (
                <p className="text-red-500 text-xs mt-1">{state.errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  defaultValue={state?.values?.email as string}
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
              {state?.errors?.email && (
                <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
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
                  defaultValue={state?.values?.password as string}
                  disabled={isPending}
                  className={`w-full pr-10 pl-12 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    state?.errors?.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="كلمة المرور"
                  autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  defaultValue={state?.values?.confirmPassword as string}
                  disabled={isPending}
                  className={`w-full pr-10 pl-12 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    state?.errors?.confirmPassword
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="تأكيد كلمة المرور"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{state.errors.confirmPassword}</p>
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
                  جاري إنشاء الحساب...
                </div>
              ) : (
                'إنشاء الحساب'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
              لديك حساب بالفعل؟
            </p>
            <Link
              href="/auth/login"
              className="text-black hover:text-gray-700 font-semibold underline"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
