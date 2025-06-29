"use client";


import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { FormNavigationProps } from '../types';

const FormNavigation: React.FC<FormNavigationProps> = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <div className="flex justify-between items-center">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-black hover:text-black active:transform active:scale-95'
        }`}
        aria-label="الخطوة السابقة"
      >
        <ChevronLeft className="w-5 h-5 ml-2" />
        السابق
      </button>

      {/* Progress Info */}
      <div className="hidden md:flex items-center space-x-2 space-x-reverse">
        <span className="text-sm font-medium text-gray-900">
          {currentStep} من {totalSteps}
        </span>
      </div>

      {/* Next/Submit Button */}
      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          className="flex items-center px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 active:transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          aria-label="الخطوة التالية"
        >
          التالي
          <ChevronRight className="w-5 h-5 mr-2" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500 active:transform active:scale-95'
          }`}
          aria-label={isSubmitting ? 'جاري الإرسال...' : 'إرسال المقال'}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
              جاري الإرسال...
            </>
          ) : (
            <>
              إرسال المقال
              <Send className="w-5 h-5 mr-2" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FormNavigation;