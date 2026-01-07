
export const seoConfig = {
  site: {
    name: 'Portfolio Platform',
    description: 'Professional portfolio platform for developers, designers, and creatives',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com',
    locale: 'en_US',
    author: 'Portfolio Platform Team',
  },
  
  defaults: {
    title: 'Portfolio Platform - Showcase Your Work',
    description: 'Build and showcase your professional portfolio. Share your projects, skills, and experience with the world.',
    keywords: [
      'portfolio',
      'developer portfolio',
      'designer portfolio',
      'professional showcase',
      'projects',
      'skills',
    ],
    ogImage: '/og-default.jpg',
    twitterHandle: '@portfolioplatform',
  },
  
  robots: {
    public: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    private: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  },
};

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text for meta descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words
  
  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate Open Graph image URL
 */
export function generateOgImageUrl(params: {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}): string {
  const baseUrl = seoConfig.site.url;
  
  // If using an OG image generation service (like Vercel OG)
  const searchParams = new URLSearchParams({
    title: params.title,
    ...(params.subtitle && { subtitle: params.subtitle }),
    ...(params.imageUrl && { image: params.imageUrl }),
  });
  
  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

/**
 * Validate and normalize URL
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = seoConfig.site.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: generateCanonicalUrl(item.path),
    })),
  };
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname !== new URL(seoConfig.site.url).hostname;
  } catch {
    return false;
  }
}

/**
 * Get relative URL for internal links
 */
export function getRelativeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch {
    return url;
  }
}

/**
 * Priority calculation for sitemap
 */
export function calculateSitemapPriority(params: {
  isHomepage?: boolean;
  isProfile?: boolean;
  isProject?: boolean;
  isFeatured?: boolean;
  pageViews?: number;
}): number {
  if (params.isHomepage) return 1.0;
  if (params.isProfile && params.isFeatured) return 0.95;
  if (params.isProfile) return 0.9;
  if (params.isProject && params.isFeatured) return 0.8;
  if (params.isProject) return 0.7;
  
  // Calculate based on views
  if (params.pageViews) {
    if (params.pageViews > 1000) return 0.9;
    if (params.pageViews > 500) return 0.8;
    if (params.pageViews > 100) return 0.7;
  }
  
  return 0.5;
}

/**
 * Change frequency for sitemap
 */
export function getChangeFrequency(lastUpdated: Date): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceUpdate < 1) return 'daily';
  if (daysSinceUpdate < 7) return 'weekly';
  if (daysSinceUpdate < 30) return 'monthly';
  return 'yearly';
}
