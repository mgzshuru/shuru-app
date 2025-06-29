
import { FormData, FormErrors } from '../ArticleSubmission/types';
import { MAX_FILE_SIZE_MB } from './constants';

export const validateStep = (step: number, formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  
  if (step === 1) {
    if (!formData.fullName.trim()) {
      errors.fullName = 'الاسم الكامل مطلوب';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'رقم الجوال مطلوب';
    } else if (!/^05\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.workplace.trim()) {
      errors.workplace = 'جهة العمل مطلوبة';
    }
    
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'المسمى الوظيفي مطلوب';
    }
    
    if (formData.linkedinProfile && formData.linkedinProfile.trim()) {
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
      if (!linkedinRegex.test(formData.linkedinProfile)) {
        errors.linkedinProfile = 'رابط LinkedIn غير صحيح';
      }
    }
  }
  
  if (step === 2) {
    if (!formData.articleTitle.trim()) {
      errors.articleTitle = 'عنوان المقال مطلوب';
    } else if (formData.articleTitle.trim().length < 10) {
      errors.articleTitle = 'عنوان المقال يجب أن يكون أكثر من 10 أحرف';
    }
    
    if (!formData.articleFile) {
      errors.articleFile = 'ملف المقال مطلوب (بصيغة Word)';
    }
  }
  
  if (step === 3) {
    if (!formData.originalityAgreement) {
      errors.originalityAgreement = 'يجب الموافقة على التعهد القانوني';
    }
    
    if (!formData.termsAgreement) {
      errors.termsAgreement = 'يجب الموافقة على الشروط والأحكام';
    }
  }
  
  return errors;
};

export const validateFileSize = (file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, acceptedTypes: string): boolean => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;
  
  if (acceptedTypes.includes('image/*') && file.type.startsWith('image/')) {
    return true;
  }
  
  return acceptedTypes.includes(fileExtension) || acceptedTypes.includes(mimeType);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_');
};

export const validateForm = (formData: FormData): { isValid: boolean; errors: FormErrors } => {
  const allErrors: FormErrors = {};
  
  // Validate all steps
  for (let step = 1; step <= 3; step++) {
    const stepErrors = validateStep(step, formData);
    Object.assign(allErrors, stepErrors);
  }
  
  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors
  };
};