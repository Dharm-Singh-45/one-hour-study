'use client';

import Head from 'next/head';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { generateMetadata } from '@/lib/seo';

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

export default function FAQ() {
  const metadata = generateMetadata('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'General',
      icon: 'fa-info-circle',
      questions: [
        {
          question: 'What is OneHourStudy?',
          answer: 'OneHourStudy is a platform that connects students with qualified home tutors for all subjects from class 1 to class 12. We focus on efficient one-hour daily learning sessions to maximize understanding and retention.',
        },
        {
          question: 'How does OneHourStudy work?',
          answer: 'Students can register on our platform and browse through verified tutors. Teachers can register to offer their services. Once matched, students and teachers can schedule convenient one-hour sessions for home tutoring.',
        },
        {
          question: 'Where is OneHourStudy available?',
          answer: 'OneHourStudy currently operates in Jodhpur, Rajasthan. We provide home tutoring services across all areas of Jodhpur city for all subjects from class 1 to 12 and extracurricular activities.',
        },
      ],
    },
    {
      category: 'For Students',
      icon: 'fa-user-graduate',
      questions: [
        {
          question: 'How do I find a tutor in Jodhpur?',
          answer: 'Simply register as a student, fill in your details including your class, subjects needed, and area in Jodhpur city. Our platform will show you available home tutors matching your requirements from your area. You can then contact them directly through the platform.',
        },
        {
          question: 'What subjects and activities are covered?',
          answer: 'OneHourStudy in Jodhpur covers all subjects from class 1 to class 12, including Mathematics, Science, English, Social Studies, Languages, and more. We also provide tutors for extracurricular activities like music, sports, arts, dance, and specialized coaching for competitive exams.',
        },
        {
          question: 'Can I have multiple tutors for different subjects?',
          answer: 'Absolutely! You can have different tutors for different subjects based on your learning needs. Each subject can have its dedicated tutor for specialized attention.',
        },
        {
          question: 'What is the duration of each session?',
          answer: 'Each tutoring session is designed to be one hour long. This focused duration helps maintain concentration and maximize learning efficiency. However, session duration can be customized based on mutual agreement with your tutor.',
        },
        {
          question: 'How much does tutoring cost?',
          answer: 'Pricing varies based on the class level, subject, and tutor experience. We offer flexible pricing plans starting from ₹500 per hour. Check our Pricing page for detailed information.',
        },
      ],
    },
    {
      category: 'For Teachers',
      icon: 'fa-chalkboard-teacher',
      questions: [
        {
          question: 'How do I become a tutor in Jodhpur?',
          answer: 'Simply register as a teacher on our platform. Fill in your qualifications, experience, subjects you teach (class 1-12 or extracurricular activities), and your availability in Jodhpur city. Once verified, your profile will be visible to students looking for home tutors in your area.',
        },
        {
          question: 'What qualifications are required?',
          answer: 'We accept tutors with various qualifications including graduation, post-graduation, and professional degrees. Relevant teaching experience is preferred. All qualifications are verified during the registration process.',
        },
        {
          question: 'How do I get paid?',
          answer: 'Payment is processed through our platform after each completed session. Tutors receive payment on a monthly basis directly to their registered bank account. We ensure secure and timely payments.',
        },
        {
          question: 'Can I set my own rates?',
          answer: 'Yes, you can set your hourly rates based on your qualifications and experience. Our platform provides suggested rates based on market standards, but you have the flexibility to set your own pricing.',
        },
        {
          question: 'How many students can I teach?',
          answer: 'There is no limit to the number of students you can teach. You can manage multiple students and set your own schedule based on your availability. Our platform helps you organize and manage all your students efficiently.',
        },
      ],
    },
    {
      category: 'Payment & Plans',
      icon: 'fa-credit-card',
      questions: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept various payment methods including UPI, credit/debit cards, net banking, and digital wallets. All payments are processed securely through our payment gateway.',
        },
        {
          question: 'Are there any registration fees?',
          answer: 'No, there are no registration fees for students or teachers. Registration is completely free. You only pay for the tutoring sessions as per your selected plan.',
        },
        {
          question: 'Can I cancel or change my plan?',
          answer: 'Yes, you can cancel or upgrade/downgrade your plan at any time. Changes will be reflected in your next billing cycle. Please refer to our refund policy for cancellation details.',
        },
        {
          question: 'Is there a refund policy?',
          answer: 'Yes, we offer a refund policy for unused sessions. If you cancel a plan, you will receive a prorated refund for the remaining sessions. Refund processing takes 5-7 business days.',
        },
      ],
    },
    {
      category: 'Support',
      icon: 'fa-headset',
      questions: [
        {
          question: 'How can I contact support?',
          answer: 'You can contact our support team through the Contact page on our website. We also provide email support at support@onehourstudy.com and phone support at our helpline number. We typically respond within 24 hours.',
        },
        {
          question: 'What if I face issues with my tutor?',
          answer: 'If you face any issues with your tutor, you can contact our support team immediately. We have a dedicated team to resolve conflicts and can help you find an alternative tutor if needed.',
        },
        {
          question: 'Can I change my tutor?',
          answer: 'Yes, you can change your tutor at any time through your student dashboard. Simply select a different tutor from the available options, and we will help facilitate the transition.',
        },
      ],
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ structured data
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((category) =>
      category.questions.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }))
    ),
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
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
        
        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      </Head>
      <Navbar />
      
      <section className="py-16 xl:py-20 bg-gradient-hero min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
            <div className="text-center mb-12 xl:mb-16">
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-slate-800 mb-4 relative inline-block w-full">
                Frequently Asked Questions
                <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded"></span>
              </h2>
              <p className="text-center text-slate-600 text-base xl:text-lg max-w-2xl mx-auto">
                Find answers to common questions about OneHourStudy. Can't find what you're looking for? <a href="/contact" className="text-primary hover:underline font-semibold">Contact us</a> for more information.
              </p>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-3xl p-6 xl:p-8 shadow-lg border-2 border-primary/10 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`fas ${category.icon} text-2xl xl:text-3xl text-primary`} aria-hidden="true"></span>
                    <h3 className="text-2xl xl:text-3xl font-bold text-slate-800">{category.category}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex;
                      const isOpen = openIndex === globalIndex;
                      
                      return (
                        <div key={faqIndex} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300">
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full px-5 xl:px-6 py-4 xl:py-5 text-left flex items-center justify-between gap-4 bg-slate-50 hover:bg-primary/5 transition-all duration-300 group"
                          >
                            <span className="flex-1 font-semibold text-slate-800 text-base xl:text-lg group-hover:text-primary transition-colors">
                              {faq.question}
                            </span>
                            <span className={`fas fa-chevron-down text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true"></span>
                          </button>
                          
                          {isOpen && (
                            <div className="px-5 xl:px-6 py-4 xl:py-5 bg-white border-t border-slate-200">
                              <p className="text-slate-600 text-sm xl:text-base leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 xl:mt-16 text-center">
              <div className="bg-gradient-primary rounded-3xl p-8 xl:p-10 shadow-xl text-white">
                <h3 className="text-2xl xl:text-3xl font-bold mb-4">Still have questions?</h3>
                <p className="text-white/90 mb-6 text-base xl:text-lg">
                  Our support team is here to help you. Get in touch with us and we'll respond as soon as possible.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-primary py-3 px-8 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  aria-label="Contact Support - Get Help from OneHourStudy"
                >
                  <span className="fas fa-envelope" aria-hidden="true"></span>
                  Contact Support
                </a>
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

