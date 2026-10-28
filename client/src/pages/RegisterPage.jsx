import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'CSE Cyber Security',
    password: '',
    confirmPassword: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const res = await register(formData);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setFormError(res.message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full">
      <GlassCard className="p-8 sm:p-10 w-full max-w-xl mx-auto" glow>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white tracking-tight">Create an Account</h3>
          <p className="text-xs text-slate-400 mt-1">Register for STUDENTX academic workspace</p>
        </div>

        {formError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aravindh S"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@studentx.edu"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="glass-input w-full rounded-xl px-3.5 py-2.5 text-xs text-white bg-[#070D19]"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white bg-[#070D19]"
                >
                  <option value="CSE Cyber Security">CSE Cyber Security</option>
                  <option value="CSE AI & ML">CSE AI & ML</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="glass-input w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {submitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-royal-400 hover:text-royal-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

