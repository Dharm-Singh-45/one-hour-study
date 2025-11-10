/**
 * E2E Tests for Home Page
 */

describe('Home Page E2E Tests', () => {
  beforeAll(async () => {
    // Ensure we're on the home page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
  })

  it('should load the home page successfully', async () => {
    const title = await page.title()
    expect(title).toMatch(/OneHourStudy/i)
    expect(page.url()).toBe('http://localhost:3000/')
  })

  it('should display the main hero section', async () => {
    const heroText = await page.evaluate(() => document.body.textContent || '')
    expect(heroText).toContain('Connecting Students with Expert Tutors')
  })

  it('should have working navigation links', async () => {
    // Check for Home link
    const homeLink = await page.$('a[href="/"]')
    expect(homeLink).not.toBeNull()

    // Check for Contact link
    const contactLink = await page.$('a[href="/contact"]')
    expect(contactLink).not.toBeNull()

    // Check for Login link
    const loginLink = await page.$('a[href="/login"]')
    expect(loginLink).not.toBeNull()
  })

  it('should navigate to student registration page', async () => {
    const studentRegisterLink = await page.$('a[href="/student-register"]')
    expect(studentRegisterLink).not.toBeNull()

    if (studentRegisterLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        studentRegisterLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/student-register')
    }
  })

  it('should navigate to teacher registration page', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    const teacherRegisterLink = await page.$('a[href="/teacher-register"]')
    expect(teacherRegisterLink).not.toBeNull()

    if (teacherRegisterLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        teacherRegisterLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/teacher-register')
    }
  })

  it('should display About section', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    const aboutText = await page.evaluate(() => document.body.textContent || '')
    expect(aboutText).toContain('About OneHourStudy')
  })

  it('should display Why Choose section', async () => {
    const whyChooseText = await page.evaluate(() => document.body.textContent || '')
    expect(whyChooseText).toContain('Why Choose OneHourStudy')
  })

  it('should display testimonials section', async () => {
    const testimonialsText = await page.evaluate(() => document.body.textContent || '')
    expect(testimonialsText).toContain('What Our Students Say')
  })

  it('should have responsive navigation menu', async () => {
    // Set viewport to mobile size to ensure menu button is visible
    await page.setViewport({ width: 375, height: 667 })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if mobile menu button exists
    const menuButton = await page.$('button[aria-label="Toggle menu"]')
    expect(menuButton).not.toBeNull()

    if (menuButton) {
      // Wait for button to be visible and clickable
      await page.waitForSelector('button[aria-label="Toggle menu"]', { visible: true, timeout: 5000 })
      
      // Click the button
      await menuButton.click({ delay: 100 })
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for menu animation
      
      // Check if mobile menu is visible - try multiple selectors
      const mobileMenu = await page.$('ul.md\\:hidden') || await page.$('ul[class*="md:hidden"]')
      expect(mobileMenu).not.toBeNull()
    }
  }, 15000) // Increase timeout for this test
})

