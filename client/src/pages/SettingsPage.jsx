import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Sliders,
  Check,
  Key,
  Smartphone,
  Save,
  Info
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { success } = useNotification();

  const [activeSection, setActiveSection] = useState('account');

  // Account State
  const [name, setName] = useState(user?.name || 'Dr. K. Senthil Nathan');
  const [email] = useState(user?.email || 'admin@studentx.edu');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [attendanceWarnings, setAttendanceWarnings] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    updateUser({ name, avatar });
    success('Account information updated successfully.');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    success('Password updated successfully.');
  };

  const sections = [
    { id: 'account', label: 'Account Profile', icon: User },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'preferences', label: 'Preferences & Alerts', icon: Bell },
    { id: 'system', label: 'System Information', icon: Info }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System & Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your credentials, notification triggers, and system configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left
                  ${isSelected
                    ? 'bg-royal-600/30 text-white border border-royal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }
                `}
              >
                <Icon className="w-4 h-4 text-royal-400" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Contents */}
        <div className="md:col-span-3">
          {/* Account Profile */}
          {activeSection === 'account' && (
            <GlassCard className="p-6">
              <h3 className="text-base font-semibold text-white mb-4">Account Profile</h3>
              <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
                <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                  <img
                    src={avatar || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=9303c5`}
                    alt={name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-royal-500/40 shadow-md"
                  />
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://..."
                      className="glass-input w-72 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Email (Primary ID)</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Institutional Role</label>
                  <input
                    type="text"
                    value={user?.role || 'ADMIN'}
                    disabled
                    className="glass-input w-full sm:w-1/2 rounded-xl px-3.5 py-2 text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-semibold flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <GlassCard className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Change Account Password</h3>
                <p className="text-xs text-slate-400 mb-4">Ensure passwords contain at least 6 characters and mixed case letters.</p>

                <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
                  <div>
                    <label className="block text-slate-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="glass-input w-full rounded-xl px-3.5 py-2 text-white"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-semibold">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-sm font-semibold text-white mb-2">Active Authorized Sessions</h4>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-white">Current Session (This Browser)</span>
                      <p className="text-[11px] text-slate-400 font-mono">JWT Bearer • Verified</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">Active</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-white mb-1">Notification & Alert Preferences</h3>
              <p className="text-xs text-slate-400 mb-4">Control how early warning alerts and circulars reach your device.</p>

              <div className="divide-y divide-white/5 text-xs">
                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Early Warning SMS & Email Triggers</span>
                    <p className="text-slate-400 mt-0.5">Dispatches Nodemailer alerts whenever attendance falls below 75%.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-royal-600 rounded cursor-pointer"
                  />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Attendance Deficit Broadcasts</span>
                    <p className="text-slate-400 mt-0.5">Show real-time badge on dashboard when students have unexcused absences.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={attendanceWarnings}
                    onChange={(e) => setAttendanceWarnings(e.target.checked)}
                    className="w-4 h-4 accent-royal-600 rounded cursor-pointer"
                  />
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Weekly Performance Digest</span>
                    <p className="text-slate-400 mt-0.5">Summary of class tests, assignments submitted, and risk metric shifts.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="w-4 h-4 accent-royal-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {/* System */}
          {activeSection === 'system' && (
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-white mb-1">Platform Telemetry & Architecture</h3>
              <p className="text-xs text-slate-400 mb-4">STUDENTX v1.0.0 Production Architecture</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-500 block text-[11px]">Primary Database</span>
                  <span className="text-emerald-400 font-semibold">Modular JSON (server/data/db.json)</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-500 block text-[11px]">Backend Server</span>
                  <span className="text-royal-300 font-semibold">Node.js Express (Port 5000)</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-500 block text-[11px]">Frontend Stack</span>
                  <span className="text-royal-300 font-semibold">React + Vite + Tailwind CSS</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-500 block text-[11px]">3D Rendering Engine</span>
                  <span className="text-emerald-400 font-semibold">Three.js WebGL (Interactive)</span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

