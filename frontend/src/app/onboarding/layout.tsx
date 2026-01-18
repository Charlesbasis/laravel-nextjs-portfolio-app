import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding | Portfolio Platform',
  description: 'Complete your profile to get started.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
