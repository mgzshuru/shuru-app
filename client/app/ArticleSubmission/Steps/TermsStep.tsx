
import React from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { StepProps } from '../types';
import { TERMS_CONDITIONS } from '../constants';

const TermsStep: React.FC<StepProps> = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الشروط والأحكام</h2>
        <p className="text-gray-600">اقرأ الشروط بعناية ووافق عليها للمتابعة</p>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 ml-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900 mb-1">تنبيه مهم</h3>
            <p className="text-sm text-amber-800">
              الموافقة على هذه الشروط إلزامية لإرسال المقال. يرجى قراءتها بعناية.
            </p>
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-blue-600 ml-3" />
          <h3 className="font-semibold text-gray-900">
            شروط النشر في مجلة شروع
          </h3>
        </div>
        
        <div className="space-y-4">
          {TERMS_CONDITIONS.map((term, index) => (
            <div key={index} className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold ml-4 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{term}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Agreement */}
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              checked={formData.originalityAgreement}
              onChange={(e) => onChange('originalityAgreement', e.target.checked)}
              className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-red-600 ml-2" />
                <span className="font-semibold text-red-900">التعهد القانوني</span>
                <span className="text-red-500 mr-1">*</span>
              </div>
              <p className="text-sm text-red-800 leading-relaxed">
                <strong>أقر بأنني المؤلف الأصلي لهذا المقال</strong> وأتحمل كامل المسؤولية القانونية 
                إذا ثبت خلاف ذلك. أؤكد أن المحتوى أصلي ولم يتم نسخه أو اقتباسه من مصادر أخرى 
                دون التوثيق المناسب.
              </p>
            </div>
          </label>
          {errors.originalityAgreement && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.originalityAgreement}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 space-x-reverse cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAgreement}
              onChange={(e) => onChange('termsAgreement', e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600 ml-2" />
                <span className="font-semibold text-blue-900">الموافقة على الشروط والأحكام</span>
                <span className="text-red-500 mr-1">*</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                أوافق على جميع الشروط والأحكام المذكورة أعلاه، بما في ذلك حق منصة شروع 
                في نشر المقال أو تعديله وفقًا لسياسات المجلة والمعايير التحريرية.
              </p>
            </div>
          </label>
          {errors.termsAgreement && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.termsAgreement}
            </p>
          )}
        </div>
      </div>

      {/* Agreement Status */}
      {formData.originalityAgreement && formData.termsAgreement && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 ml-3" />
            <div>
              <h3 className="font-medium text-green-900">تم الموافقة على جميع الشروط</h3>
              <p className="text-sm text-green-800 mt-1">
                يمكنك الآن المتابعة لمراجعة بياناتك وإرسال المقال
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">معلومات إضافية:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• سيتم مراجعة المقال من قبل فريق التحرير</li>
          <li>• ستتلقى إشعارًا بحالة المقال خلال 5 أيام عمل</li>
          <li>• قد يطلب منك فريق التحرير تعديلات إضافية</li>
          <li>• حقوق النشر تبقى للكاتب مع حق المنصة في النشر</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsStep;