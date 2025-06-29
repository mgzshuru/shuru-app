"use client";


import React from 'react';
import { FileText, Upload, X, Image, AlertTriangle } from 'lucide-react';
import { StepProps } from '../types';
import FileUploadZone from '../UI/FileUploadZone';
import { ACCEPTED_DOCUMENT_TYPES, ACCEPTED_IMAGE_TYPES } from '../constants';
import { formatFileSize } from '../formUtils';

const ArticleDetailsStep: React.FC<StepProps> = ({ formData, errors, onChange }) => {
  const handleFileUpload = (file: File | File[]) => {
    
    onChange('articleFile', file as File);
  };

  const handleMultipleFileUpload = (files: File | File[]) => {
 
    const fileArray = Array.isArray(files) ? files : [files];
    onChange('articleImages', [...formData.articleImages, ...fileArray]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.articleImages.filter((_, i) => i !== index);
    onChange('articleImages', newImages);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-orange-500 pl-6">
        <h3 className="text-xl font-bold text-black mb-1">تفاصيل مقالك</h3>
        <p className="text-gray-600">أضف عنوان مقالك وارفع الملفات المطلوبة</p>
      </div>
      
      {/* Article Title */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
          <FileText className="w-4 h-4 ml-2 text-gray-500" />
          عنوان المقال
          <span className="text-red-500 mr-1">*</span>
        </label>
        <input
          type="text"
          value={formData.articleTitle}
          onChange={(e) => onChange('articleTitle', e.target.value)}
          className={`w-full px-4 py-4 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 text-lg ${
            errors.articleTitle 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-black hover:border-gray-300'
          }`}
          placeholder="أدخل عنوانًا واضحًا ومعبرًا عن محتوى المقال"
          dir="rtl"
        />
        {errors.articleTitle && (
          <p className="text-red-600 text-sm font-medium mt-1">
            {errors.articleTitle}
          </p>
        )}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            طول العنوان: {formData.articleTitle.length} حرف
          </span>
          <span className={`${formData.articleTitle.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
            الحد الأدنى: 10 أحرف
          </span>
        </div>
      </div>

      {/* Article File Upload */}
      <div className="space-y-4">
        <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
          <FileText className="w-4 h-4 ml-2 text-gray-500" />
          ملف المقال
          <span className="text-red-500 mr-1">*</span>
        </label>
        
        <FileUploadZone
          onFileSelect={handleFileUpload}
          accept={ACCEPTED_DOCUMENT_TYPES}
          multiple={false}
          error={errors.articleFile}
        >
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-1">ارفع ملف المقال (Word)</p>
            <p className="text-gray-500 text-sm">DOC, DOCX • حتى 10MB</p>
          </div>
          {formData.articleFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-green-600 ml-3" />
                <div className="flex-1">
                  <p className="text-green-800 font-medium">{formData.articleFile.name}</p>
                  <p className="text-green-600 text-sm">{formatFileSize(formData.articleFile.size)}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  جاهز
                </div>
              </div>
            </div>
          )}
        </FileUploadZone>
      </div>

      {/* Article Images Upload */}
      <div className="space-y-4">
        <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
          <Image className="w-4 h-4 ml-2 text-gray-500" />
          صور المقال
          <span className="text-gray-400 mr-2 text-xs">(اختياري)</span>
        </label>
        
        <FileUploadZone
          onFileSelect={handleMultipleFileUpload}
          accept={ACCEPTED_IMAGE_TYPES}
          multiple={true}
        >
          <div className="text-center py-6">
            <Image className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">ارفع صور المقال</p>
            <p className="text-gray-500 text-sm">يمكن اختيار عدة صور معًا</p>
          </div>
        </FileUploadZone>
        
        {/* Uploaded Images Grid */}
        {formData.articleImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              الصور المرفوعة ({formData.articleImages.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.articleImages.map((image, index) => (
                <div key={index} className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 group hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Image className="w-8 h-8 text-gray-400 ml-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="حذف الصورة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Article Requirements */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-500 ml-2" />
          <h4 className="font-bold text-gray-900">متطلبات المقال</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">المحتوى</h5>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                500-1500 كلمة
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                مكتوب باللغة العربية
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                خالٍ من الأخطاء الإملائية
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                مرتبط بإدارة المشاريع
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">التنسيق</h5>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                الاسم في بداية الملف
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                المسمى الوظيفي
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                عنوان المقال
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full ml-2"></span>
                توثيق المراجع
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="bg-black text-white rounded-lg p-6">
        <h4 className="font-bold mb-4">✨ نصائح للحصول على مقال مميز</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-orange-400 mb-2">المحتوى</h5>
            <ul className="space-y-1 text-gray-300">
              <li>• استخدم عناوين فرعية واضحة</li>
              <li>• أضف أمثلة من تجربتك العملية</li>
              <li>• اربط المحتوى بمعايير دولية</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-orange-400 mb-2">التقديم</h5>
            <ul className="space-y-1 text-gray-300">
              <li>• الصور تزيد من جاذبية المقال</li>
              <li>• استخدم خطوط واضحة ومقروءة</li>
              <li>• راجع المقال قبل الإرسال</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsStep;