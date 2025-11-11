'use client';

import Head from 'next/head';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import StudentRegistrationForm from '@/components/StudentRegistrationForm';
import TeacherRegistrationForm from '@/components/TeacherRegistrationForm';
import { generateMetadata } from '@/lib/seo';

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

export default function Register() {
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');

  const metadata = generateMetadata(userType === 'student' ? 'studentRegister' : 'teacherRegister');

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
                  <span className={`fas ${userType === 'student' ? 'fa-user-graduate' : 'fa-chalkboard-teacher'} text-primary`} aria-hidden="true"></span>
                  {userType === 'student' ? 'Student' : 'Teacher'} Registration
                </h2>
                <p className="text-slate-600 mt-4">
                  {userType === 'student' 
                    ? 'Join OneHourStudy and find the perfect tutor for your studies!'
                    : 'Join OneHourStudy as a tutor and help students achieve their academic goals!'
                  }
                </p>
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

              {/* Conditionally render the appropriate registration form */}
              {userType === 'student' ? <StudentRegistrationForm /> : <TeacherRegistrationForm />}
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
