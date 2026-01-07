
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';

export const metadata: Metadata = {
  title: 'About Us - Portfolio Platform',
  description: 'Learn about Portfolio Platform, our mission to help professionals showcase their work, and how we make creating portfolios simple and effective.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${baseUrl}/about`,
    title: 'About Us - Portfolio Platform',
    description: 'Learn about Portfolio Platform and our mission to help professionals showcase their work.',
    siteName: 'Portfolio Platform',
    images: [{
      url: `${baseUrl}/og-about.jpg`,
      width: 1200,
      height: 630,
      alt: 'About Portfolio Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Portfolio Platform',
    description: 'Learn about Portfolio Platform and our mission to help professionals showcase their work.',
    images: [`${baseUrl}/og-about.jpg`],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Portfolio Platform',
            description: 'Learn about Portfolio Platform and our mission',
            url: `${baseUrl}/about`,
            mainEntity: {
              '@type': 'Organization',
              name: 'Portfolio Platform',
              url: baseUrl,
              description: 'Professional portfolio platform for showcasing your work',
            },
          }),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to help professionals showcase their work and build their personal brand
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Portfolio Platform was created to solve a simple problem: making it easy for professionals 
                to create beautiful, functional portfolios without needing technical expertise.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe everyone deserves a platform to showcase their work, share their story, 
                and connect with opportunities. Whether you're a developer, designer, writer, or creative 
                professional, we've got you covered.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy to Use</h3>
                    <p className="text-gray-600">No coding required. Build your portfolio in minutes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Beautiful Templates</h3>
                    <p className="text-gray-600">Professional designs that make you stand out.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mobile Responsive</h3>
                    <p className="text-gray-600">Looks great on all devices.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">SEO Optimized</h3>
                    <p className="text-gray-600">Get discovered by employers and clients.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals showcasing their work on Portfolio Platform
            </p>
            <a
              href="/auth/register"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105"
            >
              Create Your Portfolio
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
