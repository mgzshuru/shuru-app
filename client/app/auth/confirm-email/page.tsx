// Path: nextjs-frontend/src/app/auth/confirm-email/page.tsx

"use client";

import { resendConfirmEmailAction } from "@/app/actions/auth";
import { FormState } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import { MailCheck, Mail, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function ConfirmEmailForm() {
  // create initial state
  const initialState: FormState = {
    errors: {},
    values: {},
    message: "",
    success: false,
  };

  // useActionState to manage the state of the action
  const [state, formAction, isPending] = useActionState(
    resendConfirmEmailAction,
    initialState
  );

  // useSearchParams to get the email from the URL
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email") || "";

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, { position: "top-center" });
    }
  }, [state.success]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              تأكيد البريد الإلكتروني
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              يرجى فحص بريدك الإلكتروني وإتباع الرابط لتأكيد حسابك
            </p>
          </div>

          {/* Success Message */}
          {state.success && state.message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm leading-relaxed">{state.message}</span>
            </div>
          )}

          {/* Error Message */}
          {!state.success && state.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm leading-relaxed">{state.message}</span>
            </div>
          )}
          {/* Email Confirmation Instructions */}
          <div className="text-center space-y-6">
            <div className="p-6 bg-blue-50 border border-blue-300">
              <MailCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-blue-800 text-sm leading-relaxed">
                لقد أرسلنا رابط تأكيد إلى عنوان بريدك الإلكتروني. يرجى فحص بريدك الوارد والنقر على الرابط لتأكيد حسابك قبل تسجيل الدخول.
              </p>
            </div>

            <p className="text-gray-600 text-sm">
              لم تستلم البريد الإلكتروني؟ تحقق من مجلد الرسائل غير المرغوب فيها أو حاول إعادة الإرسال أدناه.
            </p>

            {/* Resend Email Form */}
            <form action={formAction} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={userEmail}
                    disabled={isPending}
                    className={`w-full pr-10 pl-4 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 focus:border-black`}
                    placeholder="البريد الإلكتروني"
                    autoComplete="email"
                  />
                </div>
              </div>

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
                  'إعادة إرسال رسالة التأكيد'
                )}
              </button>
            </form>
          </div>

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

export default function ConfirmEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>}>
      <ConfirmEmailForm />
    </Suspense>
  );
}
