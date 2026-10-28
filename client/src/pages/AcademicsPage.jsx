import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  TrendingUp,
  BarChart2,
  Plus,
  BookOpen,
  Edit3
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
  CartesianGrid
} from 'recharts';
import GlassCard from '../components/common/GlassCard';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function AcademicsPage() {
  const { isAdmin, isFaculty } = useAuth();
  const { success, error: showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [marksData, setMarksData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [performanceTrend, setPerformanceTrend] = useState([]);

  // Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    internal1: 40,
    internal2: 42,
    assignmentMarks: 18,
    semesterExam: 80
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [marksRes, studRes] = await Promise.all([
        api.get('/marks'),
        api.get('/students?limit=50')
      ]);

      if (marksRes.data.success) {
        setMarksData(marksRes.data.marks);
        setSubjects(marksRes.data.subjects);
        setSubjectAverages(marksRes.data.subjectAverages);
        setPerformanceTrend(marksRes.data.performanceTrend);
      }
      if (studRes.data.success) {
        setStudents(studRes.data.data);
        if (studRes.data.data.length > 0) {
          setFormData(prev => ({ ...prev, studentId: studRes.data.data[0].id }));
        }
      }
    } catch (err) {
      showError('Failed to load academic records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/marks', formData);
      if (res.data.success) {
        success('Academic marks recorded and GPA updated.');
        setIsRecordModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to record marks.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Academic Performance & Marks</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curriculum tracking, internal assessment evaluations, and subject score trajectories.
          </p>
        </div>

        {(isAdmin || isFaculty) && (
          <button
            onClick={() => {
              if (subjects.length > 0 && !formData.subjectId) {
                setFormData(prev => ({ ...prev, subjectId: subjects[0].id }));
              }
              setIsRecordModalOpen(true);
            }}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Marks</span>
          </button>
        )}
      </div>

      {/* ================= CHARTS SECTION: TWO CLEAN CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Performance Trend Across Cycles</h3>
              <p className="text-xs text-slate-400">Class Average vs Cohort Top Benchmark</p>
            </div>
            <span className="text-xs font-mono text-royal-400 font-semibold">Semester 6</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="assessment" stroke="#64748B" fontSize={11} tickLine={false} />
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
                <Line type="monotone" dataKey="classTop" name="Cohort Topper" stroke="#C084FC" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="average" name="Cohort Average" stroke="#9303C5" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Subject-wise Performance Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Subject-wise Score Distribution</h3>
              <p className="text-xs text-slate-400">Mean internal scores by subject</p>
            </div>
            <span className="text-xs text-slate-400">CSE Cyber Security</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="code" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070D19',
                    borderColor: 'rgba(147, 3, 197, 0.4)',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="average" name="Subject Average" fill="#9303C5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* ================= MARKS TABLE ================= */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-royal-400" />
            <h3 className="text-sm font-semibold text-white">Assessment Records Roster</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total Graded: {marksData.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Internal 1 (50)</th>
                <th className="py-3 px-4">Internal 2 (50)</th>
                <th className="py-3 px-4">Assignments (20)</th>
                <th className="py-3 px-4">Exam (100)</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">Loading academic data...</td>
                </tr>
              ) : marksData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">No marks recorded yet.</td>
                </tr>
              ) : (
                marksData.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white">{m.studentName}</span>
                        <p className="text-[11px] text-slate-500 font-mono">{m.registerNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{m.subjectName}</span>
                      <p className="text-[11px] text-slate-500 font-mono">{m.subjectCode}</p>
                    </td>
                    <td className="py-3 px-4">{m.internal1}</td>
                    <td className="py-3 px-4">{m.internal2}</td>
                    <td className="py-3 px-4">{m.assignmentMarks}</td>
                    <td className="py-3 px-4">{m.semesterExam}</td>
                    <td className="py-3 px-4 font-bold text-white text-sm">{m.totalScore}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-royal-600/25 text-royal-300 font-bold border border-royal-500/30">
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ================= RECORD / UPDATE MARKS MODAL ================= */}
      <Modal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} title="Record Academic Marks">
        <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Select Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              required
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.registerNumber})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Select Subject</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              required
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Internal Assessment 1 (/50)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.internal1}
                onChange={(e) => setFormData({ ...formData, internal1: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Internal Assessment 2 (/50)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.internal2}
                onChange={(e) => setFormData({ ...formData, internal2: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Assignment Score (/20)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.assignmentMarks}
                onChange={(e) => setFormData({ ...formData, assignmentMarks: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Semester Exam (/100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.semesterExam}
                onChange={(e) => setFormData({ ...formData, semesterExam: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white"
            >
              Save Marks
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

