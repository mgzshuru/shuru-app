"use client";


import React from 'react';
import { CheckCircle, User, FileText, Shield, Mail, Phone, Building, Briefcase, Image, ExternalLink } from 'lucide-react';
import { StepProps } from '../types';
import { formatFileSize } from '../formUtils';

const ReviewStep: React.FC<StepProps> = ({ formData }) => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-orange-500 pl-6">
        <h3 className="text-xl font-bold text-black mb-1">مراجعة البيانات</h3>
        <p className="text-gray-600">راجع جميع البيانات بعناية قبل الإرسال</p>
      </div>

      {/* Personal Information Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-black ml-3" />
          <h3 className="font-bold text-black text-lg">المعلومات الشخصية</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-3 border border-gray-100 rounded">
            <User className="w-4 h-4 text-gray-500 ml-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">الاسم الكامل</p>
              <p className="font-semibold text-gray-900">{formData.fullName}</p>
            </div>
          </div>

          <div className="flex items-center p-3 border border-gray-100 rounded">
            <Phone className="w-4 h-4 text-gray-500 ml-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">رقم الجوال</p>
              <p className="font-semibold text-gray-900" dir="ltr">{formData.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center p-3 border border-gray-100 rounded">
            <Mail className="w-4 h-4 text-gray-500 ml-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">البريد الإلكتروني</p>
              <p className="font-semibold text-gray-900" dir="ltr">{formData.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3 border border-gray-100 rounded">
            <Building className="w-4 h-4 text-gray-500 ml-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">جهة العمل</p>
              <p className="font-semibold text-gray-900">{formData.workplace}</p>
            </div>
          </div>

          <div className="flex items-center p-3 border border-gray-100 rounded">
            <Briefcase className="w-4 h-4 text-gray-500 ml-3" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">المسمى الوظيفي</p>
              <p className="font-semibold text-gray-900">{formData.jobTitle}</p>
            </div>
          </div>

          {formData.linkedinProfile && (
            <div className="flex items-center p-3 border border-gray-100 rounded">
              <ExternalLink className="w-4 h-4 text-gray-500 ml-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">LinkedIn</p>
                <a 
                  href={formData.linkedinProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-black hover:text-orange-500 text-sm transition-colors"
                >
                  عرض الملف الشخصي
                </a>
              </div>
            </div>
          )}
        </div>

        {formData.profileImage && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <Image className="w-4 h-4 text-gray-500 ml-3" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">الصورة الشخصية</p>
                <p className="font-semibold text-gray-900">{formData.profileImage.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(formData.profileImage.size)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Article Details Review */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-black ml-3" />
          <h3 className="font-bold text-black text-lg">تفاصيل المقال</h3>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">عنوان المقال</p>
            <p className="font-bold text-gray-900 text-xl leading-relaxed">
              {formData.articleTitle}
            </p>
          </div>

          {formData.articleFile && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-10 h-10 text-black ml-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">{formData.articleFile.name}</p>
                  <p className="text-gray-600">
                    {formatFileSize(formData.articleFile.size)} • ملف Word
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  جاهز
                </div>
              </div>
            </div>
          )}

          {formData.articleImages.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                صور المقال ({formData.articleImages.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.articleImages.map((image, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Image className="w-6 h-6 text-gray-400 ml-2 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agreement Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-green-600 ml-3" />
          <h3 className="font-bold text-green-900 text-lg">الموافقات والتعهدات</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-white border border-green-200 rounded">
            <CheckCircle className="w-5 h-5 text-green-600 ml-3 flex-shrink-0" />
            <p className="text-green-800 font-medium">
              <strong>التعهد القانوني:</strong> تم الإقرار بالملكية الفكرية للمقال
            </p>
          </div>
          
          <div className="flex items-center p-3 bg-white border border-green-200 rounded">
            <CheckCircle className="w-5 h-5 text-green-600 ml-3 flex-shrink-0" />
            <p className="text-green-800 font-medium">
              <strong>الشروط والأحكام:</strong> تم الموافقة على جميع شروط النشر
            </p>
          </div>
        </div>
      </div>

      {/* Final Notice - Fast Company Style */}
      <div className="bg-black text-white rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h3 className="font-bold text-white mb-3 text-2xl">جاهز للإرسال!</h3>
        <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
          تم مراجعة جميع البيانات والموافقة على الشروط. 
          بالضغط على "إرسال المقال" سيتم إرسال طلبك لفريق المراجعة المتخصص.
        </p>
      </div>

      {/* Process Timeline */}
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-4 text-lg">ما سيحدث بعد الإرسال:</h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-black rounded-full ml-4"></div>
            <span className="text-gray-700 font-medium">استلام طلبك وإرسال تأكيد فوري</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full ml-4"></div>
            <span className="text-gray-700 font-medium">مراجعة المقال من قبل فريق التحرير (24-48 ساعة)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full ml-4"></div>
            <span className="text-gray-700 font-medium">إشعارك بقرار النشر أو طلب تعديلات</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;