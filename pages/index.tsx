import Head from 'next/head';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { generateMetadata } from '@/lib/seo';

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

export default function Home() {
  const metadata = generateMetadata('home');
  
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={metadata.alternates.canonical} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:url" content={metadata.openGraph.url} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'OneHourStudy',
              description: metadata.description,
              url: metadata.alternates.canonical,
              logo: metadata.openGraph.images[0].url,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jodhpur',
                addressRegion: 'Rajasthan',
                addressCountry: 'IN',
              },
              areaServed: {
                '@type': 'City',
                name: 'Jodhpur',
                sameAs: 'https://en.wikipedia.org/wiki/Jodhpur',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                availableLanguage: 'English, Hindi',
              },
              sameAs: [
                // Add your social media links here
                // 'https://www.facebook.com/onehourstudy',
                // 'https://www.twitter.com/onehourstudy',
              ],
            }),
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'OneHourStudy',
              url: metadata.alternates.canonical,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${metadata.alternates.canonical}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-hero py-16 xl:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-primary/15 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/12 via-purple-500/8 to-transparent rounded-full blur-3xl animate-float" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-8 xl:gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gradient-primary mb-6 leading-tight">
                Connecting Students with Expert Tutors
              </h1>
              <h2 className="text-xl md:text-2xl text-primary font-bold mb-6 relative inline-block">
                Learn in Just One Hour a Day!
                <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-secondary rounded"></span>
              </h2>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Find qualified home tutors in <strong className="text-primary">Jodhpur, Rajasthan</strong> for all subjects from class 1 to class 12 and extracurricular activities. Quality home tuition services available across <strong className="text-primary">all areas of Jodhpur city</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/student-register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-white py-4 px-8 rounded-full font-bold shadow-md hover:shadow-colored transition-all duration-300 hover:-translate-y-1"
                  aria-label="Find Your Tutor - Student Registration in Jodhpur"
                >
                  Find Your Tutor
                </Link>
                <Link
                  href="/teacher-register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-secondary text-white py-4 px-8 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  aria-label="Join as a Teacher - Teacher Registration in Jodhpur"
                >
                  Join as a Teacher
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <span className="fas fa-chalkboard-teacher text-[14rem] xl:text-[16rem] 2xl:text-[18rem] text-gradient-rainbow opacity-30 animate-pulse-slow drop-shadow-2xl" aria-hidden="true"></span>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 xl:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-center text-slate-800 mb-10 xl:mb-12 relative inline-block w-full">
              About OneHourStudy
              <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded"></span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 xl:gap-8 max-w-content mx-auto">
            <div className="bg-white p-6 xl:p-8 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="w-20 xl:w-24 h-20 xl:h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-xl relative">
                <span className="fas fa-users text-3xl xl:text-4xl text-white z-10" aria-hidden="true"></span>
                <div className="absolute inset-[-4px] bg-gradient-primary rounded-full opacity-30 animate-ping"></div>
              </div>
              <h3 className="text-xl xl:text-2xl font-bold text-slate-800 mb-4 text-center">For Students</h3>
              <p className="text-sm xl:text-base text-slate-700 text-center leading-relaxed">
                Get access to qualified home tutors in Jodhpur for all subjects (class 1-12) and extracurricular activities. Learn at your own pace with personalized attention in your home.
              </p>
            </div>
            <div className="bg-white p-6 xl:p-8 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="w-20 xl:w-24 h-20 xl:h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-xl relative">
                <span className="fas fa-user-tie text-3xl xl:text-4xl text-white z-10" aria-hidden="true"></span>
                <div className="absolute inset-[-4px] bg-gradient-primary rounded-full opacity-30 animate-ping"></div>
              </div>
              <h3 className="text-xl xl:text-2xl font-bold text-slate-800 mb-4 text-center">For Teachers</h3>
              <p className="text-sm xl:text-base text-slate-700 text-center leading-relaxed">
                Connect with students across all areas of Jodhpur city. Teach subjects from class 1-12 and extracurricular activities. Build your teaching career with flexible schedules and competitive rates.
              </p>
            </div>
            <div className="bg-white p-6 xl:p-8 rounded-3xl shadow-lg border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="w-20 xl:w-24 h-20 xl:h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-xl relative">
                <span className="fas fa-clock text-3xl xl:text-4xl text-white z-10" aria-hidden="true"></span>
                <div className="absolute inset-[-4px] bg-gradient-primary rounded-full opacity-30 animate-ping"></div>
              </div>
              <h3 className="text-xl xl:text-2xl font-bold text-slate-800 mb-4 text-center">One Hour Learning</h3>
              <p className="text-sm xl:text-base text-slate-700 text-center leading-relaxed">
                Efficient learning in just one hour per day. Focused sessions that maximize understanding and retention.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 xl:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-center text-slate-800 mb-10 xl:mb-12 relative inline-block w-full">
              Why Choose OneHourStudy?
              <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded"></span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 max-w-content mx-auto">
            {[
              { icon: 'fa-check-circle', title: 'Qualified Tutors', desc: 'All teachers are verified and qualified' },
              { icon: 'fa-map-marker-alt', title: 'Home Tutoring', desc: 'Learn from the comfort of your home' },
              { icon: 'fa-book', title: 'All Subjects', desc: 'Complete coverage from class 1 to 12' },
              { icon: 'fa-dollar-sign', title: 'Affordable Plans', desc: 'Flexible pricing options for everyone' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 xl:p-8 rounded-2xl shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center group border border-slate-100 hover:border-primary/20">
                <span className={`fas ${feature.icon} text-4xl xl:text-5xl text-gradient-primary mb-4 inline-block group-hover:scale-110 transition-transform`} aria-hidden="true"></span>
                <h3 className="text-lg xl:text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm xl:text-base text-slate-700">{feature.desc}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 xl:py-20 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-center text-slate-800 mb-10 xl:mb-12 relative inline-block w-full">
              What Our Students Say
              <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded"></span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6 xl:gap-8 max-w-content mx-auto">
            {[
              { text: '"OneHourStudy helped me find an excellent math tutor. My grades improved significantly in just a few months!"', author: 'Priya Sharma', role: 'Class 10 Student' },
              { text: '"The platform is easy to use and the tutors are professional. Highly recommended for anyone looking for quality education."', author: 'Rahul Kumar', role: 'Class 12 Student' },
              { text: '"As a teacher, I\'ve connected with many motivated students. The platform makes it easy to manage my schedule and students."', author: 'Dr. Anjali Patel', role: 'Science Teacher' },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 xl:p-8 rounded-3xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-primary relative group">
                <div className="flex gap-1 mb-6 text-lg xl:text-xl text-accent-orange drop-shadow-md">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="fas fa-star" aria-hidden="true"></span>
                  ))}
                </div>
                <p className="text-sm xl:text-base text-slate-700 italic mb-6 leading-relaxed relative z-10">{testimonial.text}</p>
                <div>
                  <strong className="block text-base xl:text-lg text-slate-800 mb-1">{testimonial.author}</strong>
                  <span className="text-slate-700 text-xs xl:text-sm">{testimonial.role}</span>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 xl:py-24 bg-gradient-primary text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-white/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/12 rounded-full blur-3xl animate-float" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg xl:text-xl mb-8 text-white/95">Join thousands of students and teachers on OneHourStudy today!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/student-register"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 py-4 px-8 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-primary hover:bg-primary hover:text-white"
                aria-label="Register as Student - Find Home Tutors in Jodhpur"
              >
                Register as Student
              </Link>
              <Link
                href="/teacher-register"
                className="inline-flex items-center justify-center gap-2 bg-white/30 backdrop-blur-sm text-white border-2 border-white/90 py-4 px-8 rounded-full font-bold hover:bg-white hover:text-primary transition-all duration-300 hover:-translate-y-1 shadow-lg"
                aria-label="Register as Teacher - Become a Home Tutor in Jodhpur"
              >
                Register as Teacher
              </Link>
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

