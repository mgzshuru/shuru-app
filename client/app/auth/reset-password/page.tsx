"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/app/actions/auth";
import { FormState } from "@/lib/types";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  const [state, formAction, IsPending] = useActionState(
    resetPasswordAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, { position: "top-center" });
      router.push("/auth/login");
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              إعادة تعيين كلمة المرور
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              أدخل كلمة المرور الجديدة لحسابك
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
          {/* Reset Password Form */}
          <form action={formAction} className="space-y-6">
            {/* New Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  defaultValue={state.values?.password}
                  disabled={IsPending}
                  className={`w-full pr-10 pl-12 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    state?.errors?.password
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="كلمة المرور الجديدة"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={IsPending}
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
                  defaultValue={state.values?.confirmPassword}
                  disabled={IsPending}
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
                  disabled={IsPending}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{state.errors.confirmPassword}</p>
              )}
            </div>

            {/* Hidden fields */}
            <input type="hidden" name="code" value={code as string} />
            <input type="hidden" name="passwordType" value="reset" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={IsPending}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 text-base transition-all duration-200 uppercase tracking-wide"
            >
              {IsPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin ml-2"></div>
                  جاري إعادة التعيين...
                </div>
              ) : (
                'إعادة تعيين كلمة المرور'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
