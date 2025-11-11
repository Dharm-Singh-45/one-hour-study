'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { isValidEmail, isValidPhone, registerUser, focusFirstErrorField } from '@/lib/utils';

const SuccessModal = dynamic(() => import('@/components/SuccessModal'), {
  ssr: false,
  loading: () => null,
});

export default function TeacherRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    experience: '',
    qualification: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [showOtherSubject, setShowOtherSubject] = useState(false);
  const [otherSubject, setOtherSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const qualifications = ['Graduate', 'Post Graduate', 'M.Ed', 'B.Ed', 'PhD', 'Other'];

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

  const handleOtherSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherSubject(value);
    
    setFormData(prev => {
      const subjectsWithoutOther = prev.subjects.filter(s => !s.startsWith('Other: '));
      const newSubjects = value.trim() 
        ? [...subjectsWithoutOther, `Other: ${value.trim()}`]
        : subjectsWithoutOther;
      
      return {
        ...prev,
        subjects: newSubjects,
      };
    });
    
    if (errors.subjects) {
      setErrors(prev => ({ ...prev, subjects: '' }));
    }
  };

  const handleOtherCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setShowOtherSubject(isChecked);
    
    if (!isChecked) {
      const otherSubjectEntry = formData.subjects.find(s => s.startsWith('Other: '));
      if (otherSubjectEntry) {
        setFormData(prev => ({
          ...prev,
          subjects: prev.subjects.filter(s => s !== otherSubjectEntry),
        }));
      }
      setOtherSubject('');
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

    if (showOtherSubject && !otherSubject.trim()) {
      newErrors.subjects = 'Please enter the subject name';
    }
    
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }

    if (!formData.experience || parseInt(formData.experience) < 0) {
      newErrors.experience = 'Please enter a valid experience (in years)';
    }

    if (!formData.qualification) {
      newErrors.qualification = 'Please select your qualification';
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
    
    if (Object.keys(newErrors).length > 0) {
      const fieldOrder = ['name', 'email', 'phone', 'subjects', 'experience', 'qualification', 'city', 'password', 'confirmPassword'];
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
    console.log('Form submitted, validating...');
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }
    
    console.log('Validation passed, calling API...');
    setIsSubmitting(true);
    
    try {
      const registrationData = {
        type: 'teacher' as const,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        subjects: formData.subjects,
        experience: formData.experience,
        qualification: formData.qualification,
        city: formData.city,
      };
      
      console.log('Calling registerUser with data:', { ...registrationData, password: '***' });
      const result = await registerUser(registrationData);
      console.log('Registration result:', result);
      
      if (result.success) {
        toast.success('Registration successful!');
        setShowModal(true);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border-2 border-red-700 text-red-700 px-4 py-3 rounded-xl">
            {errors.general}
          </div>
        )}
        <div>
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-user text-primary" aria-hidden="true"></span>
            Full Name <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="text"
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
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-envelope text-primary" aria-hidden="true"></span>
            Email Address <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="email"
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
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-phone text-primary" aria-hidden="true"></span>
            Phone Number <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="tel"
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
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
            <span className="fas fa-book text-primary" aria-hidden="true"></span>
            Subjects You Teach <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 border border-slate-200 rounded-xl p-4">
            {subjectCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
                <h4 className="text-sm font-bold text-primary mb-3 sticky top-0 bg-white py-1">
                  {category.name}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {category.subjects.map(subject => (
                    <label key={subject} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
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
            <div className="pt-4 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={showOtherSubject}
                  onChange={handleOtherCheckboxChange}
                  className="w-5 h-5 text-primary rounded focus:ring-primary flex-shrink-0"
                />
                <span className="text-slate-700 font-semibold">Other</span>
              </label>
              {showOtherSubject && (
                <div className="mt-3 ml-7">
                  <label htmlFor="otherSubject" className="block text-slate-700 font-semibold mb-2 text-sm">
                    Please specify the subject:
                  </label>
                  <input
                    type="text"
                    id="otherSubject"
                    name="otherSubject"
                    value={otherSubject}
                    onChange={handleOtherSubjectChange}
                    placeholder="Enter your subject"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.subjects ? 'border-red-700' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  />
                </div>
              )}
            </div>
          </div>
          {errors.subjects && <p className="text-red-700 text-sm mt-2">{errors.subjects}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-briefcase text-primary" aria-hidden="true"></span>
            Years of Experience <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            min="0"
            max="50"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              errors.experience ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
            } focus:outline-none focus:ring-4 focus:ring-primary/15`}
            required
          />
          {errors.experience && <p className="text-red-700 text-sm mt-1">{errors.experience}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-certificate text-primary" aria-hidden="true"></span>
            Qualification <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <select
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
              errors.qualification ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
            } focus:outline-none focus:ring-4 focus:ring-primary/15`}
            required
          >
            <option value="">Select Your Qualification</option>
            {qualifications.map(qual => (
              <option key={qual} value={qual}>{qual}</option>
            ))}
          </select>
          {errors.qualification && <p className="text-red-700 text-sm mt-1">{errors.qualification}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-map-marker-alt text-primary" aria-hidden="true"></span>
            City <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="text"
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
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <span className="fas fa-lock text-primary" aria-hidden="true"></span>
            Password <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="password"
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
          <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <i className="fas fa-lock text-primary"></i>
            Confirm Password <span className="text-red-700 font-bold" aria-label="required">*</span>
          </label>
          <input
            type="password"
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
          disabled={isSubmitting}
          className={`w-full bg-gradient-primary text-white py-4 px-8 rounded-full font-bold text-lg shadow-md hover:shadow-colored transition-all duration-300 hover:-translate-y-1 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
        >
          {isSubmitting ? (
            <>
              <span className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></span>
              Registering...
            </>
          ) : (
            <>
              <span className="fas fa-user-tie mr-2" aria-hidden="true"></span>
              Register as Teacher
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-700">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline font-semibold">Sign in</a>
        </p>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Registration Successful!"
        message="Thank you for joining OneHourStudy as a teacher. Your account has been created successfully."
      />
    </>
  );
}

