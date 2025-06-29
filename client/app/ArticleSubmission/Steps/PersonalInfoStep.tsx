"use client";


import React from 'react';
import { Upload, User, Mail, Phone, Building, Briefcase, Globe } from 'lucide-react';
import { StepProps } from '../types';
import FileUploadZone from '../UI/FileUploadZone';
import { ACCEPTED_IMAGE_TYPES } from '../constants';

const PersonalInfoStep: React.FC<StepProps> = ({ formData, errors, onChange }) => {
  const handleFileUpload = (file: File | File[]) => {
    if (Array.isArray(file)) {
      onChange('profileImage', file[0]);
    } else {
      onChange('profileImage', file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header - Fast Company Style */}
      <div className="border-l-4 border-orange-500 pl-6">
        <h3 className="text-xl font-bold text-black mb-1">معلوماتك الشخصية</h3>
        <p className="text-gray-600">هذه المعلومات ستظهر مع مقالك المنشور</p>
      </div>
      
      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <User className="w-4 h-4 ml-2 text-gray-500" />
            الاسم الكامل
            <span className="text-red-500 mr-1">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 ${
              errors.fullName 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-black hover:border-gray-300'
            }`}
            placeholder="أدخل اسمك الكامل"
            dir="rtl"
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Phone className="w-4 h-4 ml-2 text-gray-500" />
            رقم الجوال
            <span className="text-red-500 mr-1">*</span>
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 ${
              errors.phoneNumber 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-black hover:border-gray-300'
            }`}
            placeholder="05xxxxxxxx"
            dir="ltr"
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.phoneNumber}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Mail className="w-4 h-4 ml-2 text-gray-500" />
            البريد الإلكتروني
            <span className="text-red-500 mr-1">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-black hover:border-gray-300'
            }`}
            placeholder="example@email.com"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* LinkedIn Profile */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Globe className="w-4 h-4 ml-2 text-gray-500" />
            حساب LinkedIn
            <span className="text-gray-400 mr-2 text-xs">(اختياري)</span>
          </label>
          <input
            type="url"
            value={formData.linkedinProfile}
            onChange={(e) => onChange('linkedinProfile', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 ${
              errors.linkedinProfile 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-black hover:border-gray-300'
            }`}
            placeholder="https://linkedin.com/in/username"
            dir="ltr"
          />
          {errors.linkedinProfile && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.linkedinProfile}
            </p>
          )}
        </div>

        {/* Workplace */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Building className="w-4 h-4 ml-2 text-gray-500" />
            جهة العمل
            <span className="text-red-500 mr-1">*</span>
          </label>
          <input
            type="text"
            value={formData.workplace}
            onChange={(e) => onChange('workplace', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 ${
              errors.workplace 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-black hover:border-gray-300'
            }`}
            placeholder="اسم الشركة أو المؤسسة"
            dir="rtl"
          />
          {errors.workplace && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.workplace}
            </p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <Briefcase className="w-4 h-4 ml-2 text-gray-500" />
            المسمى الوظيفي
            <span className="text-red-500 mr-1">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => onChange('jobTitle', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-all focus:outline-none focus:ring-0 ${
              errors.jobTitle 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-black hover:border-gray-300'
            }`}
            placeholder="مدير مشاريع، محلل أعمال، مستشار، إلخ"
            dir="rtl"
          />
          {errors.jobTitle && (
            <p className="text-red-600 text-sm font-medium mt-1">
              {errors.jobTitle}
            </p>
          )}
        </div>
      </div>

      {/* Profile Image Upload */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          الصورة الشخصية
          <span className="text-gray-400 mr-2 text-xs">(اختياري)</span>
        </label>
        
        <div className="max-w-md">
          <FileUploadZone
            onFileSelect={handleFileUpload}
            accept={ACCEPTED_IMAGE_TYPES}
            error={errors.profileImage}
          >
            <div className="text-center py-6">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium mb-1">اختر صورة شخصية</p>
              <p className="text-gray-500 text-sm">PNG, JPG حتى 10MB</p>
            </div>
            {formData.profileImage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 text-sm font-medium">
                  ✓ {formData.profileImage.name}
                </p>
              </div>
            )}
          </FileUploadZone>
        </div>
      </div>

      {/* Pro Tips - Fast Company Style */}
      <div className="mt-8 p-6 bg-black text-white rounded-lg">
        <h4 className="font-bold text-white mb-3 text-lg">💡 نصائح احترافية</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span className="text-gray-300">استخدم اسمك الحقيقي كما يظهر في وثائقك الرسمية</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span className="text-gray-300">تأكد من صحة بريدك الإلكتروني للتواصل</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span className="text-gray-300">الصورة الشخصية تزيد من مصداقية مقالك</span>
            </div>
            <div className="flex items-start">
              <span className="text-orange-500 mr-2 font-bold">•</span>
              <span className="text-gray-300">ملف LinkedIn يساعد القراء في التواصل معك</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;