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
      const authors = await strapi.entityService.findMany('api::author.author', {
        filters: { email: sanitizedEmail },
        limit: 1
      });

      if (authors && authors.length > 0) {
        const author = authors[0] as any;
        return {
          exists: true,
          requiresLogin: false, // Since we're checking authors directly, no login required
          authorData: {
            name: sanitizeInput(author.name || ''),
            email: sanitizeInput(author.email || ''),
            phone_number: sanitizeInput(author.phone_number || ''),
            jobTitle: sanitizeInput(author.jobTitle || ''),
            organization: sanitizeInput(author.organization || ''),
            linkedin_url: sanitizeInput(author.linkedin_url || ''),
            bio: sanitizeInput(author.bio || ''),
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

      // Basic validation - log the attempt but allow all valid requests
      strapi.log.info('Article submission attempt', {
        ip: clientIP,
        userAgent: userAgent?.substring(0, 100), // Limit user agent length for logging
        timestamp: new Date().toISOString()
      });

      const data = ctx.request.body;

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

      if (!data.articleCategories || !Array.isArray(data.articleCategories) || data.articleCategories.length === 0) {
        validationErrors.articleCategories = 'At least one article category is required';
      } else if (data.articleCategories.some(cat => !cat || typeof cat !== 'string' || cat.trim().length === 0)) {
        validationErrors.articleCategories = 'All selected categories must be valid';
      }

      // Article content validation with security checks
      if (!data.articleContent || typeof data.articleContent !== 'string') {
        validationErrors.articleContent = 'Article content is required';
      } else {
        const wordCount = getWordCount(data.articleContent);
        if (wordCount < 50) {
          validationErrors.articleContent = `Article is too short (${wordCount} words, minimum 50 words)`;
        } else if (wordCount > 5000) {
          validationErrors.articleContent = `Article is too long (${wordCount} words, maximum 5000 words)`;
        }

        // Check for suspicious content patterns
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

        if (suspiciousPatterns.some(pattern => pattern.test(data.articleContent))) {
          strapi.log.warn('Suspicious content detected in article submission', {
            email: data.authorEmail,
            title: data.articleTitle,
            suspiciousContent: true
          });
          validationErrors.articleContent = 'Article content contains prohibited elements';
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
        articleCategories: data.articleCategories.map(cat => sanitizeInput(cat).trim()),
        articleContent: data.articleContent, // Don't sanitize markdown content
        articleKeywords: sanitizeInput(data.articleKeywords || '').trim(),
        publishDate: data.publishDate,
        previousPublications: sanitizeInput(data.previousPublications || '').trim(),
        websiteUrl: sanitizeInput(data.websiteUrl || '').trim(),
        socialMediaLinks: sanitizeInput(data.socialMediaLinks || '').trim(),
        additionalNotes: sanitizeInput(data.additionalNotes || '').trim(),
      };

      // Find or create author
      let author;
      const existingAuthors = await strapi.entityService.findMany('api::author.author', {
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
          author = await strapi.entityService.create('api::author.author', {
            data: {
              name: sanitizedData.authorName,
              email: sanitizedData.authorEmail,
              phone_number: sanitizedData.authorPhone,
              jobTitle: sanitizedData.authorTitle,
              organization: sanitizedData.authorOrganization,
              linkedin_url: sanitizedData.authorLinkedIn,
              bio: sanitizedData.authorBio
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
            phone_number: sanitizedData.authorPhone || existingAuthor.phone_number,
            jobTitle: sanitizedData.authorTitle,
            organization: sanitizedData.authorOrganization,
            linkedin_url: sanitizedData.authorLinkedIn || existingAuthor.linkedin_url,
            bio: sanitizedData.authorBio || existingAuthor.bio
          };

          // Use direct database query to bypass permission issues
          await strapi.db.query('api::author.author').update({
            where: { id: existingAuthor.id },
            data: updateData
          });

          // Fetch the updated author record
          author = await strapi.entityService.findOne('api::author.author', existingAuthor.documentId);

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

      // Find or create categories
      const categoryIds = [];

      for (const categoryName of sanitizedData.articleCategories) {
        let category;
        const existingCategories = await strapi.entityService.findMany('api::category.category', {
          filters: { name: categoryName },
          limit: 1
        });

        if (!existingCategories || existingCategories.length === 0) {
          // Create new category with improved slug generation
          const categorySlug = categoryName.toLowerCase()
            .normalize('NFD') // Normalize Unicode
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s\u0600-\u06FF]/g, '') // Keep only letters, numbers, spaces, and Arabic
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
            .trim() || `category-${Date.now()}`; // Fallback if no valid characters

          try {
            category = await strapi.entityService.create('api::category.category', {
              data: {
                name: categoryName,
                slug: categorySlug
              }
            });
          } catch (categoryError) {
            strapi.log.error('Error creating category:', categoryError);
            return ctx.internalServerError(`Failed to create category: ${categoryName}`);
          }
        } else {
          category = existingCategories[0];
        }

        if (!category) {
          strapi.log.error(`Failed to create or retrieve category: ${categoryName}`);
          return ctx.internalServerError(`Failed to create or retrieve category: ${categoryName}`);
        }

        categoryIds.push(category.id);
      }

      // Convert markdown content to blocks format
      const blocks = [
        {
          __component: 'content.rich-text' as const,
          content: sanitizedData.articleContent
        }
      ];

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
        const existingArticle = await strapi.entityService.findMany('api::article.article', {
          filters: { slug },
          limit: 1
        });

        if (!existingArticle || existingArticle.length === 0) {
          break;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create article as draft
      const authorId = (author as any).documentId || (author as any).id;

      if (!authorId || categoryIds.length === 0) {
        strapi.log.error('Missing author or category IDs', { authorId, categoryIds });
        return ctx.internalServerError('Missing author or category information');
      }

      const article = await strapi.entityService.create('api::article.article', {
        data: {
          title: sanitizedData.articleTitle,
          slug,
          description: sanitizedData.articleDescription,
          blocks,
          categories: categoryIds, // Direct array for many-to-many in Strapi v5
          author: authorId,
          publish_date: sanitizedData.publishDate ? new Date(sanitizedData.publishDate) : null,
          is_featured: false,
          publishedAt: null // This makes it a draft
        }
      } as any); // Type assertion to bypass TypeScript check

      // Log successful submission for security monitoring
      strapi.log.info('Article submission completed successfully', {
        articleId: article.documentId,
        authorEmail: sanitizedData.authorEmail,
        authorName: sanitizedData.authorName,
        articleTitle: sanitizedData.articleTitle,
        categories: sanitizedData.articleCategories,
        clientIP,
        userAgent,
        timestamp: new Date().toISOString(),
        wordCount: getWordCount(sanitizedData.articleContent)
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
