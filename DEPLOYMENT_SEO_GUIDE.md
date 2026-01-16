# Deployment & SEO Setup Guide for OneHourStudy

## Pre-Deployment Checklist

Before deploying your website, ensure you have:

- [ ] Created all SEO assets (og-image.jpg, logo.png, favicon.ico)
- [ ] Uploaded assets to `/public/` directory
- [ ] Tested the website locally (`npm run dev`)
- [ ] Fixed any console errors
- [ ] Verified all forms work correctly
- [ ] Run production build (`npm run build`)

---

## Step 1: Deploy Your Website

### Option A: Deploy to Vercel (Recommended for Next.js)

**Why Vercel?**
- Built by Next.js creators
- Automatic optimization
- Easy deployment
- Free tier available

**Steps:**

1. **Create Vercel Account**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub (recommended)

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Project**
   - Leave default settings
   - Add environment variables if needed (from `.env.local`)
   - Click "Deploy"

4. **Custom Domain**
   - Go to Project Settings → Domains
   - Add `onehourstudy.com`
   - Follow DNS configuration instructions
   - Add www.onehourstudy.com as well

**Domain Setup:**
Point your domain's DNS to Vercel:
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

Wait 24-48 hours for DNS propagation.

---

### Option B: Deploy to Netlify

1. Go to https://netlify.com
2. "Add new site" → "Import from Git"
3. Connect GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy"

---

## Step 2: Google Search Console Setup

**Google Search Console** is essential for SEO monitoring.

### 2.1 Verify Ownership

1. **Go to Search Console**
   - Visit: https://search.google.com/search-console
   - Sign in with Google account

2. **Add Property**
   - Click "Add Property"
   - Choose "Domain" (recommended)
   - Enter: `onehourstudy.com`

3. **Verify Ownership**
   
   **Method 1: DNS Verification (Recommended)**
   - Copy TXT record provided by Google
   - Add to your domain DNS settings
   - Wait 5-10 minutes
   - Click "Verify"

   **Method 2: HTML File Upload**
   - Download HTML file from Google
   - Add to `/public/` folder in your project
   - Redeploy
   - Click "Verify"

### 2.2 Submit Sitemap

1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `https://onehourstudy.com/sitemap.xml`
3. Click "Submit"

**Sitemap Status:**
- **Success**: Sitemap discovered
- **Couldn't fetch**: Check URL is accessible
- **Has errors**: Validate sitemap first

### 2.3 Request Indexing

For immediate indexing of important pages:

1. Go to **URL Inspection** tool
2. Enter URL: `https://onehourstudy.com`
3. Click "Request Indexing"
4. Repeat for all key pages:
   - `/student-register`
   - `/teacher-register`
   - `/pricing`
   - `/faq`
   - `/contact`

---

## Step 3: Google Analytics Setup

Track your website traffic and user behavior.

### 3.1 Create Analytics Account

1. Go to: https://analytics.google.com
2. Click "Start measuring"
3. Create Account:
   - Account name: "OneHourStudy"
   - Property name: "OneHourStudy Website"
   - Time zone: Asia/Kolkata
   - Currency: INR (₹)

4. Choose "Web" platform
5. Enter website URL: `https://onehourstudy.com`
6. Create stream

### 3.2 Get Tracking ID

1. Copy your **Measurement ID** (format: G-XXXXXXXXXX)
2. Keep this for the next step

### 3.3 Add to Website

Create file: `/lib/analytics.ts`

```typescript
// Google Analytics
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your ID

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

Update `/pages/_app.tsx`:

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '@/lib/analytics';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Rest of your app */}
    </>
  );
}
```

Update `/pages/_document.tsx`:

```typescript
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';

// Add in <Head>:
<>
  <Script
    strategy="afterInteractive"
    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
  />
  <Script
    id="google-analytics"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
    }}
  />
</>
```

---

## Step 4: Google My Business (Local SEO)

**Critical for local tutoring business!**

### 4.1 Create Google Business Profile

1. Go to: https://www.google.com/business/
2. Click "Manage now"
3. Enter business name: "OneHourStudy"

4. **Business Category:**
   - Primary: "Tutoring Service"
   - Additional: "Education Center", "Private Tutor"

5. **Location:**
   - Choose "I deliver goods and services to my customers"
   - Service areas: Jodhpur, Rajasthan
   - Or add physical address if you have an office

6. **Contact Info:**
   - Phone: +91 9462686862
   - Website: https://onehourstudy.com

7. **Business Description:**
```
OneHourStudy offers professional home tutoring services in Jodhpur, Rajasthan. We connect students (Class 1-12) with experienced, verified tutors for all subjects including Math, Science, English, and more. Specializing in CBSE, RBSE, and ICSE board exam preparation. Affordable rates, flexible timings, and personalized one-on-one teaching at your doorstep.
```

8. **Verify Business:**
   - Postcard (if physical address)
   - Phone verification
   - Email verification

### 4.2 Optimize Profile

- **Add Photos:** 
  - Logo
  - Tutoring sessions (stock photos OK)
  - Happy students
  - Certified tutors

- **Add Posts** (weekly):
  - Tips for students
  - Success stories
  - Special offers

- **Collect Reviews:**
  - Ask satisfied students for reviews
  - Respond to all reviews

### 4.3 Link to Search Console

1. In Google Business Profile settings
2. Verify website ownership
3. Link to Search Console property

---

## Step 5: Monitor & Optimize

### Week 1: Initial Check

- [ ] Verify site is accessible at `https://onehourstudy.com`
- [ ] Check Search Console for indexing status
- [ ] Test social sharing (Facebook, Twitter, WhatsApp)
- [ ] Verify OG images display correctly
- [ ] Check mobile responsiveness

### Week 2-4: Monitoring

**Google Search Console:**
- Check "Coverage" report for errors
- Monitor "Performance" for impressions/clicks
- Fix any crawl errors

**Google Analytics:**
- Track page views
- Monitor bounce rate
- Check traffic sources
- Analyze user behavior

### Monthly Tasks

1. **Content Updates:**
   - Add new blog posts (if you create blog)
   - Update testimonials
   - Refresh pricing if needed

2. **SEO Monitoring:**
   - Check keyword rankings
   - Monitor backlinks
   - Review competitors

3. **Performance:**
   - Run Lighthouse audit
   - Check page speed
   - Fix any issues

---

## Step 6: Local Citations

Build local SEO by listing on directories:

### Free Listings

1. **Google My Business** (done above)
2. **Bing Places**: https://www.bingplaces.com
3. **Justdial**: https://www.justdial.com (search "tutors Jodhpur")
4. **Sulekha**: https://www.sulekha.com
5. **UrbanPro**: https://www.urbanpro.com
6. **IndiaMART** (for business)

### Ensure NAP Consistency

**NAP = Name, Address, Phone**

Use exact same information everywhere:
```
Name: OneHourStudy
Address: Jodhpur, Rajasthan, India
Phone: +91 9462686862
Website: https://onehourstudy.com
Email: onehourstudy@gmail.com
```

---

## Step 7: Social Media Setup

Create profiles on:

1. **Facebook Page**: https://www.facebook.com/pages/create
   - Category: Education
   - Add all business info
   - Post regularly

2. **Instagram Business**: https://www.instagram.com
   - Educational content
   - Student success stories
   - Study tips

3. **LinkedIn**: https://www.linkedin.com
   - For teacher recruitment
   - Professional networking

4. **YouTube Channel** (Future):
   - Study tips videos
   - Subject tutorials
   - Success stories

**Link back to website from all profiles!**

---

## Troubleshooting

### Site Not Indexing?

1. Check `robots.txt`: https://onehourstudy.com/robots.txt
2. Ensure "Allow: /" is present
3. Verify sitemap is accessible
4. Request indexing manually in Search Console

### OG Images Not Showing?

1. Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
2. Click "Scrape Again"
3. Check image is accessible: https://onehourstudy.com/og-image.jpg
4. Verify image size is correct (1200x630px)

### Analytics Not Working?

1. Check Tracking ID is correct
2. Test with Google Analytics Debugger extension
3. Wait 24-48 hours for data to appear
4. Check in "Realtime" reports first

---

## Success Metrics (After 3 Months)

Track these KPIs:

### SEO Metrics:
- **Lighthouse SEO Score**: 95-100
- **Indexed Pages**: 8-9 pages
- **Average Position**: Top 20 for target keywords
- **Organic Traffic**: Growing month-over-month

### Business Metrics:
- New student registrations
- Teacher sign-ups
- Contact form submissions
- Phone call tracking

### Local SEO:
- Google My Business views
- Direction requests
- Phone call clicks
- Review count

---

## Next Steps After Deployment

1. **Week 1**: Monitor indexing and fix errors
2. **Week 2**: Start building backlinks (guest posts, directories)
3. **Month 1**: Analyze first month data
4. **Month 2**: Content marketing strategy
5. **Month 3**: Evaluate and optimize

---

## Support Resources

- **Google Search Console Help**: https://support.google.com/webmasters
- **Google Analytics Help**: https://support.google.com/analytics
- **Vercel Support**: https://vercel.com/support
- **Next.js Docs**: https://nextjs.org/docs

---

## Need Help?

If you need assistance with deployment or SEO:

1. Check documentation first
2. Search StackOverflow
3. Join web development communities
4. Consider hiring SEO expert for advanced optimization

**Good luck with your launch! 🚀**
