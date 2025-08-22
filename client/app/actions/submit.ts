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
  articleCategory: string;
  articleContent: string;
  articleKeywords: string;
  publishDate: string;

  // Additional Info
  previousPublications: string;
  websiteUrl: string;
  socialMediaLinks: string;
  additionalNotes: string;
}

export async function submitArticle(data: SubmissionData) {
  try {
    // Validate required fields
    const requiredFields = [
      'authorName',
      'authorEmail',
      'authorTitle',
      'authorOrganization',
      'articleTitle',
      'articleDescription',
      'articleCategory',
      'articleContent'
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof SubmissionData]) {
        return {
          success: false,
          error: `الحقل ${field} مطلوب`,
          field
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.authorEmail)) {
      return {
        success: false,
        error: 'تنسيق البريد الإلكتروني غير صحيح',
        field: 'authorEmail'
      };
    }

    // Enhanced word count validation for Arabic and English
    const getWordCount = (text: string): number => {
      if (!text) return 0;

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

    // Validate article length (minimum 100 words)
    const wordCount = getWordCount(data.articleContent);
    if (wordCount < 100) {
      return {
        success: false,
        error: 'يجب أن يكون المقال 100 كلمة على الأقل',
        field: 'articleContent'
      };
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification emails
    // 3. Upload any files
    // 4. Create draft article in CMS

    // For now, we'll simulate the submission
    console.log('Article submission received:', {
      title: data.articleTitle,
      author: data.authorName,
      email: data.authorEmail,
      category: data.articleCategory,
      wordCount,
      submittedAt: new Date().toISOString()
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Integrate with Strapi to create a draft article
    // const articleData = {
    //   title: data.articleTitle,
    //   description: data.articleDescription,
    //   slug: generateSlug(data.articleTitle),
    //   content: data.articleContent,
    //   status: 'draft',
    //   author: {
    //     name: data.authorName,
    //     email: data.authorEmail,
    //     title: data.authorTitle,
    //     organization: data.authorOrganization,
    //     linkedin_url: data.authorLinkedIn,
    //     bio: data.authorBio
    //   },
    //   category: data.articleCategory,
    //   keywords: data.articleKeywords.split(',').map(k => k.trim()),
    //   metadata: {
    //     previousPublications: data.previousPublications,
    //     websiteUrl: data.websiteUrl,
    //     socialMediaLinks: data.socialMediaLinks,
    //     additionalNotes: data.additionalNotes,
    //     submissionDate: new Date().toISOString()
    //   }
    // };

    // TODO: Send confirmation email to author
    // TODO: Send notification to editorial team

    revalidatePath('/submit');

    return {
      success: true,
      message: 'تم إرسال المقال بنجاح! سيتواصل معك فريق التحرير قريباً.',
      submissionId: `SUB-${Date.now()}`
    };

  } catch (error) {
    console.error('Article submission error:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء إرسال المقال. يرجى المحاولة مرة أخرى.',
      field: null
    };
  }
}

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Function to handle file uploads (for future implementation)
export async function uploadSubmissionFiles(formData: FormData) {
  try {
    // TODO: Implement file upload logic
    // This could integrate with cloud storage like AWS S3, Cloudinary, etc.

    const files = formData.getAll('files') as File[];
    const uploadedFiles: { name: string; url: string; size: number }[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return {
          success: false,
          error: `الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت.`
        };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: `نوع الملف ${file.name} غير مدعوم. يُقبل فقط: JPEG, PNG, WebP, GIF`
        };
      }

      // TODO: Upload to storage service
      // const uploadedFile = await uploadToStorage(file);
      // uploadedFiles.push(uploadedFile);

      // For now, just log the file info
      console.log('File to upload:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Placeholder for uploaded file info
      uploadedFiles.push({
        name: file.name,
        url: `placeholder-url-${Date.now()}`,
        size: file.size
      });
    }

    return {
      success: true,
      files: uploadedFiles
    };

  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء رفع الملفات'
    };
  }
}
