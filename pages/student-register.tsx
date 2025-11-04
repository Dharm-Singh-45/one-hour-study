'use client';

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuccessModal from '@/components/SuccessModal';
import { isValidEmail, isValidPhone, saveToLocalStorage, registerUser } from '@/lib/utils';
import { generateMetadata } from '@/lib/seo';

export default function StudentRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    subjects: [] as string[],
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

  const subjectCategories = [
    {
      name: 'Primary & Middle School (Class 1-8)',
      subjects: ['Mathematics', 'English', 'Hindi', 'Science', 'Social Studies', 'Environmental Studies', 'Computer Science', 'Sanskrit'],
    },
    {
      name: 'PCM Stream (Class 9-12)',
      subjects: ['Physics', 'Chemistry', 'Mathematics (Higher)'],
    },
    {
      name: 'Biology Stream (Class 9-12)',
      subjects: ['Biology', 'Botany', 'Zoology'],
    },
    {
      name: 'Commerce Stream (Class 9-12)',
      subjects: ['Commerce', 'Accountancy', 'Business Studies', 'Economics', 'Statistics'],
    },
    {
      name: 'Arts/Humanities (Class 9-12)',
      subjects: ['History', 'Geography', 'Political Science', 'Civics', 'Sociology', 'Psychology'],
    },
    {
      name: 'Languages',
      subjects: ['English Literature', 'Hindi Literature'],
    },
    {
      name: 'Additional Subjects',
      subjects: ['Physical Education', 'Art & Drawing', 'Music', 'Dance'],
    },
  ];

  // Flatten all subjects for validation
  const allSubjects = subjectCategories.flatMap(category => category.subjects);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
    if (errors.subjects) {
      setErrors(prev => ({ ...prev, subjects: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10 digits)';
    }

    if (!formData.class) {
      newErrors.class = 'Please select your class';
    }

    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters long';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const registrationData = {
        type: 'student' as const,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        class: formData.class,
        subjects: formData.subjects,
        city: formData.city,
      };
      
      // Register user with authentication
      const result = registerUser(registrationData);
      
      if (result.success) {
        // Also save to registrations for backwards compatibility
        const registrationRecord = {
          type: 'student',
          ...formData,
          password: undefined,
          confirmPassword: undefined,
          timestamp: new Date().toISOString(),
        };
        saveToLocalStorage(`student_${Date.now()}`, registrationRecord);
        setShowModal(true);
      } else {
        setErrors({ general: result.message });
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };

  const metadata = generateMetadata('studentRegister');

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={metadata.alternates.canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </Head>
      <Navbar />
      
      <section className="min-h-[calc(100vh-200px)] py-16 bg-gradient-hero relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                <span className="fas fa-user-graduate text-primary" aria-hidden="true"></span>
                Student Registration
              </h2>
              <p className="text-slate-600 mt-4">Join OneHourStudy and find the perfect tutor for your studies!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border-2 border-red-700 text-red-700 px-4 py-3 rounded-xl">
                  {errors.general}
                </div>
              )}
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                  <span className="fas fa-user text-primary" aria-hidden="true"></span>
                  Full Name <span className="text-red-700 font-bold" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.name ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                />
                {errors.name && <p className="text-red-700 text-sm mt-1">{errors.name}</p>}
              </div>

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
                    errors.email ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                />
                {errors.email && <p className="text-red-700 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                  <span className="fas fa-phone text-primary" aria-hidden="true"></span>
                  Phone Number <span className="text-red-700 font-bold" aria-label="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                />
                {errors.phone && <p className="text-red-700 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="class" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                  <span className="fas fa-book-reader text-primary" aria-hidden="true"></span>
                  Class <span className="text-red-700 font-bold" aria-label="required">*</span>
                </label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.class ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                >
                  <option value="">Select Your Class</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
                {errors.class && <p className="text-red-700 text-sm mt-1">{errors.class}</p>}
              </div>

              <fieldset>
                <legend className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                  <span className="fas fa-book text-primary" aria-hidden="true"></span>
                  Subjects <span className="text-red-700 font-bold" aria-label="required">*</span>
                </legend>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 border border-slate-200 rounded-xl p-4">
                  {subjectCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="text-sm font-bold text-primary mb-3 sticky top-0 bg-white py-1">
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {category.subjects.map(subject => (
                          <label key={subject} htmlFor={`subject-${subject.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                            <input
                              type="checkbox"
                              id={`subject-${subject.toLowerCase().replace(/\s+/g, '-')}`}
                              checked={formData.subjects.includes(subject)}
                              onChange={() => handleSubjectChange(subject)}
                              className="w-5 h-5 text-primary rounded focus:ring-primary flex-shrink-0"
                            />
                            <span className="text-slate-700 text-sm">{subject}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.subjects && <p className="text-red-700 text-sm mt-2">{errors.subjects}</p>}
              </fieldset>

              <div>
                <label htmlFor="city" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                  <span className="fas fa-map-marker-alt text-primary" aria-hidden="true"></span>
                  City <span className="text-red-700 font-bold" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.city ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                />
                {errors.city && <p className="text-red-700 text-sm mt-1">{errors.city}</p>}
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
                    errors.password ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                />
                <small className="text-slate-500 text-sm">Minimum 6 characters</small>
                {errors.password && <p className="text-red-700 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                  <span className="fas fa-lock text-primary" aria-hidden="true"></span>
                  Confirm Password <span className="text-red-700 font-bold" aria-label="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                  } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  required
                />
                {errors.confirmPassword && <p className="text-red-700 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-primary text-white py-4 px-8 rounded-full font-bold text-lg shadow-md hover:shadow-colored transition-all duration-300 hover:-translate-y-1 mt-6"
              >
                <span className="fas fa-user-plus mr-2" aria-hidden="true"></span>
                Register as Student
              </button>
            </form>

            <p className="text-center text-slate-600 mt-6">
              Already have an account? <a href="/contact" className="text-primary hover:underline font-semibold">Contact us</a> for login details.
            </p>
          </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <SuccessModal isOpen={showModal} onClose={handleCloseModal} />
    </>
  );
}

