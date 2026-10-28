import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../components/common/Logo';

export default function PublicLayout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#02060E] text-slate-100 flex flex-col antialiased selection:bg-royal-600 selection:text-white relative overflow-hidden">
      {/* Background ambient royal glow accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-royal-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[400px] bg-royal-900/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-30 h-20 bg-[#02060E]/75 backdrop-blur-xl border-b border-royal-600/15 px-6 sm:px-12 flex items-center justify-between">
        <Logo to="/" size="default" />

        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#early-warning" className="hover:text-white transition-colors">Early Warning</a>
            <a href="#student-360" className="hover:text-white transition-colors">Student 360°</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold tracking-wide inline-flex items-center gap-1.5"
          >
            <span>Get Started</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-royal-600/15 bg-[#02060E] py-10 px-6 sm:px-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="small" to="/" />
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Smart Student Management System</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-500">© 2026 STUDENTX Inc. Presentation Ready.</span>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

