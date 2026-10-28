import React from 'react';

export default function StatusBadge({ type = 'status', value, size = 'default' }) {
  if (!value) return null;

  const isSmall = size === 'small';
  const sizeClasses = isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  // Normalize
  const val = String(value).toUpperCase();

  // 1. Student Risk Badges
  if (type === 'risk' || val === 'STABLE' || val === 'NEEDS ATTENTION' || val === 'AT RISK') {
    if (val === 'STABLE') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Stable
        </span>
      );
    }
    if (val === 'NEEDS ATTENTION') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Needs Attention
        </span>
      );
    }
    if (val === 'AT RISK') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          At Risk
        </span>
      );
    }
  }

  // 2. Assignment Badges
  if (type === 'assignment' || ['PENDING', 'SUBMITTED', 'LATE', 'GRADED'].includes(val)) {
    switch (val) {
      case 'SUBMITTED':
        return <span className={`inline-flex items-center font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses}`}>Submitted</span>;
      case 'LATE':
        return <span className={`inline-flex items-center font-medium rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 ${sizeClasses}`}>Late</span>;
      case 'GRADED':
        return <span className={`inline-flex items-center font-medium rounded-md bg-royal-500/15 text-royal-300 border border-royal-500/30 ${sizeClasses}`}>Graded</span>;
      case 'PENDING':
      default:
        return <span className={`inline-flex items-center font-medium rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 ${sizeClasses}`}>Pending</span>;
    }
  }

  // 3. Priority Badges (Announcements)
  if (type === 'priority' || ['NORMAL', 'IMPORTANT', 'URGENT'].includes(val)) {
    switch (val) {
      case 'URGENT':
        return <span className={`inline-flex items-center font-semibold rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses}`}>Urgent</span>;
      case 'IMPORTANT':
        return <span className={`inline-flex items-center font-medium rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 ${sizeClasses}`}>Important</span>;
      case 'NORMAL':
      default:
        return <span className={`inline-flex items-center font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>Normal</span>;
    }
  }

  // 4. Role Badges
  if (type === 'role' || ['ADMIN', 'FACULTY', 'STUDENT'].includes(val)) {
    switch (val) {
      case 'ADMIN':
        return <span className={`inline-flex items-center font-medium rounded-md bg-royal-600/20 text-royal-300 border border-royal-500/30 ${sizeClasses}`}>Admin</span>;
      case 'FACULTY':
        return <span className={`inline-flex items-center font-medium rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/25 ${sizeClasses}`}>Faculty</span>;
      case 'STUDENT':
      default:
        return <span className={`inline-flex items-center font-medium rounded-md bg-slate-700/40 text-slate-300 border border-slate-600/30 ${sizeClasses}`}>Student</span>;
    }
  }

  // Fallback neutral
  return (
    <span className={`inline-flex items-center font-medium rounded-md bg-white/5 text-slate-300 border border-white/10 ${sizeClasses}`}>
      {value}
    </span>
  );
}

