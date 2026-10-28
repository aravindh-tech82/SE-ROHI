import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Building,
  ArrowRight,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function DepartmentDetailPanel({ department, onClose, onEditDepartment }) {
  const navigate = useNavigate();

  if (!department) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#070D19]/95 backdrop-blur-2xl border-l border-royal-600/30 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: department.color || '#9303C5' }} />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-royal-400">
                {department.code} NODE
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{department.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{department.buildingZone}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Head of Department Pill */}
        <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Head of Department (HOD)</span>
            <span className="text-white font-semibold">{department.headOfDept}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-200 text-[10px] font-mono">
            Est. {department.establishedYear || 2005}
          </span>
        </div>

        {/* 6 Key Department Telemetry Pillars */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-royal-400" />
              <span>Enrolled Students</span>
            </div>
            <p className="text-2xl font-bold text-white">{department.studentCount}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-royal-400" />
              <span>Faculty Staff</span>
            </div>
            <p className="text-2xl font-bold text-white">{department.facultyCount}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Average Turnout</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{department.avgAttendance}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Average Marks</span>
            </div>
            <p className="text-2xl font-bold text-purple-300">{department.avgPerformance}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <FileCheck className="w-3.5 h-3.5 text-royal-400" />
              <span>Submission Velocity</span>
            </div>
            <p className="text-2xl font-bold text-white">{department.assignmentRate || 92}%</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>At-Risk Students</span>
            </div>
            <p className="text-2xl font-bold text-rose-400">{department.atRiskCount}</p>
          </div>
        </div>

        {/* Trajectory */}
        <div className="mt-4 p-3 rounded-xl bg-royal-950/40 border border-royal-600/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Semester Growth Trajectory</span>
          </div>
          <span className="font-bold text-emerald-400">+{department.performanceTrend || 3.2}%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-white/10 space-y-2 text-xs">
        <button
          onClick={() => navigate(`/students?department=${encodeURIComponent(department.name)}`)}
          className="btn-primary w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <span>View Students</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate(`/faculty?department=${encodeURIComponent(department.name)}`)}
            className="btn-secondary py-2 rounded-xl font-medium text-slate-200 hover:text-white"
          >
            View Faculty
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="btn-secondary py-2 rounded-xl font-medium text-slate-200 hover:text-white"
          >
            View Analytics
          </button>
        </div>

        <button
          onClick={() => {
            if (onEditDepartment) onEditDepartment(department);
          }}
          className="w-full py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-royal-400" />
          <span>Manage Department</span>
        </button>
      </div>
    </div>
  );
}

