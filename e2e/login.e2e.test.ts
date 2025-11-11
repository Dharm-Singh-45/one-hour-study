/**
 * E2E Tests for Login Page
 */

describe('Login Page E2E Tests', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' })
  })

  beforeEach(async () => {
    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear()
    })
    
    // Clear all form fields before each test
    await page.evaluate(() => {
      // Clear all input fields
      const inputs = document.querySelectorAll('input[type="email"], input[type="password"]')
      Array.from(inputs).forEach((input) => {
        const el = input
        // @ts-expect-error - Element properties exist at runtime in browser context
        el['value'] = ''
        el.dispatchEvent(new Event('input', { bubbles: true }))
      })
      
      // Clear any error messages
      const errorElements = document.querySelectorAll('.text-red-700, .text-red-600, [class*="error"]')
      Array.from(errorElements).forEach((el) => {
        if (el.textContent && el.textContent.trim() !== '') {
          el.textContent = ''
        }
      })
    })
    
    // Reload the page to ensure clean state
    await page.reload({ waitUntil: 'networkidle0' })
  })

  it('should load the login page', async () => {
    expect(page.url()).toBe('http://localhost:3000/login')
    const pageTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const h2 = document.querySelector('h2')
      return (h1?.textContent || h2?.textContent || '')
    })
    expect(pageTitle).toContain('Login')
  })

  it('should display user type selector (Student/Teacher)', async () => {
    const bodyText = await page.evaluate(() => document.body.textContent || '')
    expect(bodyText).toContain('Student')
    expect(bodyText).toContain('Teacher')
    
    // Find buttons by text content
    const buttons = await page.$$('button')
    const buttonTexts = await Promise.all(buttons.map(btn => btn.evaluate((el) => el.textContent)))
    expect(buttonTexts.some(text => text?.includes('Student'))).toBe(true)
    expect(buttonTexts.some(text => text?.includes('Teacher'))).toBe(true)
  })

  it('should switch to teacher login when teacher button is clicked', async () => {
    // Find teacher button by text content
    const buttons = await page.$$('button')
    let teacherButton = null
    for (const btn of buttons) {
      const text = await btn.evaluate((el) => el.textContent)
      if (text?.includes('Teacher') && !text?.includes('Sign In')) {
        teacherButton = btn
        break
      }
    }
    
    if (teacherButton) {
      await teacherButton.click()
      await new Promise(resolve => setTimeout(resolve, 500))

      const bodyText = await page.evaluate(() => document.body.textContent || '')
      expect(bodyText).toContain('Sign In as Teacher')
    }
  })

  it('should show validation error for invalid email', async () => {
    const emailInput = await page.$('input[type="email"]')
    const passwordInput = await page.$('input[type="password"]')

    if (emailInput && passwordInput) {
      // Use email that passes HTML5 validation but fails React validation (has @ but no .)
      await emailInput.type('invalid@email')
      await passwordInput.type('password123')
      await new Promise(resolve => setTimeout(resolve, 500))

      const submitButton = await page.$('button[type="submit"]')
      if (submitButton) {
        await submitButton.click()
        
        // Wait a bit for validation to run
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if we navigated away (form submitted incorrectly)
        const currentUrl = page.url()
        if (currentUrl !== 'http://localhost:3000/login') {
          throw new Error('Form submitted successfully with invalid email - validation not working')
        }

        // Check for error message element directly
        const errorElements = await page.$$('p.text-red-700')
        let found = false
        for (const errorElement of errorElements) {
          const errorText = await page.evaluate((el) => el.textContent || '', errorElement)
          if (errorText.match(/valid email address|Please enter a valid email/i)) {
            found = true
            break
          }
        }
        
        // If not found, check body text as fallback
        if (!found) {
          const bodyText = await page.evaluate(() => document.body.textContent || '')
          if (bodyText.match(/valid email address|Please enter a valid email/i)) {
            found = true
          }
        }
        
        expect(found).toBe(true)
      }
    }
  })

  it('should show validation error for short password', async () => {
    const emailInput = await page.$('input[type="email"]')
    const passwordInput = await page.$('input[type="password"]')

    if (emailInput && passwordInput) {
      await emailInput.type('test@example.com')
      await passwordInput.type('123')

      const submitButton = await page.$('button[type="submit"]')
      if (submitButton) {
        await submitButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const errorText = await page.evaluate(() => document.body.textContent || '')
        expect(errorText).toContain('at least 6 characters')
      }
    }
  })

  it('should have links to registration pages', async () => {
    // Login page now links to unified /register page
    const registerLink = await page.$('a[href="/register"]')
    expect(registerLink).not.toBeNull()
    
    // Check that the link text contains "Sign up"
    const linkText = await page.evaluate((el) => el?.textContent || '', registerLink)
    expect(linkText).toMatch(/Sign up/i)
  })

  it('should navigate to registration page', async () => {
    const registerLink = await page.$('a[href="/register"]')
    if (registerLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        registerLink.click(),
      ])
      expect(page.url()).toBe('http://localhost:3000/register')
      
      // Verify the registration page has user type selector
      const pageText = await page.evaluate(() => document.body.textContent || '')
      expect(pageText).toMatch(/Student|Teacher|Register/i)
    }
  })
})

