import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function SignupSuccess() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              تم التسجيل بنجاح ✅
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              تم إنشاء حسابك بنجاح
            </p>
          </div>

          {/* Success Content */}
          <div className="text-center space-y-6">
            <div className="p-6 bg-green-50 border border-green-300">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-800 text-sm leading-relaxed">
                تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدء في استخدام المنصة.
              </p>
            </div>

            <p className="text-gray-600 text-sm">
              مرحباً بك في منصة شروع! نحن متحمسون لوجودك معنا.
            </p>

            {/* Login Button */}
            <Link href="/auth/login" className="block">
              <button
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 text-base transition-all duration-200 uppercase tracking-wide group"
              >
                الانتقال إلى تسجيل الدخول
                <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform inline" />
              </button>
            </Link>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
