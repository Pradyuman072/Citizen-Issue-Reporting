"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLink = ({ href, children }) => {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        className={`
          relative px-3 py-2 rounded-md transition-all duration-300
          ${isActive 
            ? 'bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white'
            : 'hover:bg-gradient-to-r hover:from-blue-700 hover:via-indigo-600 hover:to-purple-700 hover:text-white'
          }
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="flex bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-2xl">CitizenFix</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/report">Report Issue</NavLink>
             
              <NavLink href="/about">About</NavLink>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>
          </div>

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

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink href="/report">Report Issue</NavLink>
            <NavLink href="/about">About</NavLink>
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