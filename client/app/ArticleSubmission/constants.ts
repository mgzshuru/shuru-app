

// constants.ts
import { User, FileText, Shield, CheckCircle } from 'lucide-react';
import { Step, FormData } from './types';

export const STEPS: Step[] = [
  { id: 1, title: 'المعلومات الشخصية', icon: User, description: 'أدخل بياناتك الشخصية' },
  { id: 2, title: 'تفاصيل المقال', icon: FileText, description: 'ارفع مقالك والصور' },
  { id: 3, title: 'الشروط والأحكام', icon: Shield, description: 'اقرأ ووافق على الشروط' },
  { id: 4, title: 'مراجعة وإرسال', icon: CheckCircle, description: 'راجع بياناتك قبل الإرسال' }
];

export const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  phoneNumber: '',
  email: '',
  linkedinProfile: '',
  workplace: '',
  jobTitle: '',
  profileImage: null,
  articleTitle: '',
  articleFile: null,
  articleImages: [],
  originalityAgreement: false,
  termsAgreement: false
};

export const TERMS_CONDITIONS = [
  'المقال حصري وغير منسوخ أو مقتبس دون ذكر المصدر',
  'يتعهد الكاتب بأنه المؤلف الفعلي للمقال ويتحمل المسؤولية القانونية في حال ثبوت العكس',
  'يجب أن يتضمن الملف المرفق: الاسم بالكامل، المسمى الوظيفي، وعنوان المقال في بداية الملف',
  'الحد الأدنى 500 كلمة والحد الأقصى 1500 كلمة',
  'الالتزام بالأمانة العلمية، التوثيق الصحيح، مكتوبًا باللغة العربية وخلو المقال من الأخطاء اللغوية والإملائية',
  'يجب أن يكون المقال مرتبطًا بمجالات إدارة المشاريع أو موضوع ذو صلة بالأعمال',
  'لمنصة شروع الحق في نشر المقال أو تعديله وفقًا لسياسات المجلة'
];

export const MAX_FILE_SIZE_MB = 10;

export const ACCEPTED_DOCUMENT_TYPES = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const ACCEPTED_IMAGE_TYPES = 'image/*';