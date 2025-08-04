"use client";

import React, { useState } from 'react';
import { submitArticle, type SubmissionData } from '@/app/actions/submit';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import styles from './markdown-editor.module.css';
import {
  FileText,
  User,
  Mail,
  Building,
  Tag,
  Link,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  Globe
} from 'lucide-react';

// Dynamic import for markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface SubmissionFormData {
  // Author Information
  authorName: string;
  authorEmail: string;
  authorPhone: string;
  authorTitle: string;
  authorOrganization: string;
  authorLinkedIn: string;
  authorBio: string;

  // Article Information
  articleTitle: string;
  articleDescription: string;
  articleCategory: string;
  articleContent: string;
  articleKeywords: string;
  publishDate: string;

  // Media
  coverImage: File | null;

  // Additional Info
  previousPublications: string;
  websiteUrl: string;
  socialMediaLinks: string;
  additionalNotes: string;
}

interface FormErrors {
  [key: string]: string;
}

const categories = [
  'ريادة الأعمال',
  'التقنية والابتكار',
  'القيادة والإدارة',
  'التحول الرقمي',
  'الاستثمار والتمويل',
  'التطوير المؤسسي',
  'التسويق والمبيعات',
  'الموارد البشرية',
  'الاقتصاد والأعمال',
  'أخرى'
];

export default function SubmitPage() {
  const [formData, setFormData] = useState<SubmissionFormData>({
    authorName: '',
    authorEmail: '',
    authorPhone: '',
    authorTitle: '',
    authorOrganization: '',
    authorLinkedIn: '',
    authorBio: '',
    articleTitle: '',
    articleDescription: '',
    articleCategory: '',
    articleContent: '',
    articleKeywords: '',
    publishDate: '',
    coverImage: null,
    previousPublications: '',
    websiteUrl: '',
    socialMediaLinks: '',
    additionalNotes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string>('');

  const handleInputChange = (field: keyof SubmissionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'coverImage', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.authorName) newErrors.authorName = 'الاسم مطلوب';
      if (!formData.authorEmail) newErrors.authorEmail = 'البريد الإلكتروني مطلوب';
      if (!formData.authorTitle) newErrors.authorTitle = 'المسمى الوظيفي مطلوب';
      if (!formData.authorOrganization) newErrors.authorOrganization = 'المؤسسة مطلوبة';
    } else if (step === 2) {
      if (!formData.articleTitle) newErrors.articleTitle = 'عنوان المقال مطلوب';
      if (!formData.articleDescription) newErrors.articleDescription = 'وصف المقال مطلوب';
      if (!formData.articleCategory) newErrors.articleCategory = 'فئة المقال مطلوبة';
      if (!formData.articleContent) newErrors.articleContent = 'محتوى المقال مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      // Prepare submission data (excluding file uploads for now)
      const submissionData: SubmissionData = {
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        authorPhone: formData.authorPhone,
        authorTitle: formData.authorTitle,
        authorOrganization: formData.authorOrganization,
        authorLinkedIn: formData.authorLinkedIn,
        authorBio: formData.authorBio,
        articleTitle: formData.articleTitle,
        articleDescription: formData.articleDescription,
        articleCategory: formData.articleCategory,
        articleContent: formData.articleContent,
        articleKeywords: formData.articleKeywords,
        publishDate: formData.publishDate,
        previousPublications: formData.previousPublications,
        websiteUrl: formData.websiteUrl,
        socialMediaLinks: formData.socialMediaLinks,
        additionalNotes: formData.additionalNotes,
      };

      const result = await submitArticle(submissionData);

      if (result.success) {
        setSubmissionId(result.submissionId || '');
        setIsSubmitted(true);
      } else {
        if (result.field) {
          setErrors({ [result.field]: result.error || 'خطأ في الحقل' });
        } else {
          setSubmitError(result.error || 'حدث خطأ أثناء الإرسال');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-12 text-center" style={{ border: '1px solid #e5e7eb' }}>
            <div className="relative">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">تم إرسال المقال بنجاح!</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              شكراً لك على مشاركة خبرتك معنا. سيقوم فريق التحرير بمراجعة مقالك والتواصل معك خلال 5-7 أيام عمل.
            </p>
            {submissionId && (
              <p className="text-sm text-gray-500 mb-8">
                رقم المرجع: <span className="font-mono font-semibold">{submissionId}</span>
              </p>
            )}

            <div className="bg-gray-50 p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">الخطوات التالية:</h3>
              <div className="space-y-3 text-sm text-gray-600 text-right">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 ml-3"></div>
                  <span>مراجعة المحتوى من قبل فريق التحرير</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 ml-3"></div>
                  <span>التواصل معك لأي تعديلات مطلوبة</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 ml-3"></div>
                  <span>النشر على المنصة</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 text-base transition-all duration-200 transform hover:scale-105"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شارك خبرتك معنا</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            انضم إلى مجتمع الكتّاب والخبراء في شروع وشارك معرفتك مع آلاف القراء المهتمين بريادة الأعمال والابتكار
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="grid grid-cols-5 gap-0 items-center max-w-md">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center border-2 font-bold ${
                    currentStep >= 1
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}
                >
                  1
                </div>
                <span className={`text-sm mt-3 text-center ${
                  currentStep >= 1 ? 'text-black font-semibold' : 'text-gray-600'
                }`}>
                  معلومات الكاتب
                </span>
              </div>

              {/* Line 1 */}
              <div className={`h-0.5 w-full ${currentStep > 1 ? 'bg-black' : 'bg-gray-300'}`} />

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center border-2 font-bold ${
                    currentStep >= 2
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}
                >
                  2
                </div>
                <span className={`text-sm mt-3 text-center ${
                  currentStep >= 2 ? 'text-black font-semibold' : 'text-gray-600'
                }`}>
                  تفاصيل المقال
                </span>
              </div>

              {/* Line 2 */}
              <div className={`h-0.5 w-full ${currentStep > 2 ? 'bg-black' : 'bg-gray-300'}`} />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center border-2 font-bold ${
                    currentStep >= 3
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-400 border-gray-300'
                  }`}
                >
                  3
                </div>
                <span className={`text-sm mt-3 text-center ${
                  currentStep >= 3 ? 'text-black font-semibold' : 'text-gray-600'
                }`}>
                  مراجعة وإرسال
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-8 lg:p-12" style={{ border: '1px solid #e5e7eb' }}>
          {/* Step 1: Author Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات الكاتب</h2>
                <p className="text-gray-600">نحتاج لمعرفة من أنت وخلفيتك المهنية</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Author Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">الاسم الكامل *</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => handleInputChange('authorName', e.target.value)}
                      className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.authorName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                      }`}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  {errors.authorName && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.authorName}
                    </p>
                  )}
                </div>

                {/* Author Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">البريد الإلكتروني *</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={formData.authorEmail}
                      onChange={(e) => handleInputChange('authorEmail', e.target.value)}
                      className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.authorEmail ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                      }`}
                      placeholder="example@domain.com"
                    />
                  </div>
                  {errors.authorEmail && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.authorEmail}
                    </p>
                  )}
                </div>

                {/* Author Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">رقم الهاتف</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={formData.authorPhone}
                      onChange={(e) => handleInputChange('authorPhone', e.target.value)}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                </div>

                {/* Author Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">المسمى الوظيفي *</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.authorTitle}
                      onChange={(e) => handleInputChange('authorTitle', e.target.value)}
                      className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.authorTitle ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                      }`}
                      placeholder="مثال: مدير التطوير التقني"
                    />
                  </div>
                  {errors.authorTitle && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.authorTitle}
                    </p>
                  )}
                </div>

                {/* Author Organization */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">اسم المؤسسة *</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.authorOrganization}
                      onChange={(e) => handleInputChange('authorOrganization', e.target.value)}
                      className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.authorOrganization ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                      }`}
                      placeholder="اسم الشركة أو المؤسسة"
                    />
                  </div>
                  {errors.authorOrganization && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.authorOrganization}
                    </p>
                  )}
                </div>

                {/* LinkedIn URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">رابط LinkedIn</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Link className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={formData.authorLinkedIn}
                      onChange={(e) => handleInputChange('authorLinkedIn', e.target.value)}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">نبذة عن الكاتب</label>
                <textarea
                  value={formData.authorBio}
                  onChange={(e) => handleInputChange('authorBio', e.target.value)}
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="اكتب نبذة مختصرة عن خبرتك وخلفيتك المهنية..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Article Information */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل المقال</h2>
                <p className="text-gray-600">أخبرنا عن المقال الذي تريد نشره</p>
              </div>

              {/* Article Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">عنوان المقال *</label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.articleTitle}
                    onChange={(e) => handleInputChange('articleTitle', e.target.value)}
                    className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                      errors.articleTitle ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                    }`}
                    placeholder="اكتب عنواناً جذاباً ومعبراً عن محتوى المقال"
                  />
                </div>
                {errors.articleTitle && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.articleTitle}
                  </p>
                )}
              </div>

              {/* Article Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">وصف مختصر للمقال *</label>
                <textarea
                  value={formData.articleDescription}
                  onChange={(e) => handleInputChange('articleDescription', e.target.value)}
                  rows={3}
                  className={`w-full p-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                    errors.articleDescription ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                  }`}
                  placeholder="اكتب وصفاً مختصراً يلخص موضوع المقال وأهم النقاط التي يغطيها..."
                />
                {errors.articleDescription && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.articleDescription}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Article Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">فئة المقال *</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Tag className="w-5 h-5" />
                    </div>
                    <select
                      value={formData.articleCategory}
                      onChange={(e) => handleInputChange('articleCategory', e.target.value)}
                      className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.articleCategory ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                      }`}
                    >
                      <option value="">اختر الفئة المناسبة</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.articleCategory && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.articleCategory}
                    </p>
                  )}
                </div>

                {/* Publish Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">تاريخ النشر المفضل</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => handleInputChange('publishDate', e.target.value)}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">محتوى المقال *</label>
                <div className={`${styles['md-editor-arabic']} ${
                  errors.articleContent ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                } border-2 rounded focus-within:ring-4 focus-within:ring-gray-100 transition-all duration-200`}>
                  <MDEditor
                    value={formData.articleContent}
                    onChange={(value) => handleInputChange('articleContent', value || '')}
                    data-color-mode="light"
                    height={400}
                    preview="edit"
                    hideToolbar={false}
                    visibleDragbar={false}
                    textareaProps={{
                      placeholder: 'اكتب محتوى المقال هنا... يمكنك استخدام تنسيق Markdown للعناوين والقوائم والتنسيقات الأخرى',
                      style: {
                        fontSize: 16,
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        direction: 'rtl',
                        textAlign: 'right'
                      }
                    }}
                    style={{
                      backgroundColor: '#f9fafb'
                    }}
                  />
                </div>
                {errors.articleContent && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {errors.articleContent}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>يُنصح بأن يكون المقال بين 800-2000 كلمة للحصول على أفضل تجربة قراءة</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    عدد الكلمات: {formData.articleContent.replace(/[#*`_~\[\]()]/g, '').split(' ').filter(word => word.length > 0).length}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">الكلمات المفتاحية</label>
                <input
                  type="text"
                  value={formData.articleKeywords}
                  onChange={(e) => handleInputChange('articleKeywords', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="مثال: ريادة الأعمال، الابتكار، التقنية، القيادة (افصل بفواصل)"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">صورة الغلاف</label>
                <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">اسحب الصورة هنا أو انقر للاختيار</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('coverImage', e.target.files?.[0] || null)}
                    className="hidden"
                    id="coverImage"
                  />
                  <label
                    htmlFor="coverImage"
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    اختر ملف
                  </label>
                  {formData.coverImage && (
                    <p className="text-xs text-green-600 mt-2">{formData.coverImage.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات إضافية</h2>
                <p className="text-gray-600">معلومات اختيارية تساعدنا في تحسين جودة المحتوى</p>
              </div>

              {/* Previous Publications */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">منشورات سابقة</label>
                <textarea
                  value={formData.previousPublications}
                  onChange={(e) => handleInputChange('previousPublications', e.target.value)}
                  rows={3}
                  className="w-full p-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="اذكر روابط أو أسماء منشوراتك السابقة (إن وجدت)..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Website URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">موقع الويب الشخصي</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">روابط وسائل التواصل</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Link className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.socialMediaLinks}
                      onChange={(e) => handleInputChange('socialMediaLinks', e.target.value)}
                      className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Twitter, Instagram, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">ملاحظات إضافية</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="أي معلومات إضافية تريد مشاركتها معنا..."
                />
              </div>

              {/* Summary Preview */}
              <div className="bg-gray-50 p-6 border-2 border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">ملخص المقال</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">العنوان:</span> {formData.articleTitle || 'غير محدد'}</div>
                  <div><span className="font-medium">الكاتب:</span> {formData.authorName || 'غير محدد'}</div>
                  <div><span className="font-medium">الفئة:</span> {formData.articleCategory || 'غير محددة'}</div>
                  <div><span className="font-medium">عدد الكلمات:</span> {formData.articleContent.replace(/[#*`_~\[\]()]/g, '').split(' ').filter(word => word.length > 0).length}</div>
                  <div><span className="font-medium">صورة الغلاف:</span> {formData.coverImage ? 'مرفقة' : 'غير مرفقة'}</div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 p-6">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    أوافق على <a href="#" className="text-black hover:underline">شروط النشر</a> و
                    <a href="#" className="text-black hover:underline mx-1">سياسة الخصوصية</a>.
                    أؤكد أن المحتوى المقدم أصلي ولا ينتهك حقوق الطبع والنشر لأي طرف ثالث.
                  </label>
                </div>
              </div>

              {/* Submit Error Display */}
              {submitError && (
                <div className="bg-red-50 border-2 border-red-200 p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 ml-3" />
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-8 py-3 border-2 font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              السابق
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 transform hover:scale-105"
              >
                التالي
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'جاري الإرسال...' : 'إرسال المقال'}
              </button>
            )}
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="mt-12 bg-white p-8" style={{ border: '1px solid #e5e7eb' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-6">إرشادات النشر</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">معايير المحتوى</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>المحتوى الأصلي والحصري فقط</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>التركيز على ريادة الأعمال والابتكار</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>اللغة العربية الفصحى المبسطة</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>تجنب المحتوى التجاري المباشر</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">عملية المراجعة</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>مراجعة فنية وتحريرية خلال 5-7 أيام</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>قد نطلب تعديلات أو إضافات</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>إشعار بالقبول أو الرفض مع الأسباب</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 mt-2 ml-2"></div>
                  <span>النشر حسب التوقيت المناسب</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
