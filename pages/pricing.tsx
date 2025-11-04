import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generateMetadata } from '@/lib/seo';

export default function Pricing() {
  const metadata = generateMetadata('pricing');
  const studentPlans = [
    {
      name: 'Basic',
      price: '999',
      features: [
        '8 hours of tutoring per month',
        '1 subject',
        'Basic tutor matching',
        'Email support',
        'Progress reports',
      ],
      featured: false,
    },
    {
      name: 'Standard',
      price: '1,799',
      features: [
        '16 hours of tutoring per month',
        'Up to 3 subjects',
        'Priority tutor matching',
        'Phone & email support',
        'Detailed progress reports',
        'Study materials included',
      ],
      featured: true,
    },
    {
      name: 'Premium',
      price: '2,999',
      features: [
        '30 hours of tutoring per month',
        'All subjects',
        'Premium tutor matching',
        '24/7 priority support',
        'Advanced progress tracking',
        'Premium study materials',
        'Exam preparation guidance',
      ],
      featured: false,
    },
  ];

  const teacherPlans = [
    {
      name: 'Basic',
      price: '499',
      features: [
        'Basic profile listing',
        'Up to 5 student connections',
        'Basic profile visibility',
        'Email support',
        'Standard payment processing',
      ],
      featured: false,
    },
    {
      name: 'Standard',
      price: '999',
      features: [
        'Enhanced profile listing',
        'Up to 20 student connections',
        'Priority profile visibility',
        'Phone & email support',
        'Fast payment processing',
        'Student review system',
      ],
      featured: true,
    },
    {
      name: 'Premium',
      price: '1,799',
      features: [
        'Premium profile listing',
        'Unlimited student connections',
        'Top profile visibility',
        '24/7 priority support',
        'Instant payment processing',
        'Advanced analytics dashboard',
        'Marketing tools & promotions',
      ],
      featured: false,
    },
  ];

  // Generate Service structured data
  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'OneHourStudy Home Tutoring Services in Jodhpur',
    description: metadata.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'OneHourStudy',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jodhpur',
        addressRegion: 'Rajasthan',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Jodhpur',
      containedIn: {
        '@type': 'State',
        name: 'Rajasthan',
      },
    },
    serviceType: 'Home Tutoring - Class 1 to 12 & Extracurricular Activities',
    serviceArea: {
      '@type': 'City',
      name: 'Jodhpur',
      description: 'All areas of Jodhpur city',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Student Tutoring Plans',
        description: 'Home tutoring for all subjects class 1-12 and extracurricular activities',
      },
      {
        '@type': 'Offer',
        name: 'Teacher Registration',
        description: 'Become a home tutor in Jodhpur',
      },
    ],
  };

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
        
        {/* Service Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceStructuredData),
          }}
        />
      </Head>
      <Navbar />
      
      <section className="py-16 xl:py-20 bg-gradient-hero min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-center text-slate-800 mb-4 relative inline-block w-full">
              Choose Your Plan
              <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded"></span>
            </h2>
            <p className="text-center text-slate-600 text-base xl:text-lg mb-12 xl:mb-16">Flexible pricing options for students and teachers</p>

          {/* Student Plans */}
          <div className="mb-20">
            <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center text-slate-800 mb-10 xl:mb-12 flex items-center justify-center gap-3">
              <span className="fas fa-user-graduate text-primary" aria-hidden="true"></span>
              Plans for Students
            </h3>
            <div className="grid md:grid-cols-3 gap-6 xl:gap-8 max-w-content mx-auto">
              {studentPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 xl:p-8 shadow-lg border-2 transition-all duration-300 hover:-translate-y-4 hover:shadow-colored flex flex-col ${
                    plan.featured
                      ? 'border-primary lg:scale-105 bg-gradient-to-b from-white to-blue-50/30'
                      : 'border-transparent'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white px-6 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-800 mb-4">{plan.name}</h4>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-lg xl:text-xl text-slate-500">₹</span>
                      <span className="text-4xl xl:text-5xl font-extrabold text-gradient-primary">{plan.price}</span>
                      <span className="text-base xl:text-lg text-slate-500">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 flex-grow mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-slate-700">
                        <span className="fas fa-check text-secondary mt-1" aria-hidden="true"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/student-register"
                    className={`w-full py-4 px-6 rounded-full font-bold text-center transition-all duration-300 hover:-translate-y-1 ${
                      plan.featured
                        ? 'bg-gradient-primary text-white shadow-md hover:shadow-colored'
                        : 'bg-white text-primary border-2 border-primary hover:bg-gradient-primary hover:text-white hover:border-transparent'
                    }`}
                    aria-label={`Get Started with ${plan.name} Student Plan`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Plans */}
          <div>
            <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-center text-slate-800 mb-10 xl:mb-12 flex items-center justify-center gap-3">
              <span className="fas fa-chalkboard-teacher text-primary" aria-hidden="true"></span>
              Plans for Teachers
            </h3>
            <div className="grid md:grid-cols-3 gap-6 xl:gap-8 max-w-content mx-auto">
              {teacherPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-8 shadow-lg border-2 transition-all duration-300 hover:-translate-y-4 hover:shadow-colored flex flex-col relative ${
                    plan.featured
                      ? 'border-primary scale-105 bg-gradient-to-b from-white to-blue-50/30'
                      : 'border-transparent'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white px-6 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-800 mb-4">{plan.name}</h4>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-lg xl:text-xl text-slate-500">₹</span>
                      <span className="text-4xl xl:text-5xl font-extrabold text-gradient-primary">{plan.price}</span>
                      <span className="text-base xl:text-lg text-slate-500">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 flex-grow mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-slate-700">
                        <span className="fas fa-check text-secondary mt-1" aria-hidden="true"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/teacher-register"
                    className={`w-full py-4 px-6 rounded-full font-bold text-center transition-all duration-300 hover:-translate-y-1 ${
                      plan.featured
                        ? 'bg-gradient-primary text-white shadow-md hover:shadow-colored'
                        : 'bg-white text-primary border-2 border-primary hover:bg-gradient-primary hover:text-white hover:border-transparent'
                    }`}
                    aria-label={`Get Started with ${plan.name} Plan for Teachers`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

