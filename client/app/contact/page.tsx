'use client';

import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, Building, MessageSquare, Send, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm, ContactFormData } from '@/app/actions/contact';
import { getContactPageData } from '@/lib/strapi-client';
import { ContactPageData } from '@/lib/types';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [contactPageData, setContactPageData] = useState<ContactPageData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Load contact page data
  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await getContactPageData();
        setContactPageData(data);

        // Update page title dynamically
        if (data?.seo?.meta_title) {
          document.title = data.seo.meta_title;
        }

        // Update meta description
        if (data?.seo?.meta_description) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.seo.meta_description);
          }
        }
      } catch (error) {
        console.error('Failed to load contact page data:', error);
        // Data will remain null, page will use fallback content
      } finally {
        setIsLoadingData(false);
      }
    };

    loadContactData();
  }, []);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'الموضوع مطلوب';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'الرسالة مطلوبة';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'يجب أن تكون الرسالة 10 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setSubmitError(result.error || 'حدث خطأ أثناء إرسال الرسالة');
        if (result.field) {
          setErrors(prev => ({ ...prev, [result.field]: result.error }));
        }
      }
    } catch (error) {
      setSubmitError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Development Notice */}
      {!contactPageData && !isLoadingData && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-yellow-800">
              📝 يتم عرض المحتوى الافتراضي. قم بإعداد صفحة التواصل في Strapi لعرض المحتوى المخصص.
              {' '}
              <a href="/contact/debug" className="underline hover:no-underline">
                تشخيص المشاكل
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div
        className="text-white py-16 lg:py-24"
        style={{
          backgroundColor: contactPageData?.heroSection?.backgroundColor || '#000000',
          color: contactPageData?.heroSection?.textColor || '#ffffff'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tight">
            {contactPageData?.heroSection?.title || 'تواصل معنا'}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {contactPageData?.heroSection?.subtitle || 'نحن هنا للاستماع إليك. تواصل معنا لأي استفسارات أو اقتراحات أو تعاون'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">
                  {contactPageData?.contactInformation?.title || 'معلومات التواصل'}
                </h2>
                <div className="space-y-6">
                  {/* Emails */}
                  {contactPageData?.contactInformation?.emails && contactPageData.contactInformation.emails.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="bg-black p-3 rounded-full flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">البريد الإلكتروني</h3>
                        {contactPageData.contactInformation.emails.map((email, index) => (
                          <p key={index} className="text-gray-600">{email.value}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phones */}
                  {contactPageData?.contactInformation?.phones && contactPageData.contactInformation.phones.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="bg-black p-3 rounded-full flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">الهاتف</h3>
                        {contactPageData.contactInformation.phones.map((phone, index) => (
                          <p key={index} className="text-gray-600">{phone.value}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Addresses */}
                  {contactPageData?.contactInformation?.addresses && contactPageData.contactInformation.addresses.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="bg-black p-3 rounded-full flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">العنوان</h3>
                        {contactPageData.contactInformation.addresses.map((address, index) => (
                          <div key={index} className="text-gray-600 mb-1">
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>{address.city}, {address.country}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Office Hours */}
                  {contactPageData?.contactInformation?.officeHours && (
                    <div className="flex items-start gap-4">
                      <div className="bg-black p-3 rounded-full flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {contactPageData.contactInformation.officeHours.title || 'ساعات العمل'}
                        </h3>
                        <p className="text-gray-600">{contactPageData.contactInformation.officeHours.weekdayHours}</p>
                        {contactPageData.contactInformation.officeHours.weekendHours && (
                          <p className="text-gray-600">{contactPageData.contactInformation.officeHours.weekendHours}</p>
                        )}
                        {contactPageData.contactInformation.officeHours.specialHours && (
                          <p className="text-gray-600">{contactPageData.contactInformation.officeHours.specialHours}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {contactPageData?.contactInformation?.additionalInfo && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600 text-sm">{contactPageData.contactInformation.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-black mb-6">
                {contactPageData?.formSettings?.formTitle || 'إرسال رسالة'}
              </h2>

              {contactPageData?.formSettings?.formDescription && (
                <p className="text-gray-600 mb-6">{contactPageData.formSettings.formDescription}</p>
              )}

              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-800 font-semibold">
                      {contactPageData?.formSettings?.successTitle || 'تم إرسال الرسالة بنجاح!'}
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      {contactPageData?.formSettings?.successMessage || 'شكراً لتواصلك معنا. سنرد على رسالتك في أقرب وقت ممكن.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">الاسم الكامل *</label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={isLoading}
                        className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder={contactPageData?.formSettings?.namePlaceholder || "أدخل اسمك الكامل"}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 ml-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">البريد الإلكتروني *</label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={isLoading}
                        className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                          errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder={contactPageData?.formSettings?.emailPlaceholder || "example@domain.com"}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 ml-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">رقم الهاتف</label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={isLoading}
                        className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={contactPageData?.formSettings?.phonePlaceholder || "+966 50 123 4567"}
                      />
                    </div>
                  </div>

                  {/* Company Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">اسم الشركة/المؤسسة</label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Building className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        disabled={isLoading}
                        className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-400 text-base transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={contactPageData?.formSettings?.companyPlaceholder || "اسم الشركة أو المؤسسة"}
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">الموضوع *</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      disabled={isLoading}
                      className={`w-full pr-12 pl-4 py-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.subject ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                      }`}
                      placeholder={contactPageData?.formSettings?.subjectPlaceholder || "موضوع الرسالة"}
                    />
                  </div>
                  {errors.subject && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">الرسالة *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    disabled={isLoading}
                    rows={6}
                    className={`w-full p-4 border-2 focus:outline-none focus:ring-4 focus:ring-gray-100 text-base transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
                      errors.message ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                    }`}
                    placeholder={contactPageData?.formSettings?.messagePlaceholder || "اكتب رسالتك هنا..."}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 ml-1" />
                      {errors.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    {formData.message.length}/2000 حرف
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isSubmitted}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 text-base transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
                      {contactPageData?.formSettings?.loadingText || 'جاري الإرسال...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {contactPageData?.formSettings?.submitButtonText || 'إرسال الرسالة'}
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  {contactPageData?.formSettings?.privacyText || 'بإرسال هذه الرسالة، أنت توافق على'}{' '}
                  <a
                    href={contactPageData?.formSettings?.privacyPolicyUrl || '/privacy'}
                    className="text-black hover:underline"
                  >
                    سياسة الخصوصية
                  </a>
                  {' '}و{' '}
                  <a
                    href={contactPageData?.formSettings?.termsUrl || '/terms'}
                    className="text-black hover:underline"
                  >
                    شروط الاستخدام
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        {contactPageData?.additionalSections && contactPageData.additionalSections.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            {contactPageData.additionalSections.map((section, index) => (
              <div key={index} className="mb-12">
                {section.__component === 'contact.faq-section' && (
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-8 text-center">{section.title}</h3>
                    {section.description && (
                      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{section.description}</p>
                    )}
                    <div className="max-w-4xl mx-auto space-y-4">
                      {section.faqs?.map((faq: any, faqIndex: number) => (
                        <details key={faqIndex} className="bg-gray-50 border border-gray-200 rounded-lg">
                          <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors">
                            {faq.question}
                          </summary>
                          <div className="px-6 pb-4 text-gray-600">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {section.__component === 'contact.office-locations' && (
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-8 text-center">{section.title}</h3>
                    {section.description && (
                      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{section.description}</p>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {section.offices?.map((office: any, officeIndex: number) => (
                        <div key={officeIndex} className="bg-white border border-gray-200 p-6 rounded-lg">
                          <h4 className="font-bold text-lg mb-4">{office.name}</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>{office.address}</p>
                            {office.phone && <p>الهاتف: {office.phone}</p>}
                            {office.email && <p>البريد: {office.email}</p>}
                            {office.hours && <p>ساعات العمل: {office.hours}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
