export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Get Strapi API URL
export function getStrapiURL() {
  // Use NEXT_PUBLIC_STRAPI_API_URL for client-side consistency
  // Fall back to STRAPI_BASE_URL for server-side calls
  return process.env.NEXT_PUBLIC_STRAPI_API_URL ?? process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
}

// Fetch wrapper for Strapi API calls
export const fetchAPI = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const requestUrl = getStrapiURL() + endpoint;
  const response = await fetch(requestUrl, mergedOptions);

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};

// Safe API call wrapper for build-time operations
export const safeBuildTimeApiCall = async <T>(
  apiCall: () => Promise<T>,
  fallback: T,
  timeoutMs: number = 10000
): Promise<T> => {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('API call timeout during build')), timeoutMs)
    );

    const result = await Promise.race([
      apiCall(),
      timeoutPromise
    ]);

    return result;
  } catch (error) {
    console.warn('API call failed during build, using fallback:', error);
    return fallback;
  }
};

// Extract clean text from rich-text content for SEO descriptions
export const extractTextFromRichContent = (content: string, maxLength: number = 160): string => {
  if (!content) return '';

  // First, check if content is markdown and convert to HTML if needed
  let htmlContent = content;
  const isMarkdown = content.includes('#') || content.includes('**') || content.includes('- ');

  if (isMarkdown) {
    // Simple markdown to text conversion for common patterns
    htmlContent = content
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/^[-*+]\s+/gm, ''); // Remove list bullets
  }

  // Strip HTML tags and get clean text
  const cleanText = htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[#\w]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Truncate to desired length while preserving word boundaries
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > maxLength * 0.8 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};