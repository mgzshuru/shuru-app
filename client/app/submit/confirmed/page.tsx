import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-12 text-center" style={{ border: '1px solid #e5e7eb' }}>
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 animate-ping"></div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">تم تأكيد بريدك الإلكتروني!</h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            شكراً لك على تأكيد بريدك الإلكتروني. تم تأكيد تقديم مقالك بنجاح وسيقوم فريق التحرير
            بمراجعته والتواصل معك خلال 5-7 أيام عمل.
          </p>

          <div className="bg-blue-50 p-6 mb-8 border-2 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-4">الخطوات التالية:</h3>
            <div className="space-y-3 text-sm text-blue-700 text-right">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 ml-3"></div>
                <span>مراجعة المحتوى من قبل فريق التحرير المختص</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 ml-3"></div>
                <span>التواصل معك عبر البريد الإلكتروني لأي تعديلات مطلوبة</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 ml-3"></div>
                <span>الموافقة على النشر ونشر المقال على المنصة</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 ml-3"></div>
                <span>إشعارك عند نشر المقال</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 text-base transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              العودة للرئيسية
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>

            <Link
              href="/submit"
              className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 text-base transition-all duration-200 flex items-center justify-center"
            >
              إرسال مقال آخر
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
