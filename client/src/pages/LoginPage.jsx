import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Logo from '../components/common/Logo';
import GlassCard from '../components/common/GlassCard';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Handle Google OAuth return callback parameter
  useEffect(() => {
    const oauthToken = searchParams.get('oauth_token');
    const oauthError = searchParams.get('error');

    if (oauthToken) {
      loginWithGoogle(oauthToken);
      navigate('/dashboard', { replace: true });
    } else if (oauthError) {
      showError(decodeURIComponent(oauthError));
    }
  }, [searchParams, loginWithGoogle, navigate, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setFormError(res.message);
    }
  };

  const handleGoogleSignIn = () => {
    // Directs to backend Google OAuth initiation
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // Quick Demo account prefill
  const prefillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@studentx.edu');
      setPassword('Admin@123');
    } else if (role === 'faculty') {
      setEmail('faculty.rajesh@studentx.edu');
      setPassword('Faculty@123');
    } else if (role === 'student') {
      setEmail('student.arun@studentx.edu');
      setPassword('Student@123');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Branding & Highlights */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-600/15 border border-royal-500/30 text-royal-300 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to STUDENTX</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Academic management, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-400 to-[#C084FC]">
              elevated to elegance.
            </span>
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            Sign in to access your student 360° analytics, automated early warning metrics, intelligent timetable coordination, and grading dashboards.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-royal-400 shrink-0" />
              <span>Role-Based Access Control (Admin, Faculty, Student)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Secure JWT and official Google OAuth 2.0 support</span>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-6 border-t border-white/5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Instant Demo Sign In</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => prefillDemo('admin')}
                className="px-3 py-1.5 rounded-lg bg-royal-950/60 hover:bg-royal-900 border border-royal-600/30 text-royal-300 text-xs font-medium transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => prefillDemo('faculty')}
                className="px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900 border border-sky-600/30 text-sky-300 text-xs font-medium transition-colors"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => prefillDemo('student')}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/30 text-emerald-300 text-xs font-medium transition-colors"
              >
                Student
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Glass Card */}
        <GlassCard className="p-8 sm:p-10 w-full max-w-md mx-auto" glow>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Sign In</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your academic credentials to proceed</p>
          </div>

          {formError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studentx.edu"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-royal-400 hover:text-royal-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#070D19] px-3 text-[11px] text-slate-400">or continue with</span>
          </div>

          {/* Official Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-royal-500/30 text-xs font-medium text-slate-200 flex items-center justify-center gap-3 transition-all"
          >
            {/* Standard Google Multi-color Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-royal-400 hover:text-royal-300 font-semibold transition-colors">
              Create Account
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

