import { GetServerSideProps } from 'next';

function generateSiteMap() {
  const baseUrl = 'https://onehourstudy.com'; // Update with your actual domain
  
  const pages = [
    '', // Home
    'student-register',
    'teacher-register',
    'pricing',
    'faq',
    'contact',
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         const path = page === '' ? '' : `/${page}`;
         return `
       <url>
           <loc>${baseUrl}${path}</loc>
           <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>${page === '' ? '1.0' : '0.8'}</priority>
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
  // we write the XML to the response
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;

