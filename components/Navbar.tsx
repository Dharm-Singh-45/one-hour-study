'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logoutUser } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthenticated(isAuthenticated());
      setUser(getCurrentUser());
    }
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
  ];

  const authenticatedNavLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-primary/10 shadow-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-md hover:border-primary/20">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div className="max-w-container mx-auto flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gradient-primary hover:scale-105 transition-transform">
            <span className="fas fa-graduation-cap text-2xl text-primary" aria-hidden="true"></span>
            <span>OneHourStudy</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6">
            {!authenticated && navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    pathname === link.href
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/8'
                      : 'text-slate-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/8'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gradient-primary rounded-full"></span>
                  )}
                </Link>
              </li>
            ))}
            {authenticated ? (
              <>
                <li>
                  <Link
                    href={user?.type === 'student' ? '/student-dashboard' : '/teacher-dashboard'}
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      pathname === '/student-dashboard' || pathname === '/teacher-dashboard'
                        ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/8'
                        : 'text-slate-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/8'
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                {authenticatedNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        pathname === link.href
                          ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/8'
                          : 'text-slate-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/8'
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gradient-primary rounded-full"></span>
                      )}
                    </Link>
                  </li>
                ))}
                <li className="text-slate-700 px-2">
                  <span className="text-sm">Welcome, {user?.name}</span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg font-semibold text-slate-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/8 transition-all duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      pathname === '/login' || pathname === '/student-login' || pathname === '/teacher-login'
                        ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/8'
                        : 'text-slate-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/8'
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student-register"
                    className="px-4 py-2 rounded-lg font-semibold bg-gradient-primary text-white hover:shadow-colored transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-slate-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="md:hidden flex flex-col gap-4 py-4 border-t border-slate-200">
            {!authenticated && navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-semibold transition-all ${
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {authenticated ? (
              <>
                <li>
                  <Link
                    href={user?.type === 'student' ? '/student-dashboard' : '/teacher-dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg font-semibold transition-all ${
                      pathname === '/student-dashboard' || pathname === '/teacher-dashboard'
                        ? 'text-primary bg-primary/10'
                        : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                {authenticatedNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg font-semibold transition-all ${
                        pathname === link.href
                          ? 'text-primary bg-primary/10'
                          : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="px-4 py-2 text-slate-700 text-sm">
                  Welcome, {user?.name}
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg font-semibold transition-all ${
                      pathname === '/login' || pathname === '/student-login' || pathname === '/teacher-login'
                        ? 'text-primary bg-primary/10'
                        : 'text-slate-700 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/student-register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg font-semibold bg-gradient-primary text-white text-center"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

