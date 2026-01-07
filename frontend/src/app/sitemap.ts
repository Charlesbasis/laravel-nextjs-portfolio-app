
import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate every hour

interface Portfolio {
  username: string;
  updated_at: string;
}

interface Project {
  slug: string;
  updated_at: string;
}

interface SitemapData {
  portfolios: Portfolio[];
  projects: Project[];
}

async function fetchSitemapData(): Promise<SitemapData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${apiUrl}/public/sitemap-data`, {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Sitemap fetch failed with status: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`Sitemap fetch error: ${error.message}`);
    }
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';
  const currentDate = new Date().toISOString();

  // Static pages with proper priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Skip dynamic content in CI/CD builds
  if (process.env.SKIP_SITEMAP_FETCH === 'true') {
    return staticPages;
  }

  const data = await fetchSitemapData();

  if (!data) {
    console.warn('⚠️ Sitemap: Using static routes only (API unavailable)');
    return staticPages;
  }

  // Portfolio pages
  const portfolioPages: MetadataRoute.Sitemap = (data.portfolios || []).map((user) => ({
    url: `${baseUrl}/portfolio/${user.username}`,
    lastModified: user.updated_at || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Project pages
  const projectPages: MetadataRoute.Sitemap = (data.projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updated_at || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const allPages = [...staticPages, ...portfolioPages, ...projectPages];

  console.log(`✅ Sitemap generated: ${allPages.length} URLs`);
  
  return allPages;
}
