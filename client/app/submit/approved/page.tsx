export const dynamic = 'force-dynamic';

import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function ApprovedPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-12 text-center" style={{ border: '1px solid #e5e7eb' }}>
          <div className="relative">
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
              <Star className="w-8 h-8 text-yellow-400 absolute -top-2 -left-2 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 animate-ping"></div>
          </div>

          <h1 className="text-3xl font-bold text-green-800 mb-6">مبروك! تم قبول مقالك</h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            يسعدنا إعلامك أن مقالك قد تم قبوله للنشر في شروع!
          </p>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            سيقوم فريق التحرير بمراجعة التنسيق النهائي وإضافة اللمسات الأخيرة،
            وسيتم نشر المقال قريباً على المنصة.
          </p>

          <div className="bg-green-50 p-6 mb-8 border-2 border-green-200">
            <h3 className="font-semibold text-green-800 mb-4">الخطوات التالية:</h3>
            <div className="space-y-3 text-sm text-green-700 text-right">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 ml-3"></div>
                <span>مراجعة التنسيق النهائي وإضافة التحسينات البصرية</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 ml-3"></div>
                <span>إضافة الصور والرسوم البيانية إذا لزم الأمر</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 ml-3"></div>
                <span>نشر المقال على الموقع الإلكتروني</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 ml-3"></div>
                <span>الترويج للمقال عبر قنوات التواصل الاجتماعي</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 ml-3"></div>
                <span>إشعارك عند نشر المقال مع رابط المقال</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 mb-8 border-right-4 border-blue-400">
            <p className="text-blue-800 text-sm leading-relaxed">
              <strong>ملاحظة:</strong> نقدر مشاركتك القيمة مع مجتمع شروع. نتطلع لمقالاتك القادمة
              ونشجعك على الاستمرار في مشاركة خبراتك ومعرفتك مع قرائنا.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 text-base transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              العودة للرئيسية
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>

            <Link
              href="/submit"
              className="border-2 border-green-300 hover:bg-green-50 text-green-700 font-bold py-4 px-8 text-base transition-all duration-200 flex items-center justify-center"
            >
              إرسال مقال آخر
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
