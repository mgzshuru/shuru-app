/**
 * Default content for submit page in Arabic
 * This data should be imported into Strapi to populate the submit-page-content single type
 */

const defaultSubmitPageContent = {
  pageTitle: "إرسال مقال",
  pageSubtitle: `<p>انضم إلى مجتمع الكتّاب والخبراء في شروع وشارك معرفتك مع آلاف القراء المهتمين بريادة الأعمال والابتكار</p>`,

  // Step titles and descriptions
  emailStepTitle: "التحقق من البريد الإلكتروني",
  emailStepDescription: "أدخل بريدك الإلكتروني للتحقق من وجود حساب مرتبط به",

  authorStepTitle: "معلومات الكاتب",
  authorStepDescription: "أخبرنا عن نفسك ومؤهلاتك المهنية",

  articleStepTitle: "تفاصيل المقال",
  articleStepDescription: "أخبرنا عن المقال الذي تريد نشره",

  reviewStepTitle: "مراجعة وإرسال",
  reviewStepDescription: "راجع معلوماتك وأرسل المقال للمراجعة",

  // Success page content
  successTitle: "تم إرسال المقال بنجاح!",
  successMessage: `<p><strong>شكراً لك على مشاركة خبرتك معنا!</strong></p>
    <p>تم استلام مقالك وسيقوم فريقنا بمراجعته خلال 3-5 أيام عمل. سنتواصل معك عبر البريد الإلكتروني لإعلامك بحالة المقال.</p>`,

  successSteps: [
    { stepText: "ستتلقى رسالة تأكيد عبر البريد الإلكتروني خلال دقائق" },
    { stepText: "سيراجع فريقنا المقال خلال 3-5 أيام عمل" },
    { stepText: "سنتواصل معك بشأن أي تعديلات مطلوبة" },
    { stepText: "بعد الموافقة، سيتم النشر وفقاً لجدولنا التحريري" }
  ],

  returnButtonText: "العودة للرئيسية",

  // Guidelines
  guidelinesTitle: "إرشادات النشر",
  contentCriteriaTitle: "معايير المحتوى",
  contentCriteriaItems: [
    { itemText: "يجب أن يكون المحتوى أصلياً وغير منشور من قبل" },
    { itemText: "يركز على ريادة الأعمال، الابتكار، أو القيادة" },
    { itemText: "يقدم قيمة حقيقية ومعلومات عملية للقراء" },
    { itemText: "مكتوب باللغة العربية بأسلوب واضح ومهني" },
    { itemText: "خالٍ من المحتوى التجاري المباشر أو الإعلانات" },
    { itemText: "يحترم حقوق الملكية الفكرية والنشر" }
  ],

  reviewProcessTitle: "عملية المراجعة",
  reviewProcessItems: [
    { itemText: "مراجعة أولية لضمان مطابقة المعايير الأساسية" },
    { itemText: "تدقيق لغوي ونحوي متخصص" },
    { itemText: "مراجعة تحريرية لضمان جودة المحتوى" },
    { itemText: "تحديد موعد النشر حسب الجدول التحريري" },
    { itemText: "إشعار الكاتب بموعد النشر المتوقع" }
  ],

  // Validation messages
  validationMessages: {
    author: {
      nameMinLength: "الاسم يجب أن يكون على الأقل حرفين",
      nameMaxLength: "الاسم طويل جداً (الحد الأقصى 100 حرف)",
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "تنسيق البريد الإلكتروني غير صحيح",
      titleRequired: "المسمى الوظيفي مطلوب (على الأقل حرفين)",
      titleMaxLength: "المسمى الوظيفي طويل جداً (الحد الأقصى 100 حرف)",
      organizationRequired: "المؤسسة مطلوبة (على الأقل حرفين)",
      organizationMaxLength: "اسم المؤسسة طويل جداً (الحد الأقصى 100 حرف)",
      phoneInvalid: "تنسيق رقم الهاتف غير صحيح",
      linkedinInvalid: "رابط LinkedIn غير صحيح",
      bioMaxLength: "النبذة طويلة جداً (الحد الأقصى 1000 حرف)"
    },
    article: {
      titleRequired: "عنوان المقال مطلوب (على الأقل 5 أحرف)",
      titleMaxLength: "عنوان المقال طويل جداً (الحد الأقصى 200 حرف)",
      descriptionRequired: "وصف المقال مطلوب (على الأقل 20 حرف)",
      descriptionMaxLength: "وصف المقال طويل جداً (الحد الأقصى 500 حرف)",
      categoryRequired: "فئة المقال مطلوبة",
      contentRequired: "محتوى المقال مطلوب",
      contentMinWords: "محتوى المقال قصير جداً ({count} كلمة، الحد الأدنى {min} كلمة)",
      contentMaxWords: "محتوى المقال طويل جداً ({count} كلمة، الحد الأقصى {max} كلمة)",
      keywordsMaxLength: "الكلمات المفتاحية طويلة جداً (الحد الأقصى 200 حرف)"
    },
    file: {
      fileTooLarge: "حجم الصورة كبير جداً (الحد الأقصى {max} ميجابايت)",
      fileTypeNotSupported: "نوع الملف غير مدعوم. الأنواع المسموحة: {types}"
    },
    terms: {
      mustAccept: "يجب الموافقة على الشروط والأحكام"
    },
    email: {
      invalid: "البريد الإلكتروني غير صحيح"
    }
  },

  // System messages
  systemMessages: {
    loading: "جاري التحميل...",
    submitting: "جاري الإرسال...",
    success: "تم بنجاح!",
    error: "حدث خطأ، يرجى المحاولة مرة أخرى",
    networkError: "خطأ في الاتصال، تحقق من الإنترنت"
  },

  // Settings
  enableEmailCheck: true,
  minWordCount: 50,
  maxWordCount: 5000,
  maxFileSize: 5,
  allowedFileTypes: "jpg,jpeg,png,webp",
  termsAndConditionsUrl: "/terms",
  privacyPolicyUrl: "/privacy",

  // SEO
  seo: {
    meta_title: "إرسال مقال - شروع",
    meta_description: "شارك خبرتك وتجربتك مع مجتمع شروع. أرسل مقالك في ريادة الأعمال والابتكار والقيادة للنشر على منصتنا.",
    meta_keywords: "إرسال مقال، مشاركة المحتوى، ريادة الأعمال، الابتكار، القيادة، شروع"
  }
};

/**
 * Instructions for importing this data:
 *
 * 1. Go to Strapi Admin Panel
 * 2. Navigate to Content Manager > Single Types > Submit Page Content
 * 3. Create new entry if it doesn't exist
 * 4. Copy and paste the relevant data from above into the form fields
 * 5. For JSON fields (validationMessages, systemMessages), paste the JSON objects
 * 6. Save and publish the entry
 *
 * Alternatively, you can use the Strapi API to import this data programmatically
 */

export default defaultSubmitPageContent;
