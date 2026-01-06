'use server';

import { ArrowRight, Mail, Star } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '../components/forms/ContactForm';
import {
  projectsService,
  servicesService,
  skillsService,
  testimonialsService,
} from '../services/api.service';
import { Skill } from '../types';

export default async function Home() {
  const results = await Promise.allSettled([
    projectsService.getAll({ featured: true, per_page: 3 }),
    skillsService.getAll(),
    testimonialsService.getAll(),
    servicesService.getAll(),
  ]);

  // const featuredProjects = results[0].status === 'fulfilled' ? results[0].value : [];
  // const skills = (results[1].status === 'fulfilled' ? results[1].value : []) as Skill[];
  const testimonials = results[2].status === 'fulfilled' ? results[2].value : [];
  // const services = results[3].status === 'fulfilled' ? results[3].value : [];

  const isDevelopment = process.env.NODE_ENV !== 'production';
  if (isDevelopment) {
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const names = ['Projects', 'Skills', 'Testimonials', 'Services'];
        console.error(`Failed to fetch ${names[index]}:`, result.reason);
      }
    });
  }
  
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
                  👋 Welcome to my portfolio
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block">Full Stack</span>
                <span className="block bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
                  Web Developer
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Crafting modern, scalable web applications with cutting-edge technologies. 
                Transforming ideas into powerful digital solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  View My Work
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  Get in Touch
                  <Mail className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            {/* ... Rest of hero unchanged ... */}
          </div>
        </div>
      </section>

      {/* Testimonials - Fixed unescaped entities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Clients Say</h2>
            <p className="text-xl text-gray-600">Testimonials from satisfied clients</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials?.map((testimonial, index) => (
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

      {/* CTA Section - Fixed unescaped entities */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Let&apos;s collaborate and create something amazing together. 
            I&apos;m available for freelance projects and consultations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Get In Touch
              <Mail className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Fixed unescaped entities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Me</h2>
            <p className="text-xl text-gray-600">
              Let&apos;s work together and create something amazing
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
