
import { Metadata } from 'next';
import HomePage from './HomePage';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';

export const metadata: Metadata = {
  title: 'Portfolio Platform - Showcase Your Professional Work',
  description: 'Build and showcase your professional portfolio. Share your projects, skills, and experience with the world. Create your free portfolio today.',
  keywords: [
    'portfolio',
    'developer portfolio',
    'designer portfolio',
    'professional showcase',
    'projects',
    'skills',
    'web development',
    'creative portfolio',
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'Portfolio Platform - Showcase Your Professional Work',
    description: 'Build and showcase your professional portfolio. Share your projects, skills, and experience with the world.',
    siteName: 'Portfolio Platform',
    images: [{
      url: `${baseUrl}/og-home.jpg`,
      width: 1200,
      height: 630,
      alt: 'Portfolio Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Platform - Showcase Your Professional Work',
    description: 'Build and showcase your professional portfolio. Share your projects, skills, and experience with the world.',
    images: [`${baseUrl}/og-home.jpg`],
  },
};

export default function Page() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Portfolio Platform',
            url: baseUrl,
            description: 'Professional portfolio platform for developers, designers, and creatives',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Portfolio Platform',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            description: 'Professional portfolio platform',
            sameAs: [
              'https://twitter.com/portfolioplatform',
              'https://github.com/portfolioplatform',
              'https://linkedin.com/company/portfolioplatform',
            ],
          }),
        }}
      />
      <HomePage />
    </>
  );
}
