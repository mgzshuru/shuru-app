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
  blocks: any[]; // Dynamic blocks array
  publishDate: string;

  // Media
  coverImage?: File | null;

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

const STRAPI_URL = process.env.STRAPI_BASE_URL || 'http://localhost:1337';

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

// Enhanced word count validation with better filtering and space handling for Arabic and English
const getWordCount = (text: string): number => {
  if (!text) return 0;

  // Don't trim the text to preserve trailing spaces during typing
  return text
    .replace(/[#*`_~\[\]()]/g, '') // Remove markdown symbols
    .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim() // Remove leading/trailing spaces for accurate counting
    .split(/\s+/) // Split by any whitespace characters
    .filter(word => {
      // Only count meaningful words (support Arabic, English, numbers)
      return word.length > 0 &&
             /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w]/.test(word); // Arabic ranges + word characters
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


    // Article content validation with security checks
    if (!data.blocks || data.blocks.length === 0) {
      validationErrors.blocks = 'محتوى المقال مطلوب';
    } else {
      // Calculate total word count from all blocks
      const totalWordCount = data.blocks.reduce((total, block) => {
        if (block.__component === 'content.rich-text' && block.content) {
          return total + getWordCount(block.content);
        } else if (block.__component === 'content.quote' && block.quote_text) {
          return total + getWordCount(block.quote_text);
        }
        return total;
      }, 0);

      if (totalWordCount < 50) {
        validationErrors.blocks = `محتوى المقال قصير جداً (${totalWordCount} كلمة، الحد الأدنى 50 كلمة)`;
      } else if (totalWordCount > 5000) {
        validationErrors.blocks = `محتوى المقال طويل جداً (${totalWordCount} كلمة، الحد الأقصى 5000 كلمة)`;
      }

      // Check for suspicious content patterns in text blocks
      const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /data:.*base64/gi,
        /eval\s*\(/gi,
        /onclick\s*=/gi,
        /onload\s*=/gi,
        /onerror\s*=/gi
      ];

      for (const block of data.blocks) {
        if (block.__component === 'content.rich-text' && block.content) {
          if (suspiciousPatterns.some(pattern => pattern.test(block.content))) {
            validationErrors.blocks = 'محتوى المقال يحتوي على نصوص غير مسموحة';
            break;
          }
        }
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
      // Don't sanitize article content as it contains markdown
      previousPublications: sanitizeInput(data.previousPublications),
      websiteUrl: sanitizeInput(data.websiteUrl),
      socialMediaLinks: sanitizeInput(data.socialMediaLinks),
      additionalNotes: sanitizeInput(data.additionalNotes),
    };

    console.log('All validations passed, submitting to Strapi...');
    console.log('STRAPI_URL:', STRAPI_URL);
    console.log('Has cover image:', !!data.coverImage);

    // Create FormData for file upload support
    const formData = new FormData();

    // Add text fields
    formData.append('authorName', sanitizeInput(data.authorName));
    formData.append('authorEmail', sanitizeInput(data.authorEmail));
    formData.append('authorPhone', sanitizeInput(data.authorPhone));
    formData.append('authorTitle', sanitizeInput(data.authorTitle));
    formData.append('authorOrganization', sanitizeInput(data.authorOrganization));
    formData.append('authorLinkedIn', sanitizeInput(data.authorLinkedIn));
    formData.append('authorBio', sanitizeInput(data.authorBio));
    formData.append('articleTitle', sanitizeInput(data.articleTitle));
    formData.append('articleDescription', sanitizeInput(data.articleDescription));
    // Process blocks to handle images separately
    const processedBlocks = [];
    let blockImageIndex = 0;

    for (const block of data.blocks) {
      if (block.__component === 'content.image' && block.image) {
        // Extract image file and send it separately
        const imageFieldName = `blockImage_${blockImageIndex}`;
        formData.append(imageFieldName, block.image);

        // Create a processed block with image reference instead of file
        const processedBlock = {
          ...block,
          image: imageFieldName, // Reference to the uploaded file
        };
        processedBlocks.push(processedBlock);
        blockImageIndex++;
      } else {
        // For non-image blocks or image blocks without files, keep as is
        processedBlocks.push(block);
      }
    }

    formData.append('blocks', JSON.stringify(processedBlocks)); // Send processed blocks as JSON
    formData.append('publishDate', data.publishDate);
    formData.append('previousPublications', sanitizeInput(data.previousPublications));
    formData.append('websiteUrl', sanitizeInput(data.websiteUrl));
    formData.append('socialMediaLinks', sanitizeInput(data.socialMediaLinks));
    formData.append('additionalNotes', sanitizeInput(data.additionalNotes));

    // Add cover image if provided
    if (data.coverImage) {
      console.log('Cover image details:', {
        name: data.coverImage.name,
        type: data.coverImage.type,
        size: data.coverImage.size,
        lastModified: data.coverImage.lastModified
      });
      formData.append('coverImage', data.coverImage);
      console.log('Cover image added to FormData:', data.coverImage.name, data.coverImage.size);
    }

    // Submit to Strapi with timeout
    const response = await fetch(`${STRAPI_URL}/api/article-submissions`, {
      method: 'POST',
      body: formData, // Send FormData instead of JSON
      // Remove Content-Type header to let browser set it for FormData
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
