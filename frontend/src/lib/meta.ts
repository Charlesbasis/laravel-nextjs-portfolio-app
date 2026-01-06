import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';
const siteName = 'Portfolio Platform';
const defaultOgImage = '/og-default.jpg';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Build and showcase your professional portfolio',
  keywords: ['portfolio', 'developer', 'projects', 'professional'],
  authors: [{ name: siteName }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourhandle',
    creator: '@yourhandle',
  },
};

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string
): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image || defaultOgImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const pageMetadata = {
  home: generatePageMetadata(
    'Home - Build Your Professional Portfolio',
    'Create, manage, and showcase your professional portfolio with ease.',
    '/'
  ),
  
  about: generatePageMetadata(
    'About Us',
    'Learn more about our portfolio platform and mission.',
    '/about'
  ),
  
  contact: generatePageMetadata(
    'Contact Us',
    'Get in touch with us for inquiries and support.',
    '/contact'
  ),
  
  auth: {
    login: generatePageMetadata(
      'Login',
      'Sign in to your account to manage your portfolio.',
      '/auth/login'
    ),
    register: generatePageMetadata(
      'Create Account',
      'Join us and start building your professional portfolio today.',
      '/auth/register'
    ),
  },
};
