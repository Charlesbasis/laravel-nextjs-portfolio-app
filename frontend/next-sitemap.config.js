/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://app.cvhowlader.com',
  generateRobotsTxt: true, // Generate robots.txt automatically
  generateIndexSitemap: false,
  exclude: ['/dashboard*', '/onboarding*'], // Don't index private pages
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/onboarding', '/auth'],
      },
    ],
  },
};
