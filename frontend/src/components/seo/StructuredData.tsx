
import { UserProfile, Project, Experience } from '@/src/types';

interface StructuredDataProps {
  profile: UserProfile;
  projects?: Project[];
  experiences?: Experience[];
}

export default function StructuredData({ profile, projects = [], experiences = [] }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';
  
  // Person Schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name,
    url: `${baseUrl}/portfolio/${profile.username}`,
    image: profile.avatar_url,
    jobTitle: profile.job_title,
    worksFor: profile.company ? {
      '@type': 'Organization',
      name: profile.company
    } : undefined,
    description: profile.bio,
    email: profile.show_email ? profile.email : undefined,
    telephone: profile.show_phone ? profile.phone : undefined,
    address: profile.location ? {
      '@type': 'PostalAddress',
      addressLocality: profile.location
    } : undefined,
    sameAs: [
      profile.linkedin_url,
      profile.github_url,
      profile.twitter_url,
      profile.website,
    ].filter(Boolean),
  };

  // ProfilePage Schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: profile.created_at,
    dateModified: profile.updated_at,
    mainEntity: {
      '@type': 'Person',
      name: profile.full_name,
      identifier: profile.username,
    }
  };

  // Work Experience Schema
  const workExperienceSchemas = experiences.map(exp => ({
    '@context': 'https://schema.org',
    '@type': 'EmployeeRole',
    roleName: exp.position,
    startDate: exp.start_date,
    endDate: exp.is_current ? undefined : exp.end_date,
    worksFor: {
      '@type': 'Organization',
      name: exp.company,
      url: exp.company_url,
    },
    description: exp.description,
    location: exp.location,
  }));

  // Creative Works (Projects) Schema
  const projectSchemas = projects.filter(p => p.status === 'published').map(project => ({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: project.live_url,
    image: project.image_url,
    author: {
      '@type': 'Person',
      name: profile.full_name,
    },
    dateCreated: project.created_at,
    keywords: project.technologies?.join(', '),
    ...(project.github_url && {
      codeRepository: project.github_url
    })
  }));

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Portfolio',
        item: `${baseUrl}/portfolio`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: profile.full_name,
        item: `${baseUrl}/portfolio/${profile.username}`,
      },
    ],
  };

  // Combine all schemas
  const allSchemas = [
    personSchema,
    profilePageSchema,
    breadcrumbSchema,
    ...workExperienceSchemas,
    ...projectSchemas,
  ];

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
