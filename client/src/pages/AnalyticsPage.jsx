import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Users,
  Award,
  CalendarCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import GlassCard from '../components/common/GlassCard';
import api from '../services/api';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get('/analytics/detailed');
        if (res.data.success) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const deptStats = analyticsData?.deptStats || [];
  const gradeDistribution = analyticsData?.gradeDistribution || [];
  const riskBreakdown = analyticsData?.riskBreakdown || [];
  const assignmentStats = analyticsData?.assignmentStats || [];

  const tabs = [
    { id: 'overview', label: 'Institutional Overview', icon: BarChart3 },
    { id: 'risk', label: 'Risk & Attrition Analysis', icon: AlertCircle },
    { id: 'academics', label: 'Academic & Grade Metrics', icon: Award },
    { id: 'assignments', label: 'Submission Velocity', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Institutional Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated intelligence across departments, continuous assessments, and early warning risk distributions.
          </p>
        </div>
      </div>

      {/* ================= ANALYTICS TABS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap
                ${isSelected
                  ? 'bg-royal-600/30 text-white border border-royal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 text-royal-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Academic Score Comparison */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Department Academic Average (%)</h3>
            <p className="text-xs text-slate-400 mb-6">Cross-disciplinary academic benchmarks</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="department" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070D19',
                      borderColor: 'rgba(147, 3, 197, 0.4)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Bar dataKey="avgScore" name="Academic Score %" fill="#9303C5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Department Attendance Comparison */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Department Attendance Average (%)</h3>
            <p className="text-xs text-slate-400 mb-6">Compliance against 85% institutional guideline</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="department" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070D19',
                      borderColor: 'rgba(147, 3, 197, 0.4)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Bar dataKey="avgAttendance" name="Turnout %" fill="#A855F7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ================= TAB 2: RISK BREAKDOWN ================= */}
      {activeTab === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Student Population by Risk Status</h3>
            <p className="text-xs text-slate-400 mb-4">Stable (0-30), Needs Attention (31-60), At Risk (61-100)</p>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070D19',
                      borderColor: 'rgba(147, 3, 197, 0.4)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Risk Mitigation Protocols</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-semibold text-emerald-400">Stable Cohort (61%)</span>
                <p className="text-slate-300 mt-1">Autonomous self-directed learning; scheduled for advanced honors research and mentorship.</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-semibold text-amber-300">Needs Attention (22%)</span>
                <p className="text-slate-300 mt-1">Bi-weekly mentoring sessions assigned to review borderline attendance and missing assignments.</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="font-semibold text-rose-400">At Risk Cohort (17%)</span>
                <p className="text-slate-300 mt-1">Emergency parent-faculty conferences scheduled; individual remedial tutors assigned.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ================= TAB 3: ACADEMIC GRADES ================= */}
      {activeTab === 'academics' && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Grade Distribution Curve</h3>
          <p className="text-xs text-slate-400 mb-6">Percentage breakdown across university grading bands</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="grade" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070D19',
                    borderColor: 'rgba(147, 3, 197, 0.4)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="percentage" name="% of Cohort" fill="#9303C5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* ================= TAB 4: ASSIGNMENTS VELOCITY ================= */}
      {activeTab === 'assignments' && (
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Assignment Completion Rate (%)</h3>
          <p className="text-xs text-slate-400 mb-6">Track submission rates per continuous assessment task</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assignmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="title" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070D19',
                    borderColor: 'rgba(147, 3, 197, 0.4)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="rate" name="Completion Rate %" fill="#A855F7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

