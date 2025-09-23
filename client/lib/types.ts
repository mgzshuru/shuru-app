// Credentials for authentication
export type Credentials = {
  username?: string;
  email?: string;
  identifier?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
  code?: string;
};

// Form state for form handling and server actions
export type FormState = {
  errors: Credentials;
  values: Credentials;
  message?: string;
  success?: boolean;
};

export type SessionPayload = {
  user?: any;
  expiresAt?: Date;
  jwt?: string;
};

export interface GlobalData {
  siteName: string;
  siteDescription: string;
  favicon?: {
    url: string;
    alternativeText?: string;
  };
  defaultSeo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_image?: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
  };
  header: HeaderData;
  footer: FooterData;
}

export interface HeaderData {
  logo: {
    logoImage: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
    alt: string;
  };
  navigation: NavigationMenu;
}

export interface FooterData {
  logo: {
    logoImage?: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
    mobileImage?: {
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
    };
    alt?: string;
  };
  socialLinks: SocialLink[];
  bottomLinks: FooterLinkSection[];
  copyright: {
    companyName: string;
    year: number;
    allRightsReserved: boolean;
    customText?: string;
    showCurrentYear: boolean;
  };
}

export interface NavigationItem {
  label: string;
  url: string;
  openInNewTab: boolean;
  order: number;
  onHeader: boolean;
  onSideBar: boolean;
}

export interface NavigationMenu {
  primaryMenuItems: NavigationItem[];
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'discord' | 'github' | 'telegram' | 'whatsapp' | 'pinterest' | 'snapchat' | 'reddit' | 'custom';
  link: {
    text: string;
    href: string;
    openInNewTab: boolean;
  };
  order: number;
}

export interface FooterLinkSection {
  link: {
    text: string;
    href: string;
    openInNewTab: boolean;
  };
  order: number;
}

export interface Article {
  id: number
  documentId: string
  title: string
  description?: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  publish_date: string
  is_featured: boolean
  cover_image?: {
    id: number
    documentId: string
    name: string
    alternativeText: string
    url: string
    width?: number
    height?: number
  }
  enable_cover_image?: boolean
  categories?: {
    id: number
    documentId: string
    name: string
    slug: string
    description?: string
    SEO?: SEOComponent
  }[]
  author?: {
    id: number
    documentId: string
    name: string
    email: string
    jobTitle?: string
    organization?: string
    phone_number?: string
    linkedin_url?: string
    createdAt: string
    updatedAt: string
    publishedAt?: string
    avatar?: {
      id: number
      documentId: string
      url: string
      alternativeText: string
      width?: number
      height?: number
    }
  }
  blocks: Block[]
  SEO?: SEOComponent
  magazine_issues?: MagazineIssue[]
  newsletters?: NewsletterEdition[]
  views?: number
}

// Based on your schema's dynamic zone components
export type Block =
  | RichTextBlock
  | ImageBlock
  | VideoEmbedBlock
  | QuoteBlock
  | CodeBlock
  | GalleryBlock
  | CallToActionBlock
  | MediaBlock
  | SliderBlock

export interface RichTextBlock {
  __component: "content.rich-text"
  id: number
  content: string
}

export interface ImageBlock {
  __component: "content.image"
  id: number
  image: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }
  alt_text: string
  caption?: string
  width: 'small' | 'medium' | 'large' | 'full'
}

export interface VideoEmbedBlock {
  __component: "content.video-embed"
  id: number
  video_url: string
  title?: string
  description?: string
  autoplay: boolean
  thumbnail?: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }
}

export interface QuoteBlock {
  __component: "content.quote"
  id: number
  quote_text: string
  author?: string
  author_title?: string
  style: 'default' | 'highlighted' | 'pullquote'
}

export interface CodeBlock {
  __component: "content.code-block"
  id: number
  code: string
  language: string
  title?: string
  show_line_numbers: boolean
}

export interface GalleryBlock {
  __component: "content.gallery"
  id: number
  title?: string
  description?: string
  images: {
    id: number
    documentId: string
    name: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }[]
  layout: 'grid' | 'carousel' | 'masonry'
  columns: number
}

export interface CallToActionBlock {
  __component: "content.call-to-action"
  id: number
  title: string
  description?: string
  button_text: string
  button_url: string
  style: 'primary' | 'secondary' | 'outline'
  background_color?: string
  open_in_new_tab: boolean
}

export interface MediaBlock {
  __component: "shared.media"
  id: number
  files: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }[]
}

export interface SliderBlock {
  __component: "shared.slider"
  id: number
  files: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }[]
}

export interface SEOComponent {
  id: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }
}

export interface Category {
  id: number
  documentId: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  parent_category?: Category
  children_categories?: Category[]
  articles?: Article[]
  SEO?: SEOComponent
  order?: number
}

export interface Author {
  id: number
  documentId: string
  name: string
  email: string
  jobTitle?: string
  organization?: string
  phone_number?: string
  linkedin_url?: string
  bio?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  avatar?: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }
  articles?: Article[]
}

export interface MagazineIssue {
  id: number
  documentId: string
  title: string
  slug: string
  description: string  // This is richtext in Strapi
  issue_number: number
  publish_date: string
  is_featured: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  cover_image: {
    id: number
    documentId: string
    url: string
    alternativeText: string
    width?: number
    height?: number
  }
  pdf_attachment?: {
    id: number
    documentId: string
    name: string
    url: string
  }
  articles?: Article[]
  SEO?: SEOComponent
}

export interface NewsletterEdition {
  id: number
  documentId: string
  subject: string
  slug: string
  content: string
  sent_at?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  featured_articles?: Article[]
  pdf_archive?: {
    id: number
    documentId: string
    name: string
    url: string
  }
}

export interface Subscriber {
  id: number
  documentId: string
  email: string
  name: string  // Required in the schema
  is_verified: boolean
  subscribed_at: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// Global settings type
export interface Global {
  id: number
  documentId: string
  siteName: string
  siteDescription: string
  defaultSeo?: SEOComponent
  favicon?: {
    id: number
    documentId: string
    url: string
    alternativeText: string
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface Page {
  id: number
  documentId: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  blocks?: Block[]
  SEO?: SEOComponent
}

export interface NewsletterCategory {
  name: string;
  content?: string; // Rich text content as HTML string
}

export interface NewsletterFeature {
  icon: string;
  text: string;
}

export interface NewsletterHeroSection {
  title: string;
  subtitle: string;
  backgroundColor: string;
  newsletterCategories?: NewsletterCategory[];
}

export interface NewsletterSubscriptionSection {
  formTitle: string;
  formSubtitle: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  submitButtonText: string;
  loadingText: string;
  successTitle: string;
  successMessage: string;
  privacyPolicyText?: string;
  termsOfServiceText?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  features?: NewsletterFeature[];
}

export interface NewsletterPageData {
  id: number;
  documentId: string;
  seo?: SEOComponent;
  heroSection: NewsletterHeroSection;
  subscriptionSection: NewsletterSubscriptionSection;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Contact Message Types
export interface ContactMessage {
  id: number;
  documentId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  is_read: boolean;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Page Types
export interface ContactPageData {
  id: number;
  documentId: string;
  seo?: SEOComponent;
  heroSection: ContactHeroSection;
  contactInformation: ContactInformation;
  formSettings: ContactFormSettings;
  additionalSections?: ContactAdditionalSection[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ContactHeroSection {
  title: string;
  subtitle: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
}

export interface ContactInformation {
  title: string;
  emails?: ContactItem[];
  phones?: ContactItem[];
  addresses?: AddressItem[];
  officeHours?: OfficeHours;
  socialLinks?: ContactSocialLink[];
  additionalInfo?: string;
}

export interface ContactItem {
  label: string;
  value: string;
  icon?: string;
  isPrimary: boolean;
  isPublic: boolean;
  description?: string;
}

export interface AddressItem {
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isPrimary: boolean;
  officeType: 'main' | 'branch' | 'warehouse' | 'other';
  description?: string;
}

export interface OfficeHours {
  title: string;
  weekdayHours: string;
  weekendHours?: string;
  specialHours?: string;
  timezone: string;
  isOpen24Hours: boolean;
  holidayMessage?: string;
  emergencyContact?: string;
}

export interface ContactSocialLink {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'snapchat' | 'whatsapp' | 'telegram' | 'other';
  url: string;
  label?: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface ContactFormSettings {
  formTitle: string;
  formDescription?: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  companyPlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  submitButtonText: string;
  loadingText: string;
  successTitle: string;
  successMessage: string;
  privacyText: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  enableCaptcha: boolean;
  enableFileUpload: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export interface ContactAdditionalSection {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface MapSection extends ContactAdditionalSection {
  __component: 'contact.map-section';
  title: string;
  description?: string;
  mapProvider: 'google' | 'mapbox' | 'openstreetmap';
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  markers?: MapMarker[];
  showZoomControls: boolean;
  showFullscreenControl: boolean;
  mapStyle: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  height: number;
}

export interface MapMarker {
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  icon?: string;
  color: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface OfficeLocationsSection extends ContactAdditionalSection {
  __component: 'contact.office-locations';
  title: string;
  description?: string;
  offices: OfficeLocation[];
  showOnMap: boolean;
}

export interface OfficeLocation {
  name: string;
  type: 'headquarters' | 'branch' | 'regional' | 'satellite';
  address: AddressItem;
  contact: ContactItem[];
  officeHours: OfficeHours;
  image?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  description?: string;
  services?: any;
  managers?: any;
}

export interface FAQSection extends ContactAdditionalSection {
  __component: 'contact.faq-section';
  title: string;
  description?: string;
  faqs: FAQItem[];
  showContactPrompt: boolean;
  contactPromptText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'billing' | 'support' | 'partnership' | 'other';
  order: number;
  isPublished: boolean;
  relatedLinks?: any;
}