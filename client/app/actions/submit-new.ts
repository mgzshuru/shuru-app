"use server";

import { revalidatePath } from 'next/cache';

export interface SubmissionData {
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
  articleCategories: string[]; // Changed from single string to array
  articleContent: string;
  articleKeywords: string;
  publishDate: string;

  // Additional Info
  previousPublications: string;
  websiteUrl: string;
  socialMediaLinks: string;
  additionalNotes: string;
}

export interface EmailCheckResult {
  exists: boolean;
  requiresLogin: boolean;
  authorData: {
    name: string;
    email: string;
    phone_number: string;
    jobTitle: string;
    organization: string;
    linkedin_url: string;
    bio: string;
  } | null;
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Enhanced input sanitization with HTML entity protection (preserves trailing spaces for typing)
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/&[#x]?[a-z0-9]{1,8};/gi, '') // Remove HTML entities
    .replace(/data:/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript URLs
    .substring(0, 2000); // Limit length (don't trim to preserve spaces during typing)
};

// Enhanced email validation with stricter checks
const validateEmail = (email: string): boolean => {
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email) || email.length > 254) {
    return false;
  }

  // Additional security checks
  const normalizedEmail = email.toLowerCase().trim();

  // Block obvious test/spam emails
  const blockedPatterns = [
    /test.*@/,
    /fake.*@/,
    /spam.*@/,
    /temp.*@/,
    /example@/,
    /@test\./,
    /@fake\./,
    /@spam\./,
    /@temp\./
  ];

  return !blockedPatterns.some(pattern => pattern.test(normalizedEmail));
};

// Enhanced URL validation with security checks
const validateURL = (url: string): boolean => {
  if (!url) return true; // Optional field

  try {
    const urlObj = new URL(url);

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Block suspicious hosts
    const hostname = urlObj.hostname.toLowerCase();
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '192.168.',
      '10.0.',
      '172.16.',
      '172.17.',
      '172.18.',
      '172.19.',
      '172.20.',
      '172.21.',
      '172.22.',
      '172.23.',
      '172.24.',
      '172.25.',
      '172.26.',
      '172.27.',
      '172.28.',
      '172.29.',
      '172.30.',
      '172.31.'
    ];

    return !blockedHosts.some(blocked => hostname.includes(blocked));
  } catch {
    return false;
  }
};

// Enhanced word count validation with better filtering and space handling
const getWordCount = (text: string): number => {
  if (!text) return 0;

  // Don't trim the text to preserve trailing spaces during typing
  return text
    .replace(/[#*`_~\[\]()]/g, '') // Remove markdown symbols
    .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .split(' ') // Split by single space to count words properly
    .filter(word => {
      // Only count meaningful words (allow single characters and numbers)
      return word.length > 0 &&
             /\w/.test(word); // Contains word characters (letters, numbers, underscore)
    })
    .length;
};

// Rate limiting helper
const checkRateLimit = (): boolean => {
  if (typeof window === 'undefined') return true; // Server-side, skip check

  const lastSubmission = localStorage.getItem('lastArticleSubmission');
  if (lastSubmission) {
    const timeDiff = Date.now() - parseInt(lastSubmission);
    const cooldownPeriod = 5 * 60 * 1000; // 5 minutes

    if (timeDiff < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeDiff) / 60000);
      throw new Error(`يرجى الانتظار ${remainingTime} دقيقة قبل إرسال مقال آخر`);
    }
  }

  localStorage.setItem('lastArticleSubmission', Date.now().toString());
  return true;
};

export async function checkEmail(email: string): Promise<EmailCheckResult> {
  try {
    // Validate email first
    if (!email || !validateEmail(email)) {
      throw new Error('البريد الإلكتروني غير صحيح');
    }

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email);

    const response = await fetch(`${STRAPI_URL}/api/article-submissions/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: sanitizedEmail }),
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('تم إجراء محاولات كثيرة. يرجى المحاولة مرة أخرى بعد قليل.');
      }
      throw new Error('فشل في التحقق من البريد الإلكتروني');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking email:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('فشل في التحقق من البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
  }
}

export async function submitArticle(data: SubmissionData) {
  try {
    // Check rate limiting first
    checkRateLimit();

    console.log('Starting article submission with data:', {
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      articleTitle: data.articleTitle,
      articleCategories: data.articleCategories,
    });

    // Comprehensive server-side validation
    const validationErrors: Record<string, string> = {};

    // Author information validation
    if (!data.authorName || data.authorName.length < 2 || data.authorName.length > 100) {
      validationErrors.authorName = 'الاسم يجب أن يكون بين 2 و 100 حرف';
    }

    if (!data.authorEmail || !validateEmail(data.authorEmail)) {
      validationErrors.authorEmail = 'البريد الإلكتروني غير صحيح';
    }

    if (!data.authorTitle || data.authorTitle.length < 2 || data.authorTitle.length > 100) {
      validationErrors.authorTitle = 'المسمى الوظيفي يجب أن يكون بين 2 و 100 حرف';
    }

    if (!data.authorOrganization || data.authorOrganization.length < 2 || data.authorOrganization.length > 100) {
      validationErrors.authorOrganization = 'المؤسسة يجب أن تكون بين 2 و 100 حرف';
    }

    // Optional fields validation
    if (data.authorLinkedIn && !validateURL(data.authorLinkedIn)) {
      validationErrors.authorLinkedIn = 'رابط LinkedIn غير صحيح';
    }

    if (data.authorBio && data.authorBio.length > 1000) {
      validationErrors.authorBio = 'النبذة طويلة جداً (الحد الأقصى 1000 حرف)';
    }

    // Article information validation
    if (!data.articleTitle || data.articleTitle.length < 5 || data.articleTitle.length > 200) {
      validationErrors.articleTitle = 'عنوان المقال يجب أن يكون بين 5 و 200 حرف';
    }

    if (!data.articleDescription || data.articleDescription.length < 20 || data.articleDescription.length > 500) {
      validationErrors.articleDescription = 'وصف المقال يجب أن يكون بين 20 و 500 حرف';
    }

    if (!data.articleCategories || data.articleCategories.length === 0) {
      validationErrors.articleCategories = 'يجب اختيار فئة واحدة على الأقل للمقال';
    }

    // Article content validation with security checks
    if (!data.articleContent) {
      validationErrors.articleContent = 'محتوى المقال مطلوب';
    } else {
      const wordCount = getWordCount(data.articleContent);
      if (wordCount < 50) {
        validationErrors.articleContent = `محتوى المقال قصير جداً (${wordCount} كلمة، الحد الأدنى 50 كلمة)`;
      } else if (wordCount > 5000) {
        validationErrors.articleContent = `محتوى المقال طويل جداً (${wordCount} كلمة، الحد الأقصى 5000 كلمة)`;
      }

      // Check for suspicious content patterns
      const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /data:.*base64/gi,
        /eval\s*\(/gi,
        /onclick\s*=/gi,
        /onload\s*=/gi,
        /onerror\s*=/gi
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(data.articleContent))) {
        validationErrors.articleContent = 'محتوى المقال يحتوي على نصوص غير مسموحة';
      }
    }

    // Additional fields validation
    if (data.websiteUrl && !validateURL(data.websiteUrl)) {
      validationErrors.websiteUrl = 'رابط الموقع غير صحيح';
    }

    if (data.previousPublications && data.previousPublications.length > 1000) {
      validationErrors.previousPublications = 'المنشورات السابقة طويلة جداً (الحد الأقصى 1000 حرف)';
    }

    if (data.socialMediaLinks && data.socialMediaLinks.length > 500) {
      validationErrors.socialMediaLinks = 'روابط وسائل التواصل طويلة جداً (الحد الأقصى 500 حرف)';
    }

    if (data.additionalNotes && data.additionalNotes.length > 1000) {
      validationErrors.additionalNotes = 'الملاحظات الإضافية طويلة جداً (الحد الأقصى 1000 حرف)';
    }

    // Return first validation error
    const firstError = Object.keys(validationErrors)[0];
    if (firstError) {
      console.log(`Validation failed for field: ${firstError}`);
      return {
        success: false,
        error: validationErrors[firstError],
        field: firstError
      };
    }

    // Sanitize data before submission
    const sanitizedData = {
      ...data,
      authorName: sanitizeInput(data.authorName),
      authorEmail: sanitizeInput(data.authorEmail),
      authorPhone: sanitizeInput(data.authorPhone),
      authorTitle: sanitizeInput(data.authorTitle),
      authorOrganization: sanitizeInput(data.authorOrganization),
      authorLinkedIn: sanitizeInput(data.authorLinkedIn),
      authorBio: sanitizeInput(data.authorBio),
      articleTitle: sanitizeInput(data.articleTitle),
      articleDescription: sanitizeInput(data.articleDescription),
      articleCategories: data.articleCategories, // Keep array as is, individual items are sanitized
      // Don't sanitize article content as it contains markdown
      articleKeywords: sanitizeInput(data.articleKeywords),
      previousPublications: sanitizeInput(data.previousPublications),
      websiteUrl: sanitizeInput(data.websiteUrl),
      socialMediaLinks: sanitizeInput(data.socialMediaLinks),
      additionalNotes: sanitizeInput(data.additionalNotes),
    };

    console.log('All validations passed, submitting to Strapi...');
    console.log('STRAPI_URL:', STRAPI_URL);

    // Submit to Strapi with timeout
    const response = await fetch(`${STRAPI_URL}/api/article-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedData),
      // Add timeout
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    console.log('Strapi response status:', response.status);
    console.log('Strapi response ok:', response.ok);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('تم إجراء محاولات كثيرة. يرجى المحاولة مرة أخرى بعد قليل.');
      }

      const errorData = await response.json().catch(() => ({}));
      console.log('Strapi error response:', errorData);
      throw new Error(errorData.error?.message || 'فشل في إرسال المقال');
    }

    const result = await response.json();
    console.log('Strapi success response:', result);

    // Log successful submission
    console.log('Article submission successful:', {
      title: data.articleTitle,
      author: data.authorName,
      email: data.authorEmail,
      articleId: result.articleId,
      slug: result.slug,
      submittedAt: new Date().toISOString()
    });

    revalidatePath('/submit');

    return {
      success: true,
      submissionId: result.articleId,
      slug: result.slug,
      message: result.message || 'تم إرسال المقال بنجاح كمسودة!'
    };

  } catch (error) {
    console.error('Submission error:', error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'انتهت مهلة الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
        };
      }
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
    };
  }
}
