
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PortfolioClient from './PortfolioClient';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/profile`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return {
        title: 'Portfolio Not Found',
        description: 'The requested portfolio could not be found.',
      };
    }
    
    const { data: profile } = await response.json();
    
    const title = `${profile.full_name} - ${profile.job_title || 'Professional Portfolio'}`;
    const description = profile.tagline || profile.bio?.slice(0, 160) || `View ${profile.full_name}'s professional portfolio`;
    const imageUrl = profile.avatar_url || `${baseUrl}/og-default.jpg`;
    const url = `${baseUrl}/portfolio/${username}`;
    
    return {
      title,
      description,
      keywords: [
        profile.full_name,
        profile.job_title,
        profile.location,
        'portfolio',
        'professional',
        'projects',
        ...profile.tagline?.split(' ').filter((w: string) => w.length > 3) || []
      ].filter(Boolean),
      authors: [{ name: profile.full_name }],
      creator: profile.full_name,
      publisher: profile.full_name,
      
      // Open Graph
      openGraph: {
        type: 'profile',
        locale: 'en_US',
        url,
        title,
        description,
        siteName: 'Portfolio Platform',
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${profile.full_name}'s portfolio`,
        }],
        ...(profile.full_name && {
          profile: {
            firstName: profile.full_name.split(' ')[0],
            lastName: profile.full_name.split(' ').slice(1).join(' '),
            username: profile.username,
          }
        })
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        creator: profile.twitter_url ? `@${profile.twitter_url.split('/').pop()}` : undefined,
      },
      
      // Additional metadata
      alternates: {
        canonical: url,
      },
      robots: {
        index: profile.is_public,
        follow: profile.is_public,
        googleBot: {
          index: profile.is_public,
          follow: profile.is_public,
        }
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Portfolio',
      description: 'Professional portfolio showcase',
    };
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/profile`;
  
  try {
    const response = await fetch(apiUrl, { next: { revalidate: 300 } });
    if (!response.ok) notFound();

    const result = await response.json();
    const profileData = result.data ? result.data : result;

    return <PortfolioClient username={username} initialData={profileData} />;
    
  } catch (error) {
    notFound();
  }
}
