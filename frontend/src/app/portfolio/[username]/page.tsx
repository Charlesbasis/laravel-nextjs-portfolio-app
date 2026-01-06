'use client';

import {
  AlertCircle,
  Download,
  Loader2,
  Mail
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

// Components
import AboutSection from '@/src/components/portfolio/AboutSection';
import SkillsDisplay from '@/src/components/portfolio/SkillsDisplay';
import ProjectsGrid from '@/src/components/projects/ProjectsGrid';

// Hooks & Types
import { useProjects, useSkills } from '@/src/hooks/useApi';
import {
  usePublicCertifications, usePublicEducation,
  usePublicExperiences, usePublicProfile, useUserStats
} from '@/src/hooks/useProfile';
import { PortfolioPageProps, Project, Skill } from '@/src/types';
import EducationCertifications from '@/src/components/portfolio/EducationCertifications';
import ExperienceTimeline from '@/src/components/portfolio/ExperienceTimeline';

export default function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = use(params);
  
  // Queries
  const { data: profile, isLoading: profileLoading, isError: profileError } = usePublicProfile(username);
  const { data: stats, isLoading: statsLoading } = useUserStats(username);
  const { data: experiences, isLoading: experiencesLoading } = usePublicExperiences(username);
  const { data: education, isLoading: educationLoading } = usePublicEducation(username);
  const { data: certifications, isLoading: certificationsLoading } = usePublicCertifications(username);
  
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ user_id: profile?.user_id });

  const projects: Project[] = (projectsData as Project[]) || [];

  const { data: skillsData, isLoading: skillsLoading } = useSkills({ user_id: profile?.user_id });
  const skills = (skillsData as Skill[]) || [];

  // Loading State
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error States
  if (profileError || !profile) {
    return <NotFoundState username={username} />;
  }

  if (!profile.is_public) {
    return <PrivateState />;
  }

  // Helper for initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        {profile.cover_image_url && (
          <div className="absolute inset-0">
            <Image
              src={profile.cover_image_url}
              alt="Cover"
              fill
              className="object-cover opacity-30"
              priority // ✅ Professional SEO: Priority for LCP
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              {profile.avatar_url ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-2xl">
                  {getInitials(profile.full_name)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{profile.full_name}</h1>
              {profile.tagline && <p className="text-xl text-blue-100 mb-4">{profile.tagline}</p>}
              {/* ... Rest of social links / availability ... */}
            </div>
          </div>
        </div>
      </section>

      <AboutSection profile={profile} />
      
      <ProjectsGrid
        projects={projects} 
        isLoading={projectsLoading}
      />

      <SkillsDisplay 
        skills={skills} 
        isLoading={skillsLoading} 
      />

      <ExperienceTimeline
        experiences={experiences || []} 
        isLoading={experiencesLoading} 
      />

      {/* Education & Certifications */}
      <EducationCertifications
        education={education || []}
        certifications={certifications || []}
        isLoadingEducation={educationLoading}
        isLoadingCertifications={certificationsLoading}
      />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 text-blue-100">
            Have a project in mind? I'd love to hear about it and see how I can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 shadow-lg"
            >
              <Mail className="mr-2" size={20} />
              Get In Touch
            </a>
            <button className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105">
              <Download className="mr-2" size={20} />
              Download Resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-components for cleaner code
function NotFoundState({ username }: { username: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
            <p className="text-gray-600 mb-6">The portfolio for @{username} doesn&apos;t exist or is not public.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">Go to Homepage</Link>
          </div>
        </div>
    );
}

function PrivateState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Private Portfolio</h1>
            <p className="text-gray-600 mb-6">This portfolio is currently set to private.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">Go to Homepage</Link>
          </div>
        </div>
    );
}
