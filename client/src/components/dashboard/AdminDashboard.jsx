import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Building,
  CalendarCheck,
  Award,
  ShieldAlert,
  Plus,
  FileText,
  Download,
  Sparkles,
  Sliders,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import InstitutionalCommandMap from '../3d/InstitutionalCommandMap';
import DepartmentDetailPanel from './DepartmentDetailPanel';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isManageDeptOpen, setIsManageDeptOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Forms state
  const [studentForm, setStudentForm] = useState({
    name: '',
    registerNumber: '',
    email: '',
    department: 'CSE Cyber Security',
    year: '3rd Year',
    attendancePercentage: 88,
    academicScore: 82
  });

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    department: 'CSE Cyber Security',
    designation: 'Associate Professor',
    specialization: 'Cyber Security'
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    priority: 'Important',
    tag: 'Institutional'
  });

  const [editingDept, setEditingDept] = useState(null);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/admin/overview');
      if (res.data.success) {
        setAdminData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/students', studentForm);
      if (res.data.success) {
        success('Student enrolled successfully.');
        setIsAddStudentOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add student.');
    }
  };

  const handleAddFacultySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/faculty', facultyForm);
      if (res.data.success) {
        success('Faculty member credentialed successfully.');
        setIsAddFacultyOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add faculty.');
    }
  };

  const handleAddAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/announcements', announcementForm);
      if (res.data.success) {
        success('Institutional announcement published.');
        setIsAddAnnouncementOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to dispatch notice.');
    }
  };

  const handleUpdateDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/departments/${editingDept.id}`, editingDept);
      if (res.data.success) {
        success('Department configuration updated.');
        setIsManageDeptOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showError('Failed to update department.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Initializing 3D Command Telemetry...</p>
        </div>
      </div>
    );
  }

  const stats = adminData?.stats || {
    totalStudents: 1940,
    totalFaculty: 94,
    activeDepartments: 8,
    avgAttendance: '87.2%',
    avgPerformance: '82.6%',
    totalAtRisk: 12
  };

  const departments = adminData?.departments || [];
  const departmentComparison = adminData?.departmentComparison || [];
  const performanceTrend = adminData?.performanceTrend || [];
  const auditLogs = adminData?.recentAuditLogs || [];

  return (
    <div className="space-y-8 pb-12">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-royal-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-royal-400">
              Institutional Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Executive Academic Oversight
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time multi-department digital twin, telemetry audits, and risk intervention controls.
          </p>
        </div>

        {/* Quick Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => setIsAddFacultyOpen(true)}
            className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-royal-400" />
            <span>Add Faculty</span>
          </button>
          <button
            onClick={() => setIsReportOpen(true)}
            className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 text-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-royal-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 3D INSTITUTIONAL COMMAND MAP ================= */}
      <div id="command-map" className="relative w-full">
        <InstitutionalCommandMap
          departments={departments}
          selectedDepartment={selectedDept}
          onSelectDepartment={(dept) => setSelectedDept(dept)}
        />
      </div>

      {/* Slide-in Detail Panel for selected 3D department */}
      {selectedDept && (
        <DepartmentDetailPanel
          department={selectedDept}
          onClose={() => setSelectedDept(null)}
          onEditDepartment={(dept) => {
            setEditingDept({ ...dept });
            setIsManageDeptOpen(true);
          }}
        />
      )}

      {/* ================= INSTITUTION OVERVIEW PILLARS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <GlassCard className="p-4 text-center" hoverEffect onClick={() => navigate('/students')}>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <Users className="w-3.5 h-3.5 text-royal-400" />
            <span>Total Students</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.totalStudents}</p>
          <span className="text-[10px] text-emerald-400 font-medium">8 Departments</span>
        </GlassCard>

        <GlassCard className="p-4 text-center" hoverEffect onClick={() => navigate('/faculty')}>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-royal-400" />
            <span>Total Faculty</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.totalFaculty}</p>
          <span className="text-[10px] text-royal-300 font-medium">98% Verified</span>
        </GlassCard>

        <GlassCard className="p-4 text-center" hoverEffect onClick={() => navigate('/departments')}>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <Building className="w-3.5 h-3.5 text-royal-400" />
            <span>Active Depts</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.activeDepartments}</p>
          <span className="text-[10px] text-slate-400 font-medium">Fully Chartered</span>
        </GlassCard>

        <GlassCard className="p-4 text-center" hoverEffect onClick={() => navigate('/attendance')}>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Turnout Avg</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 tracking-tight">{stats.avgAttendance}</p>
          <span className="text-[10px] text-emerald-400 font-medium">&gt; 85% Target</span>
        </GlassCard>

        <GlassCard className="p-4 text-center" hoverEffect onClick={() => navigate('/academics')}>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Academic Avg</span>
          </div>
          <p className="text-2xl font-bold text-purple-300 tracking-tight">{stats.avgPerformance}</p>
          <span className="text-[10px] text-purple-400 font-medium">Across Cycles</span>
        </GlassCard>

        <GlassCard className="p-4 text-center" hoverEffect onClick={() => navigate('/students?riskStatus=At+Risk')}>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>At-Risk Pool</span>
          </div>
          <p className="text-2xl font-bold text-rose-400 tracking-tight">{stats.totalAtRisk}</p>
          <span className="text-[10px] text-rose-400 font-medium">Requires Audit</span>
        </GlassCard>
      </div>

      {/* ================= COMMAND ACTIONS STRIP ================= */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-royal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Executive Command Actions</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Privileged Mode: ADMIN</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-royal-500/40 text-left transition-all"
          >
            <span className="font-semibold text-white block">+ Add Student</span>
            <span className="text-[11px] text-slate-400">Enroll new profile</span>
          </button>

          <button
            onClick={() => setIsAddFacultyOpen(true)}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-royal-500/40 text-left transition-all"
          >
            <span className="font-semibold text-white block">+ Add Faculty</span>
            <span className="text-[11px] text-slate-400">Staff credentialing</span>
          </button>

          <button
            onClick={() => setIsAddAnnouncementOpen(true)}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-royal-500/40 text-left transition-all"
          >
            <span className="font-semibold text-white block">+ Announcement</span>
            <span className="text-[11px] text-slate-400">Dispatch notice</span>
          </button>

          <button
            onClick={() => {
              setEditingDept(departments[0] || null);
              setIsManageDeptOpen(true);
            }}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-royal-500/40 text-left transition-all"
          >
            <span className="font-semibold text-white block">+ Manage Dept</span>
            <span className="text-[11px] text-slate-400">Configure zones</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-royal-500/40 text-left transition-all"
          >
            <span className="font-semibold text-white block">+ Generate Report</span>
            <span className="text-[11px] text-slate-400">Audit telemetry</span>
          </button>
        </div>
      </GlassCard>

      {/* ================= COMPACT ADMIN ANALYTICS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Comparison */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Department Academic Benchmarks</h3>
              <p className="text-xs text-slate-400">Cross-departmental continuous assessment mean</p>
            </div>
            <span className="text-xs text-royal-400 font-mono">Real-time</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
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
                <Bar dataKey="avgScore" name="Avg Score %" fill="#9303C5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Attendance Comparison */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Department Turnout Comparison</h3>
              <p className="text-xs text-slate-400">Compliance measured against 85% guideline</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Turnout %</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
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

      {/* ================= RECENT AUDIT LOGS ================= */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-royal-400" />
            <h3 className="text-sm font-semibold text-white">Live Institutional Audit Trail</h3>
          </div>
          <button
            onClick={() => navigate('/audit-logs')}
            className="text-xs text-royal-400 hover:text-royal-300 font-medium transition-colors"
          >
            View Full Audit Logs →
          </button>
        </div>

        <div className="mt-4 divide-y divide-white/5 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${log.severity === 'urgent' ? 'bg-rose-400 animate-ping' : log.severity === 'important' ? 'bg-amber-400' : 'bg-royal-400'}`} />
                <div>
                  <span className="font-semibold text-white">{log.action}: </span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px] self-end sm:self-auto">
                <span>By {log.user}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ================= MODAL: ADD STUDENT ================= */}
      <Modal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} title="Enroll Student Profile">
        <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Student Full Name</label>
            <input
              type="text"
              value={studentForm.name}
              onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Register Number</label>
              <input
                type="text"
                value={studentForm.registerNumber}
                onChange={(e) => setStudentForm({ ...studentForm, registerNumber: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Department</label>
              <select
                value={studentForm.department}
                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.code} — {d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={() => setIsAddStudentOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-semibold text-white">
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: ADD FACULTY ================= */}
      <Modal isOpen={isAddFacultyOpen} onClose={() => setIsAddFacultyOpen(false)} title="Credential Faculty Staff">
        <form onSubmit={handleAddFacultySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Faculty Name</label>
            <input
              type="text"
              value={facultyForm.name}
              onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Institutional Email</label>
              <input
                type="email"
                value={facultyForm.email}
                onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Department</label>
              <select
                value={facultyForm.department}
                onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={() => setIsAddFacultyOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-semibold text-white">
              Credential Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: CREATE ANNOUNCEMENT ================= */}
      <Modal isOpen={isAddAnnouncementOpen} onClose={() => setIsAddAnnouncementOpen(false)} title="Issue Institutional Notice">
        <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Notice Headline</label>
            <input
              type="text"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Priority Classification</label>
            <select
              value={announcementForm.priority}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
            >
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Detailed Circular</label>
            <textarea
              rows="3"
              value={announcementForm.description}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button type="button" onClick={() => setIsAddAnnouncementOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-semibold text-white">
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: MANAGE DEPARTMENT ================= */}
      <Modal isOpen={isManageDeptOpen} onClose={() => setIsManageDeptOpen(false)} title="Configure Department Zone">
        {editingDept && (
          <form onSubmit={handleUpdateDeptSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Department Name</label>
              <input
                type="text"
                value={editingDept.name}
                onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Head of Department (HOD)</label>
                <input
                  type="text"
                  value={editingDept.headOfDept}
                  onChange={(e) => setEditingDept({ ...editingDept, headOfDept: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Building Zone</label>
                <input
                  type="text"
                  value={editingDept.buildingZone}
                  onChange={(e) => setEditingDept({ ...editingDept, buildingZone: e.target.value })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Student Capacity</label>
                <input
                  type="number"
                  value={editingDept.studentCount}
                  onChange={(e) => setEditingDept({ ...editingDept, studentCount: Number(e.target.value) })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Faculty Staff Count</label>
                <input
                  type="number"
                  value={editingDept.facultyCount}
                  onChange={(e) => setEditingDept({ ...editingDept, facultyCount: Number(e.target.value) })}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
              <button type="button" onClick={() => setIsManageDeptOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300">
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2 rounded-xl font-semibold text-white">
                Save Department Config
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ================= MODAL: GENERATE REPORT ================= */}
      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Institutional Audit Report">
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">STUDENTX Executive Summary</h4>
            <p className="text-slate-300">Report Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
              <div>Total Enrolled: <strong className="text-white">{stats.totalStudents}</strong></div>
              <div>Total Faculty: <strong className="text-white">{stats.totalFaculty}</strong></div>
              <div>Turnout Average: <strong className="text-emerald-400">{stats.avgAttendance}</strong></div>
              <div>At-Risk Students: <strong className="text-rose-400">{stats.totalAtRisk}</strong></div>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            This document compiles verified academic marks, faculty turnouts, early warning flags, and department benchmarks.
          </p>
          <div className="pt-4 flex justify-end gap-2 border-t border-white/5">
            <button onClick={() => setIsReportOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300">
              Close
            </button>
            <button
              onClick={() => {
                success('Audit Report exported.');
                setIsReportOpen(false);
              }}
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Audit</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

