import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devNote, setDevNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please specify an email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitting(false);
      setSubmitted(true);
      if (res.data.devNote) {
        setDevNote(res.data.devNote);
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Failed to dispatch reset email.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-md mx-auto w-full">
      <GlassCard className="p-8 sm:p-10 w-full" glow>
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">Forgot Password</h3>
          <p className="text-xs text-slate-400 mt-1">We will send reset instructions to your verified email</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-emerald-300 font-medium leading-relaxed">
              Password reset link has been dispatched to <strong>{email}</strong>.
            </p>
            {devNote && (
              <p className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg font-mono">
                💡 {devNote}
              </p>
            )}
            <Link
              to="/login"
              className="btn-secondary w-full py-2 rounded-lg text-xs font-medium inline-block mt-2"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Registered Email</label>
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

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Dispatching Email...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}

