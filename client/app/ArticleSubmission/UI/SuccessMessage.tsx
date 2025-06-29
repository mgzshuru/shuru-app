
import React from 'react';
import { CheckCircle, FileText, Clock, Mail, Home, RotateCcw } from 'lucide-react';
import { SuccessMessageProps } from '../types';

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full animate-fadeIn">
        {/* Success Icon with Animation */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h2>
          <p className="text-gray-600 leading-relaxed">
            شكرًا لمشاركتك المعرفية مع مجتمع إدارة المشاريع
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 ml-2" />
            الخطوات التالية
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5 flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-blue-800 font-medium">مراجعة أولية</p>
                <p className="text-blue-700 text-sm mt-1">
                  سيقوم فريق التحرير بمراجعة مقالك خلال 1-3 أيام عمل
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5 flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-blue-800 font-medium">إشعار النتيجة</p>
                <p className="text-blue-700 text-sm mt-1">
                  ستتلقى إشعارًا بحالة المقال على بريدك الإلكتروني
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 mt-0.5 flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-blue-800 font-medium">النشر</p>
                <p className="text-blue-700 text-sm mt-1">
                  في حالة الموافقة، سيتم نشر مقالك في المجلة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Mail className="w-5 h-5 ml-2" />
            هل تحتاج مساعدة؟
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            إذا كان لديك أي استفسار حول حالة مقالك أو عملية المراجعة، 
            يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف
          </p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>📧 البريد الإلكتروني: editorial@shoroua.com</p>
            <p>📞 الهاتف: 920012345</p>
          </div>
        </div>

        {/* Reference Number */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">رقم المرجع</h3>
          <div className="bg-white border border-yellow-300 rounded px-3 py-2">
            <code className="text-yellow-800 font-mono text-sm">
              ART-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 8).toUpperCase()}
            </code>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            احتفظ برقم المرجع هذا للاستعلام عن حالة مقالك
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center font-medium hover:shadow-md active:transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5 ml-2" />
            إرسال مقال جديد
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center font-medium hover:shadow-md active:transform active:scale-95"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            مجلة شروع • منصة المعرفة في إدارة المشاريع
          </p>
          <p className="text-xs text-gray-400 mt-1">
            تم الإرسال في {new Date().toLocaleDateString('ar-SA')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;