"use client"
import Link from 'next/link';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-white">
        <div className="container mx-auto px-6 pt-8">
          <div className="text-3xl font-bold text-blue-600 text-center mb-8">CivicConnect</div>
        </div>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Report Local Issues, <span className="text-blue-600">Make Change Happen</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple and secure way to report community issues directly to the right authorities while maintaining your privacy.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center">
              <Link href="/report">
                Report an Issue
              </Link>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50">
              <Link href="/about"> {/* Link to About Us page */}
                Learn More
              </Link>
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16" data-aos="fade-up">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center" data-aos="fade-up">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Location-based Authority Finder</h3>
              <p className="text-gray-600">
                Automatically connects you with the relevant authorities based on your location or address.
              </p>
            </div>
            <div className="text-center" data-aos="fade-up">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Anonymous Reporting</h3>
              <p className="text-gray-600">
                Report issues without revealing your identity, ensuring your privacy and confidence.
              </p>
            </div>
            <div className="text-center" data-aos="fade-up">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Issue Tracking</h3>
              <p className="text-gray-600">
                Monitor the status of reported issues and track their resolution progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16" data-aos="fade-up">
            Making a Difference Together
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm" data-aos="fade-up">
              <h3 className="text-xl font-semibold mb-4">For Citizens</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Quick and easy issue reporting</li>
                <li>• Direct communication with authorities</li>
                <li>• Privacy protection</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm" data-aos="fade-up">
              <h3 className="text-xl font-semibold mb-4">For Authorities</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Streamlined issue management</li>
                <li>• Better resource allocation</li>
                <li>• Improved public communication</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm md:col-span-2 lg:col-span-1" data-aos="fade-up">
              <h3 className="text-xl font-semibold mb-4">For Community</h3>
              <ul className="space-y-3 text-gray-600">
                  <li>• Faster problem resolution</li>
                  <li>• Enhanced living standards</li>
                  <li>• Stronger civic engagement</li>
                </ul>
              </div>
            </div>
          </div>
        
        </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8" data-aos="fade-up">
            Ready to Make Your Community Better?
          </h2>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100">
            <Link href="/report">Start Reporting Issues</Link>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">CivicConnect</h3>
              <p className="text-sm">Making community improvement accessible to everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white">Facebook</Link></li>
                <li><Link href="#" className="hover:text-white">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>© 2025 CivicConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;