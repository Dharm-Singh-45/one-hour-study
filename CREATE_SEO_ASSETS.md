# Creating SEO Assets for OneHourStudy

## Required Assets

You need to create the following assets for optimal SEO and social sharing:

### 1. Open Graph Image (`og-image.jpg`)

**Specifications:**
- Size: 1200x630 pixels
- Format: JPG or PNG
- File size: Under 300KB for faster loading

**Content:**
- Large, bold "OneHourStudy" branding
- Subtitle: "Find Best Home Tutors in Jodhpur"
- Include: Icons for education (graduation cap, books, etc.)
- Location badge: "Jodhpur, Rajasthan"
- Text: "Class 1-12 | All Subjects | CBSE/RBSE/ICSE"
- Use your brand colors (purple/blue gradient recommended)

**Where to create:**
- Use Canva (free): https://www.canva.com/create/open-graph/
- Use Figma: Create 1200x630px frame
- Hire designer on Fiverr (search "Open Graph image")

**File location:** Save as `/public/og-image.jpg`

---

### 2. Logo (`logo.png`)

**Specifications:**
- Size: 512x512 pixels (square)
- Format: PNG with transparent background
- File size: Under 100KB

**Content:**
- Your brand logo/icon
- Should work at small sizes (will be used as favicon too)
- Clean, simple, recognizable
- Consider: Graduation cap + clock showing "1 hour"

**File location:** Save as `/public/logo.png`

---

### 3. Favicon (`favicon.ico`)

**Specifications:**
- Multiple sizes: 16x16, 32x32, 48x48 pixels
- Format: .ico file

**How to create:**
1. Use your logo.png
2. Convert at: https://www.favicon-generator.org/
3. This will generate favicon.ico and various sizes

**File location:** Save as `/public/favicon.ico`

---

### 4. Apple Touch Icons

**Specifications:**
- Sizes: 180x180, 152x152, 120x120, 76x76 pixels
- Format: PNG

**How to create:**
1. Use logo.png as base
2. Resize to each size
3. Use tool: https://realfavicongenerator.net/

**File locations:**
- `/public/apple-touch-icon.png` (180x180)
- `/public/apple-touch-icon-152x152.png`
- `/public/apple-touch-icon-120x120.png`
- `/public/apple-touch-icon-76x76.png`

---

## Quick Creation Guide

### Option 1: Use Canva (Recommended for beginners)

1. Go to https://www.canva.com
2. Create account (free)
3. Search templates:
   - "Open Graph" for og-image.jpg
   - "Logo" for logo.png
4. Customize with your branding
5. Download and add to `/public/` folder

### Option 2: Use Figma (For designers)

1. Create frames with exact dimensions
2. Design your assets
3. Export as PNG/JPG
4. Add to `/public/` folder

### Option 3: Hire a Designer

**Fiverr/Upwork brief:**
```
Need 4 SEO assets for tutoring website "OneHourStudy":

1. Open Graph image (1200x630px)
   - Text: "OneHourStudy - Find Best Home Tutors in Jodhpur"
   - Include: Education icons, "Class 1-12 | All Subjects"
   - Colors: Purple/blue gradient

2. Logo (512x512px PNG transparent)
   - Simple, recognizable logo
   - Theme: Education + 1 hour concept

3. Favicon (16x16 to 48x48, .ico format)
   - From logo

4. Apple touch icons (various sizes)
   - From logo

Brand: Educational tutoring platform in Jodhpur, India
Style: Modern, professional, trustworthy
```

---

## After Creating Assets

1. Save all files to `/public/` directory:
   ```
   /public/
   ├── og-image.jpg
   ├── logo.png
   ├── favicon.ico
   ├── apple-touch-icon.png
   └── apple-touch-icon-*.png
   ```

2. Update `pages/_document.tsx` with favicon links (already done in implementation)

3. Verify images:
   - Open `http://localhost:3000/og-image.jpg` - should display
   - Share any page on Facebook/Twitter - should show OG image
   - Check favicon appears in browser tab

---

## Testing

### Test Open Graph Image:
1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
   - Enter: https://onehourstudy.com
   - Click "Scrape Again"
   - Verify image appears

2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Enter your URL
   - Verify image displays

3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
   - Enter your URL
   - Check preview

---

## Temporary Placeholders

While creating professional assets, you can use these temporary solutions:

### Placeholder OG Image:
Create a simple 1200x630px image with:
- Solid color background (#6366f1 - purple)
- White text: "OneHourStudy"
- Subtitle: "Best Home Tutors in Jodhpur"

### Placeholder Logo:
Use a text-based logo:
- 512x512px
- Purple background
- White text: "OHS" or "1H"

---

## Budget Options

- **DIY with Canva**: Free
- **Fiverr**: $5-25 for all assets
- **Professional designer**: $50-200 for complete brand package

Choose based on your budget and design skills!
