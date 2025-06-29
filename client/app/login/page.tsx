'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Facebook, Apple, Linkedin, AlertCircle, CheckCircle } from 'lucide-react';

interface FieldErrors {
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  user?: any;
  message?: string;
  authUrl?: string;
}

const LoginPage = () => {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: '',
    password: ''
  });

  // Clear messages after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Field validation
  const validateField = (field: keyof FieldErrors, value: string): boolean => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'email':
        if (!value) {
          errors.email = 'البريد الإلكتروني مطلوب';
        } else if (!isValidEmail(value)) {
          errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
        } else {
          errors.email = '';
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'كلمة المرور مطلوبة';
        } else if (value.length < 8) {
          errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        } else if (!/[A-Z]/.test(value)) {
          errors.password = 'يجب أن تحتوي على حرف كبير واحد على الأقل';
        } else if (!/[0-9]/.test(value)) {
          errors.password = 'يجب أن تحتوي على رقم واحد على الأقل';
        } else {
          errors.password = '';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(errors);
    return !errors[field];
  };

  // Form validation
  const isFormValid = (): boolean => {
    return isValidEmail(email) && 
           password.length >= 8 && 
           !fieldErrors.email && 
           !fieldErrors.password;
  };

  // Input handlers with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
    if (error) setError('');
  };

  // Secure token storage
  const storeAuthToken = (token: string, persistent: boolean): void => {
    try {
      if (persistent) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }
    } catch (error) {
      console.error('Token storage error:', error);
      throw new Error('فشل في حفظ بيانات الجلسة');
    }
  };

  // Secure user data storage
  const storeUserData = (userData: any): void => {
    try {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('User data storage error:', error);
      throw new Error('فشل في حفظ بيانات المستخدم');
    }
  };

  // API error handler
  const handleApiError = (error: any): string => {
    console.error('API Error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
    }
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'بيانات الدخول غير صحيحة';
        case 401:
          return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        case 403:
          return 'الحساب غير مفعل. يرجى التحقق من بريدك الإلكتروني';
        case 429:
          return 'تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً';
        case 500:
          return 'خطأ في الخادم الداخلي. يرجى المحاولة لاحقاً';
        default:
          return error.response.data?.message || 'حدث خطأ أثناء المصادقة';
      }
    }
    
    return error.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى';
  };

  // Main login handler
  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    
    try {
      setError('');
      setSuccess('');
      
      // Validate all fields before submission
      const emailValid = validateField('email', email);
      const passwordValid = validateField('password', password);
      
      if (!emailValid || !passwordValid) {
        setError('يرجى تصحيح الأخطاء في النموذج');
        return;
      }

      setIsLoading(true);

      // API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          rememberMe
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تسجيل الدخول');
      }

      const data: AuthResponse = await response.json();
      
      // Handle successful login
      if (data.token) {
        storeAuthToken(data.token, rememberMe);
        if (data.user) storeUserData(data.user);
        
        setSuccess('تم تسجيل الدخول بنجاح!');
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        throw new Error('استجابة غير متوقعة من الخادم');
      }
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handler
  const handleSocialLogin = async (provider: string): Promise<void> => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`/api/auth/${provider.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `فشل في تسجيل الدخول عبر ${provider}`);
      }

      const data: AuthResponse = await response.json();
      
      if (data.authUrl) {
        // Redirect to OAuth provider
        window.location.href = data.authUrl;
      } else if (data.token) {
        // Direct login success
        storeAuthToken(data.token, rememberMe);
        if (data.user) storeUserData(data.user);
        
        setSuccess(`تم تسجيل الدخول بنجاح عبر ${provider}!`);
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        throw new Error('استجابة غير متوقعة من الخادم');
      }
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (): Promise<void> => {
    try {
      if (!email.trim()) {
        setError('يرجى إدخال بريدك الإلكتروني أولاً');
        return;
      }

      if (!isValidEmail(email)) {
        setError('يرجى إدخال بريد إلكتروني صحيح');
        return;
      }

      setError('');
      setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إرسال رابط إعادة تعيين كلمة المرور');
      }

      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleRegisterRedirect = (): void => {
    window.location.href = '/register';
  };

  // Keyboard accessibility
  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && isFormValid() && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white border border-gray-300 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-black mb-3 uppercase tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              سجل الدخول باستخدام بريدك الإلكتروني أو حساب اجتماعي
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm leading-relaxed">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-300 flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 text-sm leading-relaxed">{success}</span>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {['Facebook', 'Apple', 'LinkedIn', 'Google'].map((provider) => (
              <button
                key={provider}
                onClick={() => handleSocialLogin(provider)}
                disabled={isLoading}
                className="flex items-center justify-center w-full h-12 border border-gray-300 hover:bg-gray-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`تسجيل الدخول عبر ${provider}`}
              >
                {provider === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />}
                {provider === 'Apple' && <Apple className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />}
                {provider === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />}
                {provider === 'Google' && (
                  <div className="w-5 h-5 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                onBlur={() => validateField('email', email)}
                disabled={isLoading}
                className={`w-full px-4 py-3 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-black'
                }`}
                placeholder="البريد الإلكتروني *"
                required
                autoComplete="email"
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                onBlur={() => validateField('password', password)}
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-12 border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-black'
                }`}
                placeholder="كلمة المرور *"
                required
                autoComplete="current-password"
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {fieldErrors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Links and Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2 disabled:opacity-50"
                />
                <span className="mr-2 text-gray-600">ابقني مسجلاً</span>
              </label>
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-black transition-colors underline disabled:opacity-50"
                >
                  نسيت كلمة المرور؟
                </button>
                <button
                  type="button"
                  onClick={handleRegisterRedirect}
                  disabled={isLoading}
                  className="text-gray-500 hover:text-black transition-colors underline disabled:opacity-50"
                >
                  ليس لدي حساب
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 text-base transition-all duration-200 uppercase tracking-wide"
              aria-describedby="submit-help"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin mr-2"></div>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
            {!isFormValid() && (
              <p id="submit-help" className="text-xs text-gray-500 text-center">
                يرجى ملء جميع الحقول المطلوبة بشكل صحيح
              </p>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              هذا الموقع محمي بواسطة reCAPTCHA وتطبق 
              <a href="/privacy" className="text-black hover:text-gray-700 mx-1 underline">سياسة الخصوصية</a>
              و
              <a href="/terms" className="text-black hover:text-gray-700 mx-1 underline">شروط الخدمة</a>
              من Google.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-gray-100 p-6 text-center">
          <h3 className="font-bold text-black mb-2">جديد على منصتنا؟</h3>
          <p className="text-sm text-gray-600 mb-4">
            انضم إلى آلاف القراء واحصل على أحدث الأخبار والتحليلات
          </p>
          <button 
            onClick={handleRegisterRedirect}
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 text-sm font-semibold transition-all duration-200 uppercase disabled:opacity-50"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;