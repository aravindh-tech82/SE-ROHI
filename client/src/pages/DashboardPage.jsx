import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import FacultyDashboard from '../components/dashboard/FacultyDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import { Shield, Briefcase, GraduationCap, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Default to user's authentic role; allow seamless live preview switching for evaluation/demo
  const defaultRole = (user?.role || 'ADMIN').toUpperCase();
  const [activeRole, setActiveRole] = useState(defaultRole);

  return (
    <div className="space-y-6">
      {/* ================= ROLE PREVIEW SWITCHER (Presentation Toolbar) ================= */}
      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-royal-600/20 border border-royal-500/30 flex items-center justify-center text-royal-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white tracking-wide flex items-center gap-2">
              <span>ROLE PERSPECTIVE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-royal-500/15 text-royal-300 border border-royal-500/20 font-medium">
                Live Dynamic View
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              Authenticated as <strong className="text-slate-200">{user?.name || 'Administrator'}</strong> ({user?.role || 'ADMIN'})
            </p>
          </div>
        </div>

        {/* 3 Dedicated Role Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
          <button
            type="button"
            onClick={() => setActiveRole('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeRole === 'ADMIN'
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Command</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('FACULTY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeRole === 'FACULTY'
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty Workspace</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('STUDENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeRole === 'STUDENT'
                ? 'bg-royal-600 text-white shadow-md shadow-royal-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Space</span>
          </button>
        </div>
      </div>

      {/* ================= DEDICATED ROLE DASHBOARD VIEW ================= */}
      {activeRole === 'ADMIN' && <AdminDashboard />}
      {activeRole === 'FACULTY' && <FacultyDashboard />}
      {activeRole === 'STUDENT' && <StudentDashboard />}
    </div>
  );
}
