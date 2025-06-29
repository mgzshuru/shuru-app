"use client";

// ArticleSubmissionForm.tsx - Fast Company Style
import React, { useState, useCallback } from 'react';
import { FormData, FormErrors } from './types';
import { STEPS, INITIAL_FORM_DATA } from './constants';
import { validateStep } from './formUtils';

// Import Step Components (Fixed paths to match your structure)
import PersonalInfoStep from './Steps/PersonalInfoStep';
import ArticleDetailsStep from './Steps/ArticleDetailsStep';
import TermsStep from './Steps/TermsStep';
import ReviewStep from './Steps/ReviewStep';

// Import UI Components (Fixed paths to match your structure)
import StepIndicator from './UI/StepIndicator';
import FormNavigation from './UI/FormNavigation';
import SuccessMessage from './UI/SuccessMessage';

const ArticleSubmissionForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Handle form field changes
  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Navigate to next step with validation
  const nextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentStep, formData]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const stepErrors = validateStep(3, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length > 0) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted with data:', formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'حدث خطأ أثناء إرسال المقال. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Handle restart after successful submission
  const handleRestart = useCallback(() => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  }, []);

  // Render appropriate step component
  const renderStep = useCallback(() => {
    const stepProps = { 
      formData, 
      errors, 
      onChange: handleInputChange 
    };
    
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <ArticleDetailsStep {...stepProps} />;
      case 3:
        return <TermsStep {...stepProps} />;
      case 4:
        return <ReviewStep {...stepProps} />;
      default:
        return <PersonalInfoStep {...stepProps} />;
    }
  }, [currentStep, formData, errors, handleInputChange]);

  if (isSubmitted) {
    return <SuccessMessage onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Fast Company Style Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">مجلة شروع</h1>
              <p className="text-gray-400 text-sm mt-1">منصة المعرفة في إدارة المشاريع</p>
            </div>
            <div className="hidden md:flex items-center space-x-6 space-x-reverse text-sm">
              <span className="text-orange-400 font-medium">مراجعة خلال 48 ساعة</span>
              <span className="text-gray-300">نشر احترافي</span>
              <span className="text-gray-300">مجتمع متخصص</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Title & Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
            شارك خبرتك مع<br />
            <span className="text-orange-500">مجتمع إدارة المشاريع</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            انضم إلى آلاف المختصين الذين يشاركون معرفتهم وتجاربهم في أكبر منصة عربية لإدارة المشاريع
          </p>
        </div>

        {/* Progress Bar - Fast Company Style */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-900">
              الخطوة {currentStep} من {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / STEPS.length) * 100)}% مكتمل
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-black rounded-full h-1 transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black to-orange-500"></div>
            </div>
          </div>
        </div>

        {/* Step Indicator - Minimalist */}
        <div className="mb-8">
          <StepIndicator 
            steps={STEPS} 
            currentStep={currentStep}
            errors={errors}
            size="sm"
            showDescription={false}
          />
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Form Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h3 className="text-2xl font-bold text-black">
              {STEPS[currentStep - 1]?.title}
            </h3>
            <p className="text-gray-600 mt-1">
              {STEPS[currentStep - 1]?.description}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {renderStep()}
          </div>

          {/* Global Submit Error */}
          {errors.submit && (
            <div className="mx-8 mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <p className="text-red-700 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t border-gray-200 px-8 py-6">
            <FormNavigation
              currentStep={currentStep}
              totalSteps={STEPS.length}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Stats Section - Fast Company Style */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-black mb-2">500+</div>
            <div className="text-gray-600 text-sm">مقال منشور</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-black mb-2">50K+</div>
            <div className="text-gray-600 text-sm">قارئ شهرياً</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-black mb-2">95%</div>
            <div className="text-gray-600 text-sm">معدل الرضا</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              © 2025 مجلة شروع - جميع الحقوق محفوظة
            </p>
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
              <a href="#" className="hover:text-black transition-colors">الشروط</a>
              <a href="#" className="hover:text-black transition-colors">الخصوصية</a>
              <a href="#" className="hover:text-black transition-colors">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticleSubmissionForm;