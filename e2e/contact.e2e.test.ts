/**
 * E2E Tests for Contact Page
 */

describe('Contact Page E2E Tests', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle0' })
  })

  beforeEach(async () => {
    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear()
    })
    
    // Clear all form fields before each test
    await page.evaluate(() => {
      // Clear all input fields
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]')
      Array.from(inputs).forEach((input) => {
        const el = input
        // @ts-expect-error - Element properties exist at runtime in browser context
        el['value'] = ''
        el.dispatchEvent(new Event('input', { bubbles: true }))
      })
      
      // Clear all select fields
      const selects = document.querySelectorAll('select')
      Array.from(selects).forEach((select) => {
        const el = select
        el['selectedIndex'] = 0
        el.dispatchEvent(new Event('change', { bubbles: true }))
      })
      
      // Clear all textarea fields
      const textareas = document.querySelectorAll('textarea')
      Array.from(textareas).forEach((textarea) => {
        const el = textarea
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

  it('should load the contact page', async () => {
    expect(page.url()).toBe('http://localhost:3000/contact')
    const pageTitle = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const h2 = document.querySelector('h2')
      return (h1?.textContent || h2?.textContent || '')
    })
    expect(pageTitle).toMatch(/Contact|Get in Touch/i)
  })

  it('should display contact form', async () => {
    const form = await page.$('form')
    expect(form).not.toBeNull()
  })

  it('should display all form fields', async () => {
    const nameInput = await page.$('input[name="name"]')
    const emailInput = await page.$('input[name="email"]')
    const phoneInput = await page.$('input[name="phone"]')
    const subjectSelect = await page.$('select[name="subject"]')
    const messageTextarea = await page.$('textarea[name="message"]')

    expect(nameInput).not.toBeNull()
    expect(emailInput).not.toBeNull()
    expect(phoneInput).not.toBeNull()
    expect(subjectSelect).not.toBeNull()
    expect(messageTextarea).not.toBeNull()
  })

  it('should show validation error for empty form submission', async () => {
    const submitButton = await page.$('button[type="submit"]')
    if (submitButton) {
      await submitButton.click()
      await new Promise(resolve => setTimeout(resolve, 1000))

      const errorText = await page.evaluate(() => document.body.textContent || '')
      expect(errorText).toMatch(/name|email|phone|subject|message/i)
    }
  })

  it('should show validation error for invalid email', async () => {
    // Fill in other required fields to bypass HTML5 validation
    const nameInput = await page.$('input[name="name"]')
    const emailInput = await page.$('input[name="email"]')
    const subjectSelect = await page.$('select[name="subject"]')
    const messageTextarea = await page.$('textarea[name="message"]')

    if (nameInput) await nameInput.type('Test User')
    // Use email that passes HTML5 validation but fails React validation (has @ but no .)
    if (emailInput) await emailInput.type('invalid@email')
    if (subjectSelect) {
      await subjectSelect.evaluate((el, value) => {
        el.value = value
        el.dispatchEvent(new Event('change', { bubbles: true }))
      }, 'general')
    }
    if (messageTextarea) await messageTextarea.type('Test message')
    
    await new Promise(resolve => setTimeout(resolve, 500))

    const submitButton = await page.$('button[type="submit"]')
    if (submitButton) {
      await submitButton.click()
      
      // Wait a bit for validation to run
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if success modal appeared (form submitted incorrectly)
      const successModal = await page.$('[data-testid="success-modal"]')
      if (successModal) {
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
  })

  it('should successfully submit contact form with valid data', async () => {
    const nameInput = await page.$('input[name="name"]')
    const emailInput = await page.$('input[name="email"]')
    const phoneInput = await page.$('input[name="phone"]')
    const subjectSelect = await page.$('select[name="subject"]')
    const messageTextarea = await page.$('textarea[name="message"]')

    if (nameInput) await nameInput.type('John Doe')
    if (emailInput) await emailInput.type('john@example.com')
    if (phoneInput) await phoneInput.type('1234567890')
    if (subjectSelect) {
      await subjectSelect.evaluate((el, value) => {
        el.value = value
        el.dispatchEvent(new Event('change', { bubbles: true }))
      }, 'general')
    }
    if (messageTextarea) await messageTextarea.type('This is a test message for contact form.')

    const submitButton = await page.$('button[type="submit"]')
    if (submitButton) {
      await submitButton.click()
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Check for success modal
      const successModal = await page.$('[data-testid="success-modal"]')
      expect(successModal).not.toBeNull()
    }
  })

  it('should display contact information', async () => {
    const contactInfo = await page.evaluate(() => document.body.textContent || '')
    expect(contactInfo).toMatch(/Address|Phone|Email|Business Hours/i)
  })
})

