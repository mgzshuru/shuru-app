'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from './use-auth';

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, loading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      setSuccess('تم تسجيل الدخول بنجاح!');
      
      // Redirect after success
      setTimeout(() => {
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        router.push(redirectTo);
      }, 1500);
    } catch (error) {
      // Error is already handled by the auth context
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              سجل الدخول للوصول إلى حسابك
            </p>
          </div>

          {/* Error Messages */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm leading-relaxed">{authError}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm leading-relaxed">{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pr-10 pl-4 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="البريد الإلكتروني"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pr-10 pl-12 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-black'
                  }`}
                  placeholder="كلمة المرور"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2 disabled:opacity-50"
                />
                <span className="mr-2 text-gray-600">ابقني مسجلاً</span>
              </label>
              
              <button
                type="button"
                onClick={() => router.push('/auth/forgot-password')}
                disabled={loading}
                className="text-gray-500 hover:text-black transition-colors underline disabled:opacity-50"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 text-base transition-all duration-200 uppercase tracking-wide"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin ml-2"></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-4">
              ليس لديك حساب؟
            </p>
            <button
              onClick={() => router.push('/auth/register')}
              disabled={loading}
              className="text-black hover:text-gray-700 font-semibold underline disabled:opacity-50"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;