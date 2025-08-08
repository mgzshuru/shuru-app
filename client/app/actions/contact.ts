"use server";

import { getStrapiURL } from "@/lib/utils";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];

    for (const field of requiredFields) {
      if (!data[field as keyof ContactFormData]) {
        return {
          success: false,
          error: `الحقل ${field === 'name' ? 'الاسم' : field === 'email' ? 'البريد الإلكتروني' : field === 'subject' ? 'الموضوع' : 'الرسالة'} مطلوب`,
          field
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'يرجى إدخال بريد إلكتروني صحيح',
        field: 'email'
      };
    }

    // Submit to Strapi
    const response = await fetch(`${getStrapiURL()}/api/contact-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          company: data.company || '',
          subject: data.subject,
          message: data.message,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        return {
          success: false,
          error: 'لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة مرة أخرى بعد قليل.'
        };
      }

      return {
        success: false,
        error: errorData.error?.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
      data: result
    };

  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.'
    };
  }
}
