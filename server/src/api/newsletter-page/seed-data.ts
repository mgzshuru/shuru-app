/**
 * Newsletter Page Seed Data
 * Run this to populate the newsletter page with default content
 */

export const newsletterPageSeedData = {
  seo: {
    metaTitle: "اشترك في النشرة الإخبارية - شُرُو",
    metaDescription: "اكتشف وجهات نظر جديدة. اشترك للحصول على أهم التغطيات الإخبارية في صندوق الوارد الخاص بك.",
    keywords: "نشرة إخبارية، أخبار، تكنولوجيا، ريادة أعمال، استثمار، شُرُو",
    metaRobots: "index,follow",
    structuredData: null,
    metaViewport: "width=device-width, initial-scale=1",
    canonicalURL: "/subscribe"
  },
  heroSection: {
    title: "استكشف النشرات الإخبارية\nللشركات السريعة",
    subtitle: "اكتشف وجهات نظر جديدة. اشترك للحصول على أهم التغطيات الإخبارية في صندوق الوارد الخاص بك.",
    backgroundColor: "#ff6b5a",
    newsletterCategories: [
      {
        name: "COMPASS",
        contentItems: ["نصائح الاستثمار", "أفكار ريادية", "تحليلات السوق"]
      },
      {
        name: "CO.DESIGN",
        contentItems: ["التصميم المبتكر", "تجربة المستخدم", "الإبداع الرقمي"]
      },
      {
        name: "IMPACT",
        contentItems: ["التأثير الاجتماعي", "الاستدامة", "الابتكار المسؤول"]
      },
      {
        name: "PLUGGED IN",
        contentItems: ["أخبار التكنولوجيا", "الذكاء الاصطناعي", "ريادة الأعمال"]
      },
      {
        name: "MODERN CEO",
        contentItems: ["القيادة الحديثة", "استراتيجيات الأعمال", "إدارة الفرق"]
      }
    ]
  },
  subscriptionSection: {
    formTitle: "انضم إلى مجتمعنا",
    formSubtitle: "احصل على أحدث الأخبار والتحليلات",
    emailPlaceholder: "البريد الإلكتروني *",
    namePlaceholder: "الاسم *",
    submitButtonText: "اشترك الآن",
    loadingText: "جاري الاشتراك...",
    successTitle: "تم الاشتراك بنجاح!",
    successMessage: "شكراً لك. ستصلك أحدث النشرات قريباً في صندوق الوارد.",
    privacyPolicyText: "سياسة الخصوصية",
    termsOfServiceText: "شروط الخدمة",
    privacyPolicyUrl: "/privacy-policy",
    termsOfServiceUrl: "/terms-of-service",
    features: [
      {
        "icon": "CheckCircle",
        "text": "محتوى حصري"
      },
      {
        "icon": "Mail",
        "text": "أسبوعياً"
      }
    ]

  },
  isActive: true,
  publishedAt: new Date().toISOString()
};

/**
 * Instructions for seeding data:
 *
 * 1. Start your Strapi server
 * 2. Go to Content Manager -> Single Types -> Newsletter Page
 * 3. Create a new entry using the data structure above
 * 4. For images, you can use the default Unsplash URLs from the React component:
 *    - Main image: https://images.unsplash.com/photo-1551434678-e076c223a692
 *    - Additional images:
 *      - https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d
 *      - https://images.unsplash.com/photo-1460925895917-afdab827c52f
 */
