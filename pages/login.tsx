'use client';

import Head from 'next/head';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { isValidEmail, loginUser, focusFirstErrorField } from '@/lib/utils';
import { generateMetadata } from '@/lib/seo';

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

export default function Login() {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const fieldOrder = ['email', 'password'];
      const firstError = Object.keys(newErrors)[0];
      const errorMessage = newErrors[firstError];
      
      // Show toast with specific error message
      toast.error(errorMessage);
      
      // Focus on first error field
      focusFirstErrorField(Object.keys(newErrors), fieldOrder);
      
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    const result = await loginUser(formData.email, formData.password, userType);
    
    if (result.success) {
      toast.success('Login successful!');
      router.push(userType === 'student' ? '/student-dashboard' : '/teacher-dashboard');
    } else {
      toast.error(result.message || 'Login failed. Please try again.');
      setErrors({ general: result.message });
      setIsLoading(false);
    }
  };

  const metadata = generateMetadata('login');

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={metadata.alternates.canonical} />
      </Head>
      <Navbar />

      <section className="min-h-[calc(100vh-200px)] py-16 bg-gradient-hero relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-2xl lg:max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>

              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                  <span className="fas fa-sign-in-alt text-primary" aria-hidden="true"></span>
                  Login to OneHourStudy
                </h2>
                <p className="text-slate-700 mt-4">Sign in to continue your learning or teaching journey.</p>
              </div>

              {/* User Type Selector */}
              <div className="mb-8">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      userType === 'student'
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-slate-700 hover:text-primary'
                    }`}
                  >
                    <span className="fas fa-user-graduate mr-2" aria-hidden="true"></span>
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('teacher')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      userType === 'teacher'
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-slate-700 hover:text-primary'
                    }`}
                  >
                    <span className="fas fa-chalkboard-teacher mr-2" aria-hidden="true"></span>
                    Teacher
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border-2 border-red-700 text-red-700 px-4 py-3 rounded-xl">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <span className="fas fa-envelope text-primary" aria-hidden="true"></span>
                    Email Address <span className="text-red-700 font-bold" aria-label="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.email ? 'border-red-700' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                    required
                  />
                  {errors.email && <p className="text-red-700 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <span className="fas fa-lock text-primary" aria-hidden="true"></span>
                    Password <span className="text-red-700 font-bold" aria-label="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.password ? 'border-red-700' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                    required
                  />
                  {errors.password && <p className="text-red-700 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-primary text-white py-4 px-8 rounded-full font-bold text-lg shadow-md hover:shadow-colored transition-all duration-300 hover:-translate-y-1 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="fas fa-sign-in-alt mr-2" aria-hidden="true"></span>
                      Sign In as {userType === 'student' ? 'Student' : 'Teacher'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-slate-700">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign up as {userType === 'student' ? 'Student' : 'Teacher'}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
    </>
  );
}

