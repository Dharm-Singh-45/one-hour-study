# SEO Checking Guide for Localhost

## Methods to Check SEO Score on Localhost

### 1. Chrome DevTools - Lighthouse (Easiest & Recommended)

**Steps:**
1. Start your Next.js development server:
   ```bash
   npm run dev
   ```
2. Open Chrome browser and go to `http://localhost:3000`
3. Open DevTools (F12 or Right-click → Inspect)
4. Go to **Lighthouse** tab
5. Check **SEO** checkbox
6. Select **Desktop** or **Mobile** mode
7. Click **Generate report**
8. Review the SEO score and recommendations

**What it checks:**
- Meta tags (title, description)
- Heading structure
- Alt text for images
- Link text
- Viewport configuration
- Robots.txt
- And more SEO best practices

---

### 2. SEO Browser Extensions

**Install these Chrome extensions:**

#### a) SEOquake
- Install from Chrome Web Store
- Shows SEO metrics on every page
- Works on localhost
- Displays: meta tags, headings, links, images, etc.

#### b) Lighthouse SEO Extension
- Official Google extension
- Quick SEO audits
- Works with localhost

#### c) WAVE Web Accessibility Evaluator
- Checks accessibility (affects SEO)
- Shows issues directly on page
- Works on localhost

---

### 3. Command Line Tools

### Install SEO tools globally:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run SEO audit
lighthouse http://localhost:3000 --only-categories=seo --output=html --output-path=./seo-report.html
```

This will:
- Generate an HTML report
- Show SEO score
- List all issues and recommendations

### 4. Online SEO Checkers (Need Live URL)

**For when you deploy:**
- **Google Search Console** (free) - Best for real SEO
- **Screaming Frog SEO Spider** (free tier available)
- **SEMrush Site Audit**
- **Ahrefs Site Audit**
- **Website Grader** by HubSpot

---

### 5. Next.js Specific SEO Validation

Add a development tool to validate SEO on build:

Create `scripts/check-seo.js`:
```javascript
// Run this script to check SEO in development
const pages = ['/', '/student-register', '/teacher-register', '/pricing', '/faq', '/contact'];

// Check for:
// - Meta tags presence
// - Structured data validity
// - Missing alt texts
// etc.
```

---

### 6. Manual Checklist

**Quick SEO Checklist for Localhost:**

- [ ] Page titles are unique and descriptive (check in browser tab)
- [ ] Meta descriptions exist (view page source, look for `<meta name="description">`)
- [ ] H1 tag exists (only one per page)
- [ ] Heading hierarchy (H1 → H2 → H3) is logical
- [ ] Images have alt attributes
- [ ] Links have descriptive text (not just "click here")
- [ ] Canonical URLs are set
- [ ] Open Graph tags are present (for social sharing)
- [ ] Structured data (JSON-LD) is valid
- [ ] Mobile responsive (test different screen sizes)
- [ ] Page loads quickly
- [ ] No broken links
- [ ] Robots.txt exists (check `http://localhost:3000/robots.txt`)
- [ ] Sitemap exists (check `http://localhost:3000/sitemap.xml`)

---

### 7. Validate Structured Data

**Google Rich Results Test:**
- Go to: https://search.google.com/test/rich-results
- You can test with HTML source code from localhost
- Copy HTML source → Paste in tool → Test

**Schema.org Validator:**
- Go to: https://validator.schema.org/
- Test your structured data JSON-LD

---

### Quick Testing Commands

```bash
# 1. Start your dev server
npm run dev

# 2. In another terminal, run Lighthouse CLI
lighthouse http://localhost:3000 --only-categories=seo --output=html --output-path=./seo-report.html

# 3. Open the generated report
# Windows:
start seo-report.html
# Mac:
open seo-report.html
# Linux:
xdg-open seo-report.html
```

---

### Expected SEO Scores

**Good SEO Score:**
- 90-100: Excellent
- 80-89: Good
- 70-79: Needs improvement
- Below 70: Poor

---

### Common Issues to Fix

1. **Missing meta description** → Add in each page
2. **Missing alt text on images** → Add descriptive alt attributes
3. **No h1 tag** → Ensure each page has one H1
4. **Viewport not set** → Already fixed in _app.tsx
5. **Links without descriptive text** → Update link text
6. **Invalid structured data** → Validate JSON-LD

---

### Pro Tips

1. **Test all pages**: Check each route (/, /student-register, etc.)
2. **Test mobile version**: Mobile SEO is important
3. **Check console for errors**: JavaScript errors can affect SEO
4. **Validate HTML**: Use W3C Validator (can paste HTML)
5. **Speed matters**: Slow sites rank lower (check Performance in Lighthouse too)

---

### After Deployment

Once you deploy to production:
1. Submit sitemap to Google Search Console
2. Use Google Search Console for real SEO monitoring
3. Set up Google Analytics
4. Monitor search performance
5. Check Core Web Vitals

