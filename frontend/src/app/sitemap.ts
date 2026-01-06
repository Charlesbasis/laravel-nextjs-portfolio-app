import { MetadataRoute } from 'next';
import api from '@/src/lib/api';

export const revalidate = 3600; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  if (process.env.SKIP_SITEMAP_FETCH === 'true') return staticPages;

  try {
    const response = await api.get('/public/sitemap-data', { timeout: 8000 });
    const data = response?.data?.data;
    
    if (!data) return staticPages;

    const portfolioPages: MetadataRoute.Sitemap = (data.portfolios || []).map((user: any) => ({
      url: `${baseUrl}/portfolio/${user.username}`,
      lastModified: new Date(user.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    const projectPages: MetadataRoute.Sitemap = (data.projects || []).map((project: any) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...portfolioPages, ...projectPages];
  } catch (error) {
    // Only warn in development to keep build logs clean
    if (process.env.NODE_ENV === 'development') {
        console.warn('Sitemap fetch failed: using static routes.');
    }
    return staticPages;
  }
}
