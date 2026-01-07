
import { Metadata } from 'next';
import ContactForm from '@/src/components/forms/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.cvhowlader.com';

export const metadata: Metadata = {
  title: 'Contact Us - Portfolio Platform',
  description: 'Get in touch with Portfolio Platform. We\'re here to help you with any questions about creating and managing your professional portfolio.',
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${baseUrl}/contact`,
    title: 'Contact Us - Portfolio Platform',
    description: 'Get in touch with Portfolio Platform. We\'re here to help with any questions.',
    siteName: 'Portfolio Platform',
    images: [{
      url: `${baseUrl}/og-contact.jpg`,
      width: 1200,
      height: 630,
      alt: 'Contact Portfolio Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Portfolio Platform',
    description: 'Get in touch with Portfolio Platform. We\'re here to help with any questions.',
    images: [`${baseUrl}/og-contact.jpg`],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Portfolio Platform',
            description: 'Get in touch with our team',
            url: `${baseUrl}/contact`,
            mainEntity: {
              '@type': 'Organization',
              name: 'Portfolio Platform',
              url: baseUrl,
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                email: 'support@portfolioplatform.com',
                availableLanguage: ['English'],
              },
            },
          }),
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Mail className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">For general inquiries</p>
              <a
                href="mailto:support@portfolioplatform.com"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                support@portfolioplatform.com
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Phone className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Mon-Fri 9am-5pm EST</p>
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Our office</p>
              <p className="text-gray-700 font-medium">
                123 Portfolio Street<br />
                New York, NY 10001
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">How do I create a portfolio?</h3>
                <p className="text-gray-600">
                  Simply sign up, complete the onboarding process, and start adding your projects and skills. 
                  It takes less than 5 minutes!
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">Is it really free?</h3>
                <p className="text-gray-600">
                  Yes! Our basic portfolio features are completely free. We also offer premium features 
                  for advanced users.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">Can I customize my portfolio?</h3>
                <p className="text-gray-600">
                  Absolutely! You can customize colors, layouts, and content to match your personal brand 
                  and style.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">How do I share my portfolio?</h3>
                <p className="text-gray-600">
                  Each portfolio gets a unique URL (e.g., portfolioplatform.com/yourname) that you can 
                  share anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
