import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Sparkles
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Modal from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AttendancePage() {
  const { user, isAdmin, isFaculty } = useAuth();
  const { success, error: showError } = useNotification();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [department, setDepartment] = useState('CSE Cyber Security');
  const [semester, setSemester] = useState('6th Semester');

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, percentage: 100 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchAttendanceSheet = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance?date=${date}&department=${encodeURIComponent(department)}&semester=${encodeURIComponent(semester)}`);
      if (res.data.success) {
        setRecords(res.data.records);
        setSummary(res.data.summary);
      }
    } catch (err) {
      showError('Failed to fetch attendance register.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceSheet();
  }, [date, department, semester]);

  const toggleStudentStatus = (studentId) => {
    setRecords(prev => {
      const updated = prev.map(r => {
        if (r.studentId === studentId) {
          const nextStatus = r.status === 'Present' ? 'Absent' : 'Present';
          return { ...r, status: nextStatus };
        }
        return r;
      });

      // Recalculate summary live
      const presentCount = updated.filter(r => r.status === 'Present').length;
      const pct = updated.length ? Math.round((presentCount / updated.length) * 100) : 0;
      setSummary({
        total: updated.length,
        present: presentCount,
        absent: updated.length - presentCount,
        percentage: pct
      });

      return updated;
    });
  };

  const markAllPresent = () => {
    setRecords(prev => prev.map(r => ({ ...r, status: 'Present' })));
    setSummary({
      total: records.length,
      present: records.length,
      absent: 0,
      percentage: 100
    });
    success('Marked all students as Present.');
  };

  const handleSubmitAttendance = async () => {
    setIsConfirmModalOpen(false);
    setSubmitting(true);
    try {
      const payload = {
        date,
        department,
        semester,
        records: records.map(r => ({ studentId: r.studentId, status: r.status }))
      };

      const res = await api.post('/attendance', payload);
      if (res.data.success) {
        success('Attendance records submitted and telemetry synced.');
        fetchAttendanceSheet();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Daily Attendance Register</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conduct daily attendance checks with automatic early warning threshold audits.
          </p>
        </div>

        {(isAdmin || isFaculty) && (
          <div className="flex items-center gap-3">
            <button
              onClick={markAllPresent}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Mark All Present</span>
            </button>

            <button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={submitting}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Attendance</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= CONTROLS & DATE SELECTOR ================= */}
      <GlassCard className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Instructional Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-royal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-input w-full rounded-xl pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white bg-[#070D19]"
            >
              <option value="CSE Cyber Security">CSE Cyber Security</option>
              <option value="CSE AI & ML">CSE AI & ML</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">Semester Cohort</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white bg-[#070D19]"
            >
              <option value="6th Semester">6th Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* ================= SUMMARY STATS PILLARS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Enrolled in Cohort</span>
          <p className="text-2xl font-bold text-white mt-1">{summary.total}</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Present Today</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{summary.present}</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Absent Today</span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{summary.absent}</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">Day Attendance %</span>
          <p className="text-2xl font-bold text-royal-300 mt-1">{summary.percentage}%</p>
        </GlassCard>
      </div>

      {/* ================= STUDENT ATTENDANCE LIST ================= */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Student Roster — {department}</h3>
          <span className="text-xs text-slate-400 font-mono">Date: {date}</span>
        </div>

        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading roster...</div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No students found in this department.</div>
          ) : (
            records.map((r) => {
              const isLowAtt = r.overallAttendance < 75;
              const isPresent = r.status === 'Present';

              return (
                <div
                  key={r.studentId}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-10 h-10 rounded-full object-cover border border-royal-500/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">{r.name}</span>
                        {isLowAtt && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Shortage (&lt;75%)</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {r.registerNumber} • Overall Turnout: <strong className={isLowAtt ? 'text-rose-400' : 'text-slate-200'}>{r.overallAttendance}%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => toggleStudentStatus(r.studentId)}
                      className={`
                        flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
                        ${isPresent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950'
                        }
                      `}
                    >
                      {isPresent ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Present</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Absent</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      {/* ================= CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Attendance Submission"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            You are about to log attendance for <strong>{summary.total}</strong> students in <strong>{department}</strong> for <strong>{date}</strong>.
          </p>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Present:</span>
              <span className="text-emerald-400 font-bold">{summary.present}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Absent:</span>
              <span className="text-rose-400 font-bold">{summary.absent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Average:</span>
              <span className="text-white font-bold">{summary.percentage}%</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            Submitting will update individual student percentages and trigger risk telemetry calculations.
          </p>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Review
            </button>
            <button
              onClick={handleSubmitAttendance}
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

