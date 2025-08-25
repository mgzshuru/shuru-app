import { v4 as uuidv4 } from 'uuid';

// Enhanced input sanitization with HTML entity protection (preserves trailing spaces for typing)
const sanitizeInput = (input: string): string => {
  if (!input) return '';
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

// Rate limiting helper (server-side)
const submissionAttempts = new Map();

const checkRateLimit = (email: string, ip: string): boolean => {
  const key = `${email}-${ip}`;
  const now = Date.now();
  const attempts = submissionAttempts.get(key) || [];

  // Clean old attempts (older than 1 hour)
  const recentAttempts = attempts.filter((time: number) => now - time < 3600000);

  if (recentAttempts.length >= 3) { // Max 3 submissions per hour
    return false;
  }

  recentAttempts.push(now);
  submissionAttempts.set(key, recentAttempts);

  // Clean up old entries periodically
  if (submissionAttempts.size > 1000) {
    const keys = Array.from(submissionAttempts.keys()).slice(0, 500);
    keys.forEach(key => submissionAttempts.delete(key));
  }

  return true;
};

// Export the controller
export default {
  async checkEmail(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      // Sanitize and validate email
      const sanitizedEmail = sanitizeInput(email);
      if (!validateEmail(sanitizedEmail)) {
        return ctx.badRequest('Invalid email format');
      }

      // Check if author exists with this email
      const authors = await strapi.documents('api::author.author').findMany({
        filters: { email: sanitizedEmail },
        limit: 1
      });

      if (authors && authors.length > 0) {
        const author = authors[0] as any;
        return {
          exists: true,
          requiresLogin: false, // Since we're checking authors directly, no login required
          authorData: {
            name: sanitizeInput((author as any).name || ''),
            email: sanitizeInput((author as any).email || ''),
            phone_number: sanitizeInput((author as any).phone_number || ''),
            jobTitle: sanitizeInput((author as any).jobTitle || ''),
            organization: sanitizeInput((author as any).organization || ''),
            linkedin_url: sanitizeInput((author as any).linkedin_url || ''),
            bio: sanitizeInput((author as any).bio || ''),
            previousPublications: sanitizeInput((author as any).previousPublications || ''),
            websiteUrl: sanitizeInput((author as any).websiteUrl || ''),
            socialMediaLinks: sanitizeInput((author as any).socialMediaLinks || ''),
            additionalNotes: sanitizeInput((author as any).additionalNotes || ''),
          }
        };
      }

      return {
        exists: false,
        requiresLogin: false,
        authorData: null
      };

    } catch (error) {
      strapi.log.error('Error checking email:', error);
      return ctx.internalServerError('An error occurred while checking email');
    }
  },

  async create(ctx) {
    try {
      // Get client IP for logging and rate limiting
      const clientIP = ctx.request.ip || ctx.request.socket.remoteAddress || 'unknown';
      const userAgent = ctx.request.headers['user-agent'] || '';

      // Handle both FormData and JSON submissions
      let data = ctx.request.body;
      const files = ctx.request.files;

      // Basic validation - log the attempt but allow all valid requests
      strapi.log.info('Article submission attempt', {
        ip: clientIP,
        userAgent: userAgent?.substring(0, 100), // Limit user agent length for logging
        timestamp: new Date().toISOString(),
        hasCoverImage: !!(files && files.coverImage),
        authorEmail: data.authorEmail
      });

      // If blocks is a string (from FormData), parse it
      if (typeof data.blocks === 'string') {
        try {
          data.blocks = JSON.parse(data.blocks);
        } catch (error) {
          strapi.log.error('Error parsing blocks:', error);
          data.blocks = [];
        }
      }

      // Handle cover image from files
      let coverImageId = null;
      if (files && files.coverImage) {
        try {
          const coverImageFile = Array.isArray(files.coverImage) ? files.coverImage[0] : files.coverImage;

          // Debug logging
          strapi.log.info('Cover image file details:', {
            type: coverImageFile.type,
            size: coverImageFile.size,
            name: coverImageFile.name,
            originalFilename: coverImageFile.originalFilename,
            mimetype: coverImageFile.mimetype
          });

          // Validate file type - use both type and mimetype fields and check file extension
          const fileType = coverImageFile.type || coverImageFile.mimetype;
          const fileName = coverImageFile.name || coverImageFile.originalFilename || '';
          const fileExtension = fileName.toLowerCase().split('.').pop();

          const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
          const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

          const isValidMimeType = fileType && allowedMimeTypes.includes(fileType);
          const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);

          if (!isValidMimeType && !isValidExtension) {
            strapi.log.warn('Invalid cover image type uploaded:', {
              type: coverImageFile.type,
              mimetype: coverImageFile.mimetype,
              detectedType: fileType,
              fileName: fileName,
              fileExtension: fileExtension,
              allowedTypes: allowedMimeTypes,
              allowedExtensions: allowedExtensions
            });
            return ctx.badRequest('نوع ملف الصورة غير مدعوم. الأنواع المسموحة: JPG, PNG, WebP');
          }

          // Validate file size (max 5MB)
          const maxSizeBytes = 5 * 1024 * 1024; // 5MB
          if (coverImageFile.size > maxSizeBytes) {
            strapi.log.warn('Cover image too large:', {
              size: coverImageFile.size,
              maxSize: maxSizeBytes
            });
            return ctx.badRequest('حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)');
          }

          // Upload the cover image to Strapi media library
          const uploadService = strapi.plugin('upload').service('upload');
          const uploadedFiles = await uploadService.upload({
            data: {
              refId: null,
              ref: null,
              field: null,
            },
            files: [coverImageFile],
          });

          if (uploadedFiles && uploadedFiles.length > 0) {
            coverImageId = uploadedFiles[0].id;
            strapi.log.info('Cover image uploaded successfully:', {
              imageId: coverImageId,
              filename: uploadedFiles[0].name,
              size: uploadedFiles[0].size
            });
          }
        } catch (uploadError) {
          strapi.log.error('Error uploading cover image:', uploadError);
          return ctx.badRequest('فشل في رفع صورة الغلاف. يرجى المحاولة مرة أخرى.');
        }
      }

      // Rate limiting check
      if (data.authorEmail && !checkRateLimit(data.authorEmail, clientIP)) {
        strapi.log.warn('Rate limit exceeded for article submission', {
          email: data.authorEmail,
          ip: clientIP
        });
        return ctx.tooManyRequests('Too many submission attempts. Please try again later.');
      }

      // Comprehensive server-side validation
      const validationErrors: Record<string, string> = {};

      // Author information validation
      if (!data.authorName || typeof data.authorName !== 'string' || data.authorName.length < 2 || data.authorName.length > 100) {
        validationErrors.authorName = 'Author name must be between 2 and 100 characters';
      }

      if (!data.authorEmail || !validateEmail(data.authorEmail)) {
        validationErrors.authorEmail = 'Invalid email format';
      }

      if (!data.authorTitle || typeof data.authorTitle !== 'string' || data.authorTitle.length < 2 || data.authorTitle.length > 100) {
        validationErrors.authorTitle = 'Author title must be between 2 and 100 characters';
      }

      if (!data.authorOrganization || typeof data.authorOrganization !== 'string' || data.authorOrganization.length < 2 || data.authorOrganization.length > 100) {
        validationErrors.authorOrganization = 'Organization must be between 2 and 100 characters';
      }

      // Optional fields validation
      if (data.authorLinkedIn && !validateURL(data.authorLinkedIn)) {
        validationErrors.authorLinkedIn = 'Invalid LinkedIn URL';
      }

      if (data.authorBio && data.authorBio.length > 1000) {
        validationErrors.authorBio = 'Bio is too long (max 1000 characters)';
      }

      // Article information validation
      if (!data.articleTitle || typeof data.articleTitle !== 'string' || data.articleTitle.length < 5 || data.articleTitle.length > 200) {
        validationErrors.articleTitle = 'Article title must be between 5 and 200 characters';
      }

      if (!data.articleDescription || typeof data.articleDescription !== 'string' || data.articleDescription.length < 20 || data.articleDescription.length > 500) {
        validationErrors.articleDescription = 'Article description must be between 20 and 500 characters';
      }


      // Article content validation with security checks
      if (!data.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) {
        validationErrors.blocks = 'Article content is required';
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
          validationErrors.blocks = `Article is too short (${totalWordCount} words, minimum 50 words)`;
        } else if (totalWordCount > 5000) {
          validationErrors.blocks = `Article is too long (${totalWordCount} words, maximum 5000 words)`;
        }

        // Check for suspicious content patterns in text blocks
        const suspiciousPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /data:.*base64/gi,
          /eval\s*\(/gi,
          /onclick\s*=/gi,
          /onload\s*=/gi,
          /onerror\s*=/gi,
          /vbscript:/gi,
          /livescript:/gi,
          /mocha:/gi,
          /charset\s*=/gi
        ];

        for (const block of data.blocks) {
          if (block.__component === 'content.rich-text' && block.content) {
            if (suspiciousPatterns.some(pattern => pattern.test(block.content))) {
              strapi.log.warn('Suspicious content detected in article submission', {
                email: data.authorEmail,
                title: data.articleTitle,
                suspiciousContent: true,
                blockComponent: block.__component
              });
              validationErrors.blocks = 'Article content contains prohibited elements';
              break;
            }
          }
        }
      }

      // Additional fields validation
      if (data.websiteUrl && !validateURL(data.websiteUrl)) {
        validationErrors.websiteUrl = 'Invalid website URL';
      }

      if (data.previousPublications && data.previousPublications.length > 1000) {
        validationErrors.previousPublications = 'Previous publications text is too long (max 1000 characters)';
      }

      if (data.socialMediaLinks && data.socialMediaLinks.length > 500) {
        validationErrors.socialMediaLinks = 'Social media links text is too long (max 500 characters)';
      }

      if (data.additionalNotes && data.additionalNotes.length > 1000) {
        validationErrors.additionalNotes = 'Additional notes text is too long (max 1000 characters)';
      }

      // Return first validation error with enhanced security logging
      const firstError = Object.keys(validationErrors)[0];
      if (firstError) {
        strapi.log.warn('Article submission validation failed', {
          field: firstError,
          error: validationErrors[firstError],
          authorEmail: data.authorEmail,
          clientIP,
          userAgent,
          timestamp: new Date().toISOString(),
          validationErrors: Object.keys(validationErrors)
        });
        return ctx.badRequest(validationErrors[firstError]);
      }

      // Sanitize all inputs (trim for storage but preserve during validation)
      const sanitizedData = {
        authorName: sanitizeInput(data.authorName).trim(),
        authorEmail: sanitizeInput(data.authorEmail).trim(),
        authorPhone: sanitizeInput(data.authorPhone || '').trim(),
        authorTitle: sanitizeInput(data.authorTitle).trim(),
        authorOrganization: sanitizeInput(data.authorOrganization).trim(),
        authorLinkedIn: sanitizeInput(data.authorLinkedIn || '').trim(),
        authorBio: sanitizeInput(data.authorBio || '').trim(),
        articleTitle: sanitizeInput(data.articleTitle).trim(),
        articleDescription: sanitizeInput(data.articleDescription).trim(),
        blocks: data.blocks, // Keep blocks as-is for processing
        publishDate: data.publishDate,
        previousPublications: sanitizeInput(data.previousPublications || '').trim(),
        websiteUrl: sanitizeInput(data.websiteUrl || '').trim(),
        socialMediaLinks: sanitizeInput(data.socialMediaLinks || '').trim(),
        additionalNotes: sanitizeInput(data.additionalNotes || '').trim(),
      };

      // Find or create author
      let author;
      const existingAuthors = await strapi.documents('api::author.author').findMany({
        filters: { email: sanitizedData.authorEmail },
        limit: 1
      });

      if (!existingAuthors || existingAuthors.length === 0) {
        // Create new author
        strapi.log.info('Creating new author with data:', {
          name: sanitizedData.authorName,
          email: sanitizedData.authorEmail,
          jobTitle: sanitizedData.authorTitle,
          organization: sanitizedData.authorOrganization
        });
        try {
          author = await strapi.documents('api::author.author').create({
            data: {
              name: sanitizedData.authorName,
              email: sanitizedData.authorEmail,
              phone_number: sanitizedData.authorPhone,
              jobTitle: sanitizedData.authorTitle,
              organization: sanitizedData.authorOrganization,
              linkedin_url: sanitizedData.authorLinkedIn,
              bio: sanitizedData.authorBio,
              previousPublications: sanitizedData.previousPublications,
              websiteUrl: sanitizedData.websiteUrl,
              socialMediaLinks: sanitizedData.socialMediaLinks,
              additionalNotes: sanitizedData.additionalNotes
            }
          });
          strapi.log.info('Created author result:', author);
        } catch (createError) {
          strapi.log.error('Error creating author:', createError);
          return ctx.internalServerError('Failed to create author');
        }
      } else {
        // Update existing author with new information
        const existingAuthor = existingAuthors[0];
        try {
          const updateData = {
            name: sanitizedData.authorName,
            phone_number: sanitizedData.authorPhone || (existingAuthor as any).phone_number,
            jobTitle: sanitizedData.authorTitle,
            organization: sanitizedData.authorOrganization,
            linkedin_url: sanitizedData.authorLinkedIn || (existingAuthor as any).linkedin_url,
            bio: sanitizedData.authorBio || (existingAuthor as any).bio,
            previousPublications: sanitizedData.previousPublications || (existingAuthor as any).previousPublications,
            websiteUrl: sanitizedData.websiteUrl || (existingAuthor as any).websiteUrl,
            socialMediaLinks: sanitizedData.socialMediaLinks || (existingAuthor as any).socialMediaLinks,
            additionalNotes: sanitizedData.additionalNotes || (existingAuthor as any).additionalNotes
          };

          // Use Document Service to update the author (Strapi v5)
          const authorDocumentId = existingAuthor.documentId;
          author = await strapi.documents('api::author.author').update({
            documentId: authorDocumentId,
            data: updateData
          });

          if (!author) {
            author = existingAuthor;
          }
        } catch (updateError) {
          strapi.log.error('Error updating author, using existing author:', updateError);
          author = existingAuthor;
        }
      }

      if (!author) {
        strapi.log.error('Failed to create or update author');
        return ctx.internalServerError('Failed to create or update author');
      }

      // Convert blocks to Strapi format and process media uploads
      const processedBlocks = [];

      for (const block of sanitizedData.blocks) {
        const processedBlock = { ...block };

        // Handle image blocks that might have files
        if (block.__component === 'content.image') {
          // Check if this block has an image file reference
          if (block.image && typeof block.image === 'string' && block.image.startsWith('blockImage_')) {
            // Find the corresponding file in the files object
            const imageFile = files[block.image];

            if (imageFile) {
              try {
                // Use the same upload logic as cover image
                const blockImageFile = Array.isArray(imageFile) ? imageFile[0] : imageFile;

                // Validate file type
                const fileType = blockImageFile.type || blockImageFile.mimetype;
                const fileName = blockImageFile.name || blockImageFile.originalFilename || '';
                const fileExtension = fileName.toLowerCase().split('.').pop();

                const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

                const isValidMimeType = fileType && allowedMimeTypes.includes(fileType);
                const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension);

                if (!isValidMimeType && !isValidExtension) {
                  strapi.log.warn('Invalid block image type uploaded:', {
                    type: blockImageFile.type,
                    mimetype: blockImageFile.mimetype,
                    fileName: fileName
                  });
                  // Skip this block if image is invalid
                  continue;
                }

                // Validate file size (max 5MB)
                const maxSizeBytes = 5 * 1024 * 1024; // 5MB
                if (blockImageFile.size > maxSizeBytes) {
                  strapi.log.warn('Block image too large:', {
                    size: blockImageFile.size,
                    maxSize: maxSizeBytes
                  });
                  // Skip this block if image is too large
                  continue;
                }

                // Upload the block image to Strapi media library
                const uploadService = strapi.plugin('upload').service('upload');
                const uploadedFiles = await uploadService.upload({
                  data: {
                    refId: null,
                    ref: null,
                    field: null,
                  },
                  files: [blockImageFile],
                });

                if (uploadedFiles && uploadedFiles.length > 0) {
                  // Replace the file reference with the uploaded file ID
                  processedBlock.image = uploadedFiles[0].id;
                  strapi.log.info('Block image uploaded successfully:', {
                    imageId: uploadedFiles[0].id,
                    filename: uploadedFiles[0].name
                  });
                } else {
                  // If upload failed, skip this block
                  strapi.log.error('Failed to upload block image');
                  continue;
                }
              } catch (uploadError) {
                strapi.log.error('Error uploading block image:', uploadError);
                // Skip this block if upload failed
                continue;
              }
            } else {
              // If no file found for the reference, skip the image property
              delete processedBlock.image;
            }
          } else if (block.image && typeof block.image === 'object') {
            // This shouldn't happen with the new implementation, but skip just in case
            strapi.log.warn('Unexpected image object in block, skipping');
            continue;
          }
          // If no image or image is already an ID, keep as is
        }

        // Clean up block ID for Strapi (Strapi will generate its own IDs)
        delete processedBlock.id;

        processedBlocks.push(processedBlock);
      }

      // Ensure we have at least one block
      if (processedBlocks.length === 0) {
        processedBlocks.push({
          __component: 'content.rich-text',
          content: 'محتوى المقال'
        });
      }

      // Generate unique slug for the article with improved handling
      const baseSlug = sanitizedData.articleTitle.toLowerCase()
        .normalize('NFD') // Normalize Unicode
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s\u0600-\u06FF]/g, '') // Keep only letters, numbers, spaces, and Arabic
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .trim()
        .substring(0, 50) || `article-${Date.now()}`; // Fallback if no valid characters

      let slug = baseSlug;
      let counter = 1;

      // Check if slug exists and generate unique one
      while (true) {
        const existingArticle = await strapi.documents('api::article.article').findMany({
          filters: { slug },
          limit: 1
        });

        if (!existingArticle || existingArticle.length === 0) {
          break;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create article as draft using Document Service (Strapi v5)
      const authorDocumentId = (author as any).documentId;

      if (!authorDocumentId) {
        strapi.log.error('Missing author documentId', {
          authorDocumentId,
          authorFields: Object.keys(author || {}),
          author: author
        });
        return ctx.internalServerError('Missing author');
      }

      // Prepare article data
      const articleData: any = {
        title: sanitizedData.articleTitle,
        slug,
        description: sanitizedData.articleDescription,
        blocks: processedBlocks,
        author: authorDocumentId,
        publish_date: sanitizedData.publishDate ? new Date(sanitizedData.publishDate) : null,
        is_featured: false,
        enable_cover_image: !!coverImageId, // Enable cover image if uploaded
        status: 'draft' // Strapi v5 uses status instead of publishedAt for draft/published
      };

      // Add cover image if uploaded
      if (coverImageId) {
        articleData.cover_image = coverImageId;
      }

      const article = await strapi.documents('api::article.article').create({
        data: articleData,
        status: 'draft' // Explicitly set as draft
      });

      // Send email notification to author
      try {
        // Calculate word count for the email
        const wordCount = sanitizedData.blocks.reduce((total, block) => {
          if (block.__component === 'content.rich-text' && block.content) {
            return total + getWordCount(block.content);
          } else if (block.__component === 'content.quote' && block.quote_text) {
            return total + getWordCount(block.quote_text);
          }
          return total;
        }, 0);

        // First, let's check if the email template exists
        try {
          const emailTemplates = await strapi.documents('api::email-template.email-template').findMany({
            filters: { subjectMatcher: 'Article Submission Confirmation' },
            limit: 1
          });

          strapi.log.info('Email template search result:', {
            found: emailTemplates && emailTemplates.length > 0,
            count: emailTemplates ? emailTemplates.length : 0,
            subjectMatcher: 'Article Submission Confirmation',
            templates: emailTemplates ? emailTemplates.map(t => ({
              id: t.id,
              documentId: t.documentId,
              subjectMatcher: t.subjectMatcher,
              subject: t.subject,
              from: t.from,
              hasHtml: !!t.html,
              hasText: !!t.text
            })) : []
          });

          if (!emailTemplates || emailTemplates.length === 0) {
            strapi.log.warn('No email template found with subjectMatcher "Article Submission Confirmation"');

            // Let's also check without publication state filter
            const allEmailTemplates = await strapi.documents('api::email-template.email-template').findMany({
              filters: { subjectMatcher: 'Article Submission Confirmation' },
              limit: 1
            });

            strapi.log.info('Email template search (including drafts):', {
              found: allEmailTemplates && allEmailTemplates.length > 0,
              count: allEmailTemplates ? allEmailTemplates.length : 0,
              templates: allEmailTemplates ? allEmailTemplates.map(t => ({
                id: t.id,
                documentId: t.documentId,
                subjectMatcher: t.subjectMatcher,
                subject: t.subject,
                publishedAt: t.publishedAt
              })) : []
            });
          }
        } catch (templateCheckError) {
          strapi.log.error('Error checking email template:', templateCheckError);
        }

        // Use strapi email service with specific subject matcher
        // The provider will look for a template with subjectMatcher: "Article Submission Confirmation"
        await strapi.plugin('email').service('email').send({
          to: sanitizedData.authorEmail,
          from: process.env.SMTP_FROM || 'noreply@shuru.com',
          subject: 'Article Submission Confirmation', // This matches the subjectMatcher
          // Template variables that can be used in email templates
          user: {
            username: sanitizedData.authorName,
            email: sanitizedData.authorEmail
          },
          article: {
            title: sanitizedData.articleTitle,
            description: sanitizedData.articleDescription,
            slug: article.slug,
            wordCount: wordCount,
            submissionDate: new Date().toLocaleDateString('ar-EG'),
            submissionTime: new Date().toLocaleTimeString('ar-EG'),
            hasCoverImage: !!coverImageId
          },
          author: {
            name: sanitizedData.authorName,
            email: sanitizedData.authorEmail,
            title: sanitizedData.authorTitle,
            organization: sanitizedData.authorOrganization,
            phone: sanitizedData.authorPhone
          },
          // Additional template variables for the email template
          appName: process.env.APP_NAME || 'شُرُوع',
          appUrl: process.env.APP_URL || 'https://shuru.sa',
          supportEmail: 'info@shuru.sa',
          companyName: process.env.COMPANY_NAME || 'شُرُوع'
        });

        strapi.log.info('Article submission confirmation email sent successfully', {
          articleId: article.documentId,
          authorEmail: sanitizedData.authorEmail,
          authorName: sanitizedData.authorName
        });

      } catch (emailError) {
        strapi.log.error('Failed to send article submission confirmation email:', emailError);
        // Don't fail the submission if email fails, just log it
      }

      // Log successful submission for security monitoring
      strapi.log.info('Article submission completed successfully', {
        articleId: article.documentId,
        authorEmail: sanitizedData.authorEmail,
        authorName: sanitizedData.authorName,
        articleTitle: sanitizedData.articleTitle,
        hasCoverImage: !!coverImageId,
        coverImageId: coverImageId,
        clientIP,
        userAgent,
        timestamp: new Date().toISOString(),
        wordCount: sanitizedData.blocks.reduce((total, block) => {
          if (block.__component === 'content.rich-text' && block.content) {
            return total + getWordCount(block.content);
          } else if (block.__component === 'content.quote' && block.quote_text) {
            return total + getWordCount(block.quote_text);
          }
          return total;
        }, 0)
      });

      return {
        success: true,
        message: 'Article submitted successfully as draft',
        articleId: article.documentId,
        slug: article.slug
      };

    } catch (error) {
      strapi.log.error('Error creating article:', error);
      return ctx.internalServerError('An error occurred while creating article');
    }
  }
};
