import type { Category, CategoryPageData } from "../app/category/type"

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

export function getStrapiURL() {
  return process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
}




export function transformCategoryToPageData(category: Category): CategoryPageData {
  const articles = category.articles || []

  // Get featured article as main article
  const mainArticle = articles.find((article) => article.is_featured) || articles[0]

  // Get side articles (excluding main article)
  const sideArticles = articles.filter((article) => article.id !== mainArticle?.id).slice(0, 2)

  // Get bottom images (remaining articles for image display)
  const bottomImages = articles
    .filter((article) => article.id !== mainArticle?.id && !sideArticles.find((side) => side.id === article.id))
    .slice(0, 2)

  // Get latest news items
  const latestNewsItems = articles
    .filter((article) => article.id !== mainArticle?.id)
    .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
    .slice(0, 3)

  return {
    category,
    mainArticle: mainArticle || articles[0],
    sideArticles,
    bottomImages,
    latestNews: {
      title: `Latest ${category.name} News`,
      items: latestNewsItems,
    },
  }}

  // lib/auth.ts - Authentication utilities
export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

// Get Strapi API URL


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

// Authentication API calls
export const authAPI = {
  // Login with email and password
  login: async (identifier: string, password: string): Promise<StrapiAuthResponse> => {
    return fetchAPI("/api/auth/local", {
      method: "POST",
      body: JSON.stringify({
        identifier,
        password,
      }),
    });
  },

  // Register new user
  register: async (username: string, email: string, password: string): Promise<StrapiAuthResponse> => {
    return fetchAPI("/api/auth/local/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ ok: boolean }> => {
    return fetchAPI("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });
  },

  // Reset password
  resetPassword: async (code: string, password: string, passwordConfirmation: string): Promise<StrapiAuthResponse> => {
    return fetchAPI("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        code,
        password,
        passwordConfirmation,
      }),
    });
  },

  // Get user profile (requires authentication)
  getProfile: async (token: string): Promise<StrapiUser> => {
    return fetchAPI("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Token management
export const tokenManager = {
  // Get token from storage
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
  },

  // Set token in storage
  setToken: (token: string, remember: boolean = false): void => {
    if (remember) {
      localStorage.setItem("jwt", token);
      sessionStorage.removeItem("jwt");
    } else {
      sessionStorage.setItem("jwt", token);
      localStorage.removeItem("jwt");
    }
  },

  // Remove token from storage
  removeToken: (): void => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
  },

  // Check if token exists
  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },
};

// User data management
export const userManager = {
  // Get user from storage
  getUser: (): StrapiUser | null => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  // Set user in storage
  setUser: (user: StrapiUser, remember: boolean = false): void => {
    const userString = JSON.stringify(user);
    if (remember) {
      localStorage.setItem("user", userString);
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("user", userString);
      localStorage.removeItem("user");
    }
  },

  // Remove user from storage
  removeUser: (): void => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!userManager.getUser() && tokenManager.hasToken();
  },
};