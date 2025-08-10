/**
 * Script to create default submit page content in Strapi
 * Run this after creating the content type to populate with default Arabic content
 */

const defaultSubmitPageContent = {
  pageTitle: "إرسال مقال",
  pageSubtitle: `<p>شاركنا أفكارك وخبراتك في عالم ريادة الأعمال والابتكار. نحن نسعى لنشر المحتوى المفيد والملهم الذي يساعد رواد الأعمال والمبتكرين في رحلتهم.</p>`,

  emailStepTitle: "التحقق من البريد الإلكتروني",
  emailStepDescription: "أدخل بريدك الإلكتروني للتحقق من وجود حساب كاتب مسجل أو إنشاء ملف جديد",

  authorStepTitle: "معلومات الكاتب",
  authorStepDescription: "أدخل معلوماتك الشخصية والمهنية لتعريف القراء بك",

  articleStepTitle: "تفاصيل المقال",
  articleStepDescription: "أدخل عنوان المقال، الوصف، الفئة والمحتوى",

  reviewStepTitle: "مراجعة الإرسال",
  reviewStepDescription: "راجع جميع المعلومات قبل الإرسال النهائي",

  successTitle: "تم إرسال المقال بنجاح!",
  successMessage: `<p>شكراً لك على إرسال مقالك. سيتم مراجعته من قبل فريقنا التحريري خلال 3-5 أيام عمل.</p><p>ستتلقى إشعاراً على بريدك الإلكتروني بمجرد الانتهاء من المراجعة.</p>`,

  successSteps: [
    { stepText: "سيتم مراجعة المقال خلال 3-5 أيام عمل" },
    { stepText: "ستتلقى إشعاراً بالموافقة أو التعديل المطلوب" },
    { stepText: "بعد الموافقة، سيتم نشر المقال على المنصة" },
    { stepText: "يمكنك متابعة إحصائيات المقال من ملفك الشخصي" }
  ],

  returnButtonText: "العودة للرئيسية",

  guidelinesTitle: "إرشادات النشر",
  contentCriteriaTitle: "معايير المحتوى",
  contentCriteriaItems: [
    { itemText: "المحتوى يجب أن يكون أصلياً وغير منشور في مكان آخر" },
    { itemText: "الحد الأدنى للمقال 300 كلمة والحد الأقصى 3000 كلمة" },
    { itemText: "المحتوى يجب أن يكون ذو قيمة وفائدة للقارئ" },
    { itemText: "استخدام اللغة العربية الفصحى أو العامية المفهومة" },
    { itemText: "تجنب المحتوى المسيء أو المخالف للقيم الأخلاقية" },
    { itemText: "إرفاق صورة غلاف عالية الجودة (اختيارية)" }
  ],

  reviewProcessTitle: "عملية المراجعة",
  reviewProcessItems: [
    { itemText: "مراجعة أولية للمحتوى والجودة (24 ساعة)" },
    { itemText: "تدقيق لغوي وتحريري (2-3 أيام)" },
    { itemText: "مراجعة نهائية من رئيس التحرير (1-2 أيام)" },
    { itemText: "إشعار الكاتب بالقرار النهائي" },
    { itemText: "نشر المقال وإشعار الكاتب" }
  ],

  validationMessages: {
    email: {
      required: "البريد الإلكتروني مطلوب",
      invalid: "تنسيق البريد الإلكتروني غير صحيح"
    },
    author: {
      nameRequired: "اسم الكاتب مطلوب",
      nameMinLength: "الاسم يجب أن يكون على الأقل حرفين",
      nameMaxLength: "الاسم طويل جداً (الحد الأقصى 100 حرف)",
      emailRequired: "البريد الإلكتروني مطلوب",
      emailInvalid: "تنسيق البريد الإلكتروني غير صحيح",
      titleRequired: "المسمى الوظيفي مطلوب",
      titleMinLength: "المسمى الوظيفي يجب أن يكون على الأقل حرفين",
      titleMaxLength: "المسمى الوظيفي طويل جداً (الحد الأقصى 100 حرف)",
      organizationRequired: "اسم المؤسسة مطلوب",
      organizationMinLength: "اسم المؤسسة يجب أن يكون على الأقل حرفين",
      organizationMaxLength: "اسم المؤسسة طويل جداً (الحد الأقصى 100 حرف)",
      phoneInvalid: "رقم الهاتف غير صحيح",
      linkedinInvalid: "رابط LinkedIn غير صحيح",
      bioMaxLength: "النبذة التعريفية طويلة جداً (الحد الأقصى 1000 حرف)"
    },
    article: {
      titleRequired: "عنوان المقال مطلوب",
      titleMinLength: "عنوان المقال يجب أن يكون على الأقل 5 أحرف",
      titleMaxLength: "عنوان المقال طويل جداً (الحد الأقصى 200 حرف)",
      descriptionRequired: "وصف المقال مطلوب",
      descriptionMinLength: "وصف المقال يجب أن يكون على الأقل 20 حرف",
      descriptionMaxLength: "وصف المقال طويل جداً (الحد الأقصى 500 حرف)",
      categoryRequired: "فئة المقال مطلوبة",
      contentRequired: "محتوى المقال مطلوب",
      contentMinWords: "المقال يجب أن يحتوي على الأقل على {min} كلمة",
      contentMaxWords: "المقال يحتوي على كلمات أكثر من المسموح ({max} كلمة)",
      keywordsMaxLength: "الكلمات المفتاحية طويلة جداً (الحد الأقصى 200 حرف)",
      publishDateInvalid: "تاريخ النشر غير صحيح"
    },
    file: {
      fileTooLarge: "حجم الملف كبير جداً (الحد الأقصى {max} ميجابايت)",
      fileTypeNotSupported: "نوع الملف غير مدعوم. الأنواع المسموحة: {types}"
    },
    terms: {
      mustAccept: "يجب الموافقة على الشروط والأحكام"
    }
  },

  systemMessages: {
    loading: "جاري التحميل...",
    submitting: "جاري الإرسال...",
    checkingEmail: "جاري التحقق من البريد الإلكتروني...",
    uploadingFile: "جاري رفع الملف...",
    success: "تم بنجاح",
    error: "حدث خطأ",
    tryAgain: "يرجى المحاولة مرة أخرى",
    networkError: "خطأ في الاتصال بالشبكة",
    serverError: "خطأ في الخادم",
    unknownError: "حدث خطأ غير متوقع"
  },

  enableEmailCheck: true,
  minWordCount: 300,
  maxWordCount: 3000,
  maxFileSize: 5,
  allowedFileTypes: "jpg,jpeg,png,webp",
  termsAndConditionsUrl: "/terms",
  privacyPolicyUrl: "/privacy",

  publishedAt: new Date().toISOString()
};

export default defaultSubmitPageContent;
