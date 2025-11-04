export const siteConfig = {
  name: 'OneHourStudy',
  description: 'Find qualified home tutors in Jodhpur, Rajasthan for all subjects from class 1 to 12 and extracurricular activities. Quality home tuition services across all areas of Jodhpur city.',
  url: 'https://onehourstudy.com', // Update with your actual domain
  ogImage: 'https://onehourstudy.com/og-image.jpg', // Update with your actual OG image
  locale: 'en_IN',
  twitterHandle: '@onehourstudy', // Update with your Twitter handle if available
  location: {
    city: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
  },
};

export const pageSEO = {
  home: {
    title: 'Home Tutors in Jodhpur | OneHourStudy - Class 1-12 & Extracurricular Activities',
    description: 'Find qualified home tutors in Jodhpur, Rajasthan for all subjects from class 1 to 12 and extracurricular activities. Home tuition services available in all areas of Jodhpur city. Register now to find expert tutors near you!',
    keywords: 'home tutors in Jodhpur, home tuition Jodhpur, private tutors Jodhpur, tuition teachers Jodhpur Rajasthan, home tutors Jodhpur city, class 1 to 12 tutors Jodhpur, extracurricular activities tutors Jodhpur, best tutors in Jodhpur, qualified tutors Jodhpur, tutor near me Jodhpur, home tuition services Jodhpur, one hour study Jodhpur',
  },
  studentRegister: {
    title: 'Student Registration Jodhpur - Find Home Tutors | OneHourStudy',
    description: 'Register as a student in Jodhpur and find qualified home tutors for all subjects from class 1 to 12 and extracurricular activities. Home tuition available in all areas of Jodhpur city. Join now!',
    keywords: 'student registration Jodhpur, find tutor Jodhpur, register student Jodhpur Rajasthan, home tuition registration Jodhpur, find teacher Jodhpur, tutor registration Jodhpur',
  },
  teacherRegister: {
    title: 'Teacher Registration Jodhpur - Join as Home Tutor | OneHourStudy',
    description: 'Register as a home tutor in Jodhpur, Rajasthan and connect with students across all areas of Jodhpur city. Teach subjects from class 1 to 12 and extracurricular activities. Start teaching today!',
    keywords: 'teacher registration Jodhpur, tutor registration Jodhpur Rajasthan, become a tutor Jodhpur, teach in Jodhpur, home tuition teacher Jodhpur, tutor jobs Jodhpur',
  },
  pricing: {
    title: 'Tutoring Plans Jodhpur - Affordable Home Tuition Rates | OneHourStudy',
    description: 'Flexible and affordable pricing plans for home tutoring in Jodhpur, Rajasthan. Tutoring services for all subjects class 1 to 12 and extracurricular activities. Competitive rates available.',
    keywords: 'tutoring prices Jodhpur, tutor rates Jodhpur, tuition fees Jodhpur Rajasthan, affordable tutoring Jodhpur, pricing plans Jodhpur, tutor cost Jodhpur, home tuition charges Jodhpur',
  },
  faq: {
    title: 'FAQ - Home Tutors in Jodhpur | OneHourStudy',
    description: 'Frequently asked questions about home tutoring services in Jodhpur, Rajasthan. Learn about our platform, tutors for class 1-12, extracurricular activities, and home tuition in all areas of Jodhpur city.',
    keywords: 'FAQ Jodhpur, home tutor questions Jodhpur, tutoring FAQ Jodhpur Rajasthan, how to find tutor Jodhpur, tutor services Jodhpur FAQ',
  },
  contact: {
    title: 'Contact Us Jodhpur - Home Tutor Support | OneHourStudy',
    description: 'Contact OneHourStudy support team in Jodhpur, Rajasthan for home tutoring services. We provide tutors for all subjects class 1-12 and extracurricular activities across all areas of Jodhpur city.',
    keywords: 'contact home tutors Jodhpur, tutor support Jodhpur Rajasthan, get in touch Jodhpur, home tuition contact Jodhpur, tutor help Jodhpur',
  },
  studentLogin: {
    title: 'Student Login Jodhpur - OneHourStudy | Sign In',
    description: 'Login to your student account on OneHourStudy. Access your profile, find tutors, and manage your learning journey in Jodhpur, Rajasthan.',
    keywords: 'student login Jodhpur, sign in OneHourStudy, student account Jodhpur, login portal Jodhpur',
  },
  teacherLogin: {
    title: 'Teacher Login Jodhpur - OneHourStudy | Sign In',
    description: 'Login to your teacher account on OneHourStudy. Access your profile, manage students, and grow your tutoring business in Jodhpur, Rajasthan.',
    keywords: 'teacher login Jodhpur, tutor login Jodhpur, sign in OneHourStudy, teacher account Jodhpur, login portal Jodhpur',
  },
  login: {
    title: 'Login - OneHourStudy | Sign In as Student or Teacher',
    description: 'Login to your OneHourStudy account. Sign in as a student or teacher to access your profile, find tutors, and manage your learning or teaching journey in Jodhpur, Rajasthan.',
    keywords: 'login OneHourStudy, student login Jodhpur, teacher login Jodhpur, sign in OneHourStudy, tutor login Jodhpur',
  },
};

// Map page keys to their URL paths
const pagePaths: Record<keyof typeof pageSEO, string> = {
  home: '',
  studentRegister: 'student-register',
  teacherRegister: 'teacher-register',
  pricing: 'pricing',
  faq: 'faq',
  contact: 'contact',
  studentLogin: 'student-login',
  teacherLogin: 'teacher-login',
  login: 'login',
};

export const generateMetadata = (page: keyof typeof pageSEO) => {
  const seo = pageSEO[page];
  const fullTitle = `${seo.title} | ${siteConfig.name}`;
  const path = pagePaths[page];
  const fullUrl = `${siteConfig.url}${path ? `/${path}` : ''}`;
  
  return {
    title: fullTitle,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: fullTitle,
      description: seo.description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
};

