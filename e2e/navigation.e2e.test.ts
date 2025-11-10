/**
 * E2E Tests for Navigation
 */

describe('Navigation E2E Tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
  })

  it('should navigate to contact page', async () => {
    const contactLink = await page.$('a[href="/contact"]')
    if (contactLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        contactLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/contact')
    }
  })

  it('should navigate to pricing page', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    const pricingLink = await page.$('a[href="/pricing"]')
    if (pricingLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        pricingLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/pricing')
    }
  })

  it('should navigate to FAQ page', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    const faqLink = await page.$('a[href="/faq"]')
    if (faqLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        faqLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/faq')
    }
  })

  it('should navigate back to home page', async () => {
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle0' })
    
    const homeLink = await page.$('a[href="/"]')
    if (homeLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        homeLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/')
    }
  })

  it('should have working logo link to home', async () => {
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle0' })
    
    // Find logo link by text content
    const links = await page.$$('a')
    let logoLink = null
    for (const link of links) {
      const text = await link.evaluate((el) => el.textContent)
      if (text?.includes('OneHourStudy')) {
        logoLink = link
        break
      }
    }
    
    if (logoLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        logoLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/')
    }
  })

  it('should toggle mobile menu on mobile viewport', async () => {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667 })
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })

    const menuButton = await page.$('button[aria-label="Toggle menu"]')
    if (menuButton) {
      await menuButton.click()
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if mobile menu is visible
      const mobileMenu = await page.$('ul.md\\:hidden')
      expect(mobileMenu).not.toBeNull()
    }
  })
})

