import { GetServerSideProps } from 'next';

interface SitemapPage {
  path: string;
  priority: string;
  changefreq: string;
}

function generateSiteMap() {
  const baseUrl = 'https://onehourstudy.com';

  const pages: SitemapPage[] = [
    { path: '', priority: '1.0', changefreq: 'daily' }, // Home
    { path: 'student-register', priority: '0.9', changefreq: 'weekly' },
    { path: 'teacher-register', priority: '0.9', changefreq: 'weekly' },
    { path: 'pricing', priority: '0.8', changefreq: 'weekly' },
    { path: 'faq', priority: '0.8', changefreq: 'monthly' },
    { path: 'contact', priority: '0.8', changefreq: 'monthly' },
    { path: 'student-login', priority: '0.6', changefreq: 'monthly' },
    { path: 'teacher-login', priority: '0.6', changefreq: 'monthly' },
    { path: 'login', priority: '0.6', changefreq: 'monthly' },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     ${pages
      .map((page) => {
        const path = page.path === '' ? '' : `/${page.path}`;
        return `
       <url>
           <loc>${baseUrl}${path}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>${page.changefreq}</changefreq>
           <priority>${page.priority}</priority>
       </url>
     `;
      })
      .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  // Cache the sitemap for 24 hours
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  // we write the XML to the response
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;

