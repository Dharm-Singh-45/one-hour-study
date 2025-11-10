import { siteConfig, pageSEO, generateMetadata } from '../seo'

describe('SEO Configuration', () => {
  describe('siteConfig', () => {
    it('should have correct site configuration', () => {
      expect(siteConfig.name).toBe('OneHourStudy')
      expect(siteConfig.url).toBe('https://onehourstudy.com')
      expect(siteConfig.locale).toBe('en_IN')
      expect(siteConfig.location.city).toBe('Jodhpur')
      expect(siteConfig.location.state).toBe('Rajasthan')
      expect(siteConfig.location.country).toBe('India')
    })

    it('should have description', () => {
      expect(siteConfig.description).toBeTruthy()
      expect(siteConfig.description.length).toBeGreaterThan(0)
    })
  })

  describe('pageSEO', () => {
    it('should have SEO data for all pages', () => {
      const pages = ['home', 'studentRegister', 'teacherRegister', 'pricing', 'faq', 'contact', 'studentLogin', 'teacherLogin', 'login']
      
      pages.forEach(page => {
        const seo = pageSEO[page as keyof typeof pageSEO]
        expect(seo).toBeDefined()
        expect(seo.title).toBeTruthy()
        expect(seo.description).toBeTruthy()
        expect(seo.keywords).toBeTruthy()
      })
    })

    it('should have home page SEO', () => {
      const home = pageSEO.home
      expect(home.title).toContain('Home Tutors in Jodhpur')
      expect(home.description).toContain('Jodhpur')
      expect(home.keywords).toContain('home tutors in Jodhpur')
    })

    it('should have student register page SEO', () => {
      const studentRegister = pageSEO.studentRegister
      expect(studentRegister.title).toContain('Student Registration')
      expect(studentRegister.description).toContain('student')
    })

    it('should have teacher register page SEO', () => {
      const teacherRegister = pageSEO.teacherRegister
      expect(teacherRegister.title).toContain('Teacher Registration')
      expect(teacherRegister.description).toContain('tutor')
    })

    it('should have pricing page SEO', () => {
      const pricing = pageSEO.pricing
      expect(pricing.title).toContain('Tutoring Plans')
      expect(pricing.description).toContain('pricing')
    })

    it('should have FAQ page SEO', () => {
      const faq = pageSEO.faq
      expect(faq.title).toContain('FAQ')
      expect(faq.description).toContain('Frequently asked questions')
    })

    it('should have contact page SEO', () => {
      const contact = pageSEO.contact
      expect(contact.title).toContain('Contact')
      expect(contact.description).toContain('Contact')
    })

    it('should have login pages SEO', () => {
      expect(pageSEO.studentLogin.title).toContain('Student Login')
      expect(pageSEO.teacherLogin.title).toContain('Teacher Login')
      expect(pageSEO.login.title).toContain('Login')
    })
  })

  describe('generateMetadata', () => {
    it('should generate metadata for home page', () => {
      const metadata = generateMetadata('home')
      
      expect(metadata.title).toContain('OneHourStudy')
      expect(metadata.description).toBeTruthy()
      expect(metadata.keywords).toBeTruthy()
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.twitter).toBeDefined()
      expect(metadata.alternates).toBeDefined()
    })

    it('should generate metadata with correct URL for home page', () => {
      const metadata = generateMetadata('home')
      expect(metadata.openGraph.url).toBe('https://onehourstudy.com')
      expect(metadata.alternates.canonical).toBe('https://onehourstudy.com')
    })

    it('should generate metadata with correct URL for other pages', () => {
      const metadata = generateMetadata('pricing')
      expect(metadata.openGraph.url).toBe('https://onehourstudy.com/pricing')
      expect(metadata.alternates.canonical).toBe('https://onehourstudy.com/pricing')
    })

    it('should include OpenGraph data', () => {
      const metadata = generateMetadata('home')
      
      expect(metadata.openGraph.title).toBeTruthy()
      expect(metadata.openGraph.description).toBeTruthy()
      expect(metadata.openGraph.siteName).toBe('OneHourStudy')
      expect(metadata.openGraph.images).toHaveLength(1)
      expect(metadata.openGraph.images[0].url).toBe(siteConfig.ogImage)
      expect(metadata.openGraph.locale).toBe('en_IN')
      expect(metadata.openGraph.type).toBe('website')
    })

    it('should include Twitter card data', () => {
      const metadata = generateMetadata('home')
      
      expect(metadata.twitter.card).toBe('summary_large_image')
      expect(metadata.twitter.title).toBeTruthy()
      expect(metadata.twitter.description).toBeTruthy()
      expect(metadata.twitter.images).toHaveLength(1)
      expect(metadata.twitter.creator).toBe('@onehourstudy')
    })

    it('should generate metadata for all pages', () => {
      const pages: Array<keyof typeof pageSEO> = [
        'home',
        'studentRegister',
        'teacherRegister',
        'pricing',
        'faq',
        'contact',
        'studentLogin',
        'teacherLogin',
        'login',
      ]

      pages.forEach(page => {
        const metadata = generateMetadata(page)
        expect(metadata.title).toBeTruthy()
        expect(metadata.description).toBeTruthy()
        expect(metadata.openGraph).toBeDefined()
        expect(metadata.twitter).toBeDefined()
        expect(metadata.alternates).toBeDefined()
      })
    })

    it('should have full title with site name', () => {
      const metadata = generateMetadata('home')
      expect(metadata.title).toContain('OneHourStudy')
      expect(metadata.openGraph.title).toContain('OneHourStudy')
      expect(metadata.twitter.title).toContain('OneHourStudy')
    })
  })
})

