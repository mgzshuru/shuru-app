// types.ts
export interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  linkedinProfile: string;
  workplace: string;
  jobTitle: string;
  profileImage: File | null;
  articleTitle: string;
  articleFile: File | null;
  articleImages: File[];
  originalityAgreement: boolean;
  termsAgreement: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

export interface StepProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (field: keyof FormData, value: any) => void;
}

// export interface FileUploadZoneProps {
//   onFileSelect: (file: File | FileList) => void;
//   accept: string;
//   multiple?: boolean;
//   children: React.ReactNode;
//   error?: string;
  

export interface FileUploadZoneProps {
  onFileSelect: (file: File | File[]) => void;  // ← Change this line
  accept: string;
  multiple?: boolean;
  children: React.ReactNode;
  error?: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export interface SuccessMessageProps {
  onRestart: () => void;
}