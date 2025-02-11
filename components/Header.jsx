"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl">CitizenFix</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/report" className="hover:bg-blue-700 px-3 py-2 rounded-md transition duration-300">
                Report Issue
              </Link>
              {/* <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md transition duration-300">
                Dashboard
              </Link> */}
              <Link href="/about" className="hover:bg-blue-700 px-3 py-2 rounded-md transition duration-300">
                About
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none transition duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/report" 
              className="hover:bg-blue-700 block px-3 py-2 rounded-md transition duration-300"
              onClick={toggleMenu}
            >
              Report Issue
            </Link>
            <Link 
              href="/dashboard" 
              className="hover:bg-blue-700 block px-3 py-2 rounded-md transition duration-300"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link 
              href="/about" 
              className="hover:bg-blue-700 block px-3 py-2 rounded-md transition duration-300"
              onClick={toggleMenu}
            >
              About
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;