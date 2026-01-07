
'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Mail, Star } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '../components/forms/ContactForm';
import {
  projectsService,
  servicesService,
  skillsService,
  testimonialsService,
} from '../services/api.service';

export default function HomePage() {
  // Fetch data with React Query
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => projectsService.getAll({ featured: true, per_page: 3 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills', 'all'],
    queryFn: () => skillsService.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials', 'all'],
    queryFn: testimonialsService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', 'all'],
    queryFn: servicesService.getAll,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="bg-blue-500 bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  👋 Welcome to our portfolio platform
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block">Build Your</span>
                <span className="block bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
                  Professional Portfolio
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Showcase your work, share your skills, and connect with opportunities. 
                Create your stunning portfolio in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  Learn More
                  <Mail className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="h-20 bg-blue-100 rounded-lg"></div>
                      <div className="h-20 bg-purple-100 rounded-lg"></div>
                      <div className="h-20 bg-pink-100 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">Everything you need to showcase your professional work</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Easy to Use',
                description: 'Create your portfolio in minutes with our intuitive interface. No coding required.',
              },
              {
                icon: '🎨',
                title: 'Beautiful Templates',
                description: 'Choose from professionally designed templates that make you stand out.',
              },
              {
                icon: '📱',
                title: 'Fully Responsive',
                description: 'Your portfolio looks perfect on all devices - desktop, tablet, and mobile.',
              },
              {
                icon: '🔍',
                title: 'SEO Optimized',
                description: 'Get discovered by employers and clients with built-in SEO optimization.',
              },
              {
                icon: '⚡',
                title: 'Fast Performance',
                description: 'Lightning-fast loading times ensure a great experience for your visitors.',
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Control who sees your portfolio with flexible privacy settings.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600">Join thousands of satisfied professionals</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                    &quot;{testimonial?.content}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial?.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial?.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Join thousands of professionals showcasing their work. 
            Create your free portfolio today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Free Portfolio
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
