import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import { useNotification } from '../context/NotificationContext';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success } = useNotification();

  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetDone, setResetDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Reset token is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      setSubmitting(false);
      setResetDone(true);
      success('Password reset successfully. You can now log in.');
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-md mx-auto w-full">
      <GlassCard className="p-8 sm:p-10 w-full" glow>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">Establish New Password</h3>
          <p className="text-xs text-slate-400 mt-1">
            {emailFromUrl ? `Reset password for ${emailFromUrl}` : 'Enter your reset token and new credentials'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {resetDone ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-emerald-300 font-medium">
              Your password has been changed successfully.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full py-2.5 rounded-lg text-xs font-semibold mt-2"
            >
              Sign In with New Password
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!tokenFromUrl && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Reset Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token received in email"
                  className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
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
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save Password</span>
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

