import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  GraduationCap,
  Sparkles,
  BarChart3,
  CalendarCheck,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Compass
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import Hero3DLogo from '../components/3d/Hero3DLogo';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* ================= HERO SECTION WITH 3D FLOATING ELEMENT ================= */}
      <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Release Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-royal-600/15 border border-royal-500/30 text-royal-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-royal-400" />
              <span>Next-Generation Academic Intelligence</span>
            </div>

            {/* Product Title & Tagline */}
            <div className="space-y-2">
              <span className="text-sm font-bold tracking-widest text-royal-400 uppercase font-mono block">
                STUDENTX
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                Smart Student <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-400 via-[#C084FC] to-white">
                  Management System
                </span>
              </h1>
            </div>

            {/* Subtitle: Manage. Monitor. Improve. */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Manage. Monitor. Improve. Institutional command telemetries, faculty workspaces, and student academic dossiers — unified within one intelligent platform.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-royal-950/60"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="btn-secondary w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-royal-400" />
                <span>Explore Platform</span>
              </a>
            </div>

            {/* Subtle metrics pill row */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>3D Command Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-royal-400" />
                <span>Early Warning Audits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>StudentAI Assistant</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Prominent 3D Floating Holographic Object */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-square relative rounded-3xl bg-gradient-to-b from-royal-600/10 via-white/[0.02] to-transparent border border-royal-500/20 p-2 backdrop-blur-xl shadow-2xl shadow-royal-950/70">
              {/* Subtle Corner Markers */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-royal-400/70 uppercase tracking-widest">
                STUDENTX // 3D CORE
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
                WebGL • Interactive
              </div>

              {/* 3D Canvas */}
              <Hero3DLogo className="w-full h-full" />
            </div>
            <p className="mt-3 text-[11px] text-slate-500 font-mono">
              ✦ Interactive WebGL Hologram • Move mouse to tilt
            </p>
          </div>

        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-16 w-full rounded-2xl p-1 bg-gradient-to-b from-royal-600/40 via-royal-900/20 to-transparent shadow-2xl shadow-royal-950/80">
          <div className="rounded-[15px] bg-[#070D19]/90 border border-white/10 p-4 sm:p-6 backdrop-blur-2xl text-left">
            {/* Window chrome header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-slate-400 font-mono">studentx.edu/command-center</span>
              <div className="w-14" />
            </div>

            {/* Mock Dashboard Preview Content */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-slate-400">Total Students</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">1,480</p>
                <span className="text-[10px] text-emerald-400">+4.2% this month</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-slate-400">Attendance</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">87.4%</p>
                <span className="text-[10px] text-emerald-400">+1.8% vs last week</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-slate-400">Assignments</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">42</p>
                <span className="text-[10px] text-royal-400">8 due this week</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-[11px] text-slate-400">Students At Risk</p>
                <p className="text-xl sm:text-2xl font-bold text-rose-400 mt-1">12</p>
                <span className="text-[10px] text-emerald-400">-2 since last cycle</span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-royal-950/30 border border-royal-600/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white">Early Warning Alert: Rahul Kumar</span>
                  <span className="text-slate-400 block sm:inline sm:ml-2">Attendance dropped below 75% (68%)</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-royal-600/30 text-royal-300 font-medium">Intervention Suggested</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES ================= */}
      <section id="features" className="w-full py-16 px-6 max-w-6xl mx-auto border-t border-royal-600/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-royal-400 uppercase tracking-widest">Intelligent Capabilities</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">Engineered for Academic Excellence</p>
          <p className="text-sm text-slate-400 mt-2">Distinct role-specific dashboards for Admin, Faculty, and Students.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-royal-600/20 flex items-center justify-center text-royal-400 mb-4 border border-royal-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Student 360° Profile</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Consolidated 360-degree dossiers covering continuous assessments, semester marks, attendance trends, risk telemetry, and assignment audits.
            </p>
          </GlassCard>

          <GlassCard className="p-6" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 mb-4 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Early Warning System</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Algorithmic detection flagging attendance dropouts, deteriorating test trajectories, and overdue assignments before examination cycles.
            </p>
          </GlassCard>

          <GlassCard className="p-6" hoverEffect>
            <div className="w-10 h-10 rounded-xl bg-royal-600/20 flex items-center justify-center text-royal-300 mb-4 border border-royal-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">StudentAI Assistant</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Natural language intelligence parsing student inquiries, timetable queries, and study recommendations directly from institutional records.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* ================= SMART ANALYTICS & EARLY WARNING ================= */}
      <section id="early-warning" className="w-full py-16 px-6 max-w-6xl mx-auto border-t border-royal-600/15">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold text-royal-400 uppercase tracking-widest">Predictive Risk Scoring</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 leading-snug">
              Prevent Dropout & Academic Failure Before It Occurs
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              STUDENTX computes a real-time risk score between 0 and 100 based on weighted attendance records, internal assessment scores, assignment completion velocity, and performance trends.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>0–30 Stable:</strong> Excellent attendance and academic trajectory</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>31–60 Needs Attention:</strong> Borderline attendance or recent downward trend</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>61–100 At Risk:</strong> Immediate faculty counselor intervention recommended</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-semibold text-white">Active Early Warning Triggers</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">Automated Audit</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Rahul Kumar</p>
                  <p className="text-slate-400">CSE Cyber Security • 3rd Year</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-medium">68% Attendance</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Below 75% threshold</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Priya Sundaram</p>
                  <p className="text-slate-400">CSE Cyber Security • 3rd Year</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-medium">-9.5% Marks</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Internal marks declining</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Arun K</p>
                  <p className="text-slate-400">CSE Cyber Security • 3rd Year</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">4 Overdue</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Assignments pending</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="w-full py-20 px-6 max-w-4xl mx-auto text-center border-t border-royal-600/15">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Elevate Your Academic Institution Today
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl mx-auto">
          Experience minimal, presentation-ready student management with the modern Royal Violet SaaS interface.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary px-8 py-3.5 rounded-xl font-semibold text-sm"
          >
            Sign In with Demo Accounts
          </Link>
        </div>
      </section>
    </div>
  );
}
