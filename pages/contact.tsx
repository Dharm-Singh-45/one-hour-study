'use client';

import Head from 'next/head';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SuccessModal from '@/components/SuccessModal';
import { isValidEmail, isValidPhone, saveToLocalStorage } from '@/lib/utils';
import { generateMetadata } from '@/lib/seo';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10 digits)';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const contactData = {
        type: 'contact',
        ...formData,
        timestamp: new Date().toISOString(),
      };
      saveToLocalStorage(`contact_${Date.now()}`, contactData);
      setShowModal(true);
    }
  };

  const metadata = generateMetadata('contact');

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
        
        {/* Contact Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: 'Contact OneHourStudy - Jodhpur',
              description: metadata.description,
              url: metadata.alternates.canonical,
              mainEntity: {
                '@type': 'Organization',
                name: 'OneHourStudy',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Jodhpur',
                  addressRegion: 'Rajasthan',
                  addressCountry: 'IN',
                },
              },
            }),
          }}
        />
      </Head>
      <Navbar />
      
      <section className="py-16 xl:py-20 bg-gradient-hero min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-container mx-auto">
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-center text-slate-800 mb-4 relative inline-block w-full">
            Get in Touch
            <span className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-primary rounded"></span>
          </h2>
          <p className="text-center text-slate-600 text-base xl:text-lg mb-10 xl:mb-12">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <div className="grid md:grid-cols-2 gap-8 xl:gap-12 max-w-content mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-6 xl:p-8 md:p-10 shadow-xl border-2 border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="fas fa-paper-plane text-primary" aria-hidden="true"></span>
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <span className="fas fa-user text-primary" aria-hidden="true"></span>
                    Your Name <span className="text-red-700 font-bold" aria-label="required">*</span>
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                  />
                  {errors.phone && <p className="text-red-700 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <span className="fas fa-tag text-primary" aria-hidden="true"></span>
                    Subject <span className="text-red-700 font-bold" aria-label="required">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.subject ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                    required
                  >
                    <option value="">Select a Subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="registration">Registration Help</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <p className="text-red-700 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                    <span className="fas fa-comment text-primary" aria-hidden="true"></span>
                    Message <span className="text-red-700 font-bold" aria-label="required">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      errors.message ? 'border-red-500' : 'border-slate-200 hover:border-primary-light focus:border-primary'
                    } focus:outline-none focus:ring-4 focus:ring-primary/15`}
                    required
                  ></textarea>
                  {errors.message && <p className="text-red-700 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-primary text-white py-4 px-8 rounded-full font-bold text-lg shadow-md hover:shadow-colored transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="fas fa-paper-plane mr-2" aria-hidden="true"></span>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-3xl p-6 xl:p-8 md:p-10 shadow-xl border-2 border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="fas fa-info-circle text-primary" aria-hidden="true"></span>
                Contact Information
              </h3>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="fas fa-map-marker-alt text-white text-xl" aria-hidden="true"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Address</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Jodhpur, Rajasthan<br />
                      India<br />
                      <span className="text-sm text-slate-500 mt-1 block">Home tutoring services available in all areas of Jodhpur city</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="fas fa-phone text-white text-xl" aria-hidden="true"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Phone</h4>
                    <p className="text-slate-600">
                      +91 123 456 7890<br />
                      +91 987 654 3210
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="fas fa-envelope text-white text-xl" aria-hidden="true"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Email</h4>
                    <p className="text-slate-600">
                      info@onehourstudy.com<br />
                      support@onehourstudy.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="fas fa-clock text-white text-xl" aria-hidden="true"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Business Hours</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    {[
                      { name: 'facebook', label: 'Visit our Facebook page' },
                      { name: 'twitter', label: 'Visit our Twitter page' },
                      { name: 'instagram', label: 'Visit our Instagram page' },
                      { name: 'linkedin', label: 'Visit our LinkedIn page' },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href="#"
                        className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary hover:bg-gradient-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                        aria-label={social.label}
                      >
                        <span className={`fab fa-${social.name}`} aria-hidden="true"></span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Message Sent Successfully!"
        message="Thank you for contacting us. We'll get back to you as soon as possible."
      />
    </>
  );
}

