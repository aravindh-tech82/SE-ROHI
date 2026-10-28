import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CalendarCheck,
  Award,
  FileText,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Eye
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
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [studentSearch, setStudentSearch] = useState('');

  const fetchFacultyData = async () => {
    try {
      const res = await api.get('/faculty/dashboard');
      if (res.data.success) {
        setFacultyData(res.data);
      }
    } catch (err) {
      console.error('Failed to load faculty workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const facultyDisplayName = user?.name ? user.name : 'Professor Rajesh Khanna';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Loading Teaching Workspace...</p>
        </div>
      </div>
    );
  }

  const todayTeaching = facultyData?.todayTeaching || {
    currentClass: {
      subject: 'Network Security & Forensics',
      code: 'CS3601',
      department: 'CSE Cyber Security',
      room: 'CS-204',
      time: '10:00 AM – 11:00 AM',
      status: 'LIVE NOW',
      enrolledCount: 42,
      presentCount: 38
    },
    nextClass: {
      subject: 'Ethical Hacking Practical Lab',
      code: 'CS3604L',
      department: 'CSE Cyber Security',
      room: 'Cyber Defense Lab 2',
      time: '01:15 PM – 03:15 PM',
      status: 'UPCOMING'
    }
  };

  const assignedClasses = facultyData?.assignedClasses || [];
  const performanceOverview = facultyData?.performanceOverview || {
    attendance: 87.2,
    averageMarks: 82.4,
    assignmentCompletion: 88.5,
    atRiskStudentsCount: 3
  };
  const pendingTasks = facultyData?.pendingTasks || [];
  const cohortStudents = facultyData?.cohortStudents || [];

  // Filter students
  const filteredStudents = cohortStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.registerNumber.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-royal-400">
              TEACHING WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {getGreeting()}, {facultyDisplayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your daily class lectures, mark continuous evaluations, and mentor at-risk students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/attendance')}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>

      {/* ================= TODAY'S TEACHING (LIVE & NEXT CLASS) ================= */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-royal-400" />
          <span>Today's Teaching Schedule</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Class */}
          <GlassCard glow className="p-6 border-royal-500/40 bg-[#070D19]/90 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-royal-600/15 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <span className="text-[11px] font-mono text-royal-400">{todayTeaching.currentClass.code} • {todayTeaching.currentClass.department}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{todayTeaching.currentClass.subject}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {todayTeaching.currentClass.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-slate-300 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-royal-400 shrink-0" />
                <span>{todayTeaching.currentClass.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-royal-400 shrink-0" />
                <span>Room {todayTeaching.currentClass.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-royal-400 shrink-0" />
                <span>{todayTeaching.currentClass.presentCount} / {todayTeaching.currentClass.enrolledCount} Present</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Active Session In Progress</span>
              <button
                onClick={() => navigate('/attendance')}
                className="text-royal-400 hover:text-royal-300 font-semibold flex items-center gap-1"
              >
                <span>Take Roll Call →</span>
              </button>
            </div>
          </GlassCard>

          {/* Next Class */}
          <GlassCard className="p-6 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-3">
                <div>
                  <span className="text-[11px] font-mono text-slate-400">{todayTeaching.nextClass.code} • {todayTeaching.nextClass.department}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{todayTeaching.nextClass.subject}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-royal-600/20 text-royal-300 border border-royal-500/30 text-[10px] font-bold tracking-wider uppercase">
                  {todayTeaching.nextClass.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 mt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-royal-400" />
                  <span>{todayTeaching.nextClass.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-royal-400" />
                  <span>{todayTeaching.nextClass.room}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Lab Equipment Diagnostic: Ready</span>
              <button
                onClick={() => navigate('/timetable')}
                className="text-royal-400 hover:text-royal-300 font-medium"
              >
                View Full Timetable →
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-royal-400" />
          <span>Faculty Quick Actions</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => navigate('/attendance')}
            className="p-4 rounded-xl bg-gradient-to-br from-royal-600/20 to-royal-950/40 border border-royal-500/30 hover:border-royal-500/60 text-left transition-all group"
          >
            <CalendarCheck className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">Mark Attendance</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Daily class roster check</p>
          </button>

          <button
            onClick={() => navigate('/academics')}
            className="p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-royal-950/40 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all group"
          >
            <Award className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">Enter Marks</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Continuous assessment 1 & 2</p>
          </button>

          <button
            onClick={() => navigate('/assignments')}
            className="p-4 rounded-xl bg-gradient-to-br from-royal-600/20 to-royal-950/40 border border-royal-500/30 hover:border-royal-500/60 text-left transition-all group"
          >
            <FileText className="w-5 h-5 text-royal-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">Create Assignment</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Publish lab simulations</p>
          </button>

          <button
            onClick={() => navigate('/students')}
            className="p-4 rounded-xl bg-gradient-to-br from-sky-600/20 to-royal-950/40 border border-sky-500/30 hover:border-sky-500/60 text-left transition-all group"
          >
            <Users className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-white text-sm">View Students</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Search cohort records</p>
          </button>
        </div>
      </div>

      {/* ================= MY CLASSES ================= */}
      <div id="my-classes">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-royal-400" />
          <span>My Assigned Classes & Cohorts</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assignedClasses.map((cls) => (
            <GlassCard key={cls.id} className="p-5 flex flex-col justify-between" hoverEffect>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-white/5">
                  <span className="font-mono text-royal-400 font-semibold">{cls.code}</span>
                  <span>{cls.semester} (Sec {cls.section})</span>
                </div>
                <h3 className="text-base font-bold text-white">{cls.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{cls.schedule}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Students</span>
                  <p className="text-base font-bold text-white mt-0.5">{cls.studentCount}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Turnout</span>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">{cls.attendanceRate}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Avg Marks</span>
                  <p className="text-base font-bold text-purple-300 mt-0.5">{cls.avgScore}%</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* ================= PERFORMANCE TELEMETRY & PENDING TASKS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Performance Overview */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Cohort Performance Telemetry</h3>
              <p className="text-xs text-slate-400">Class aggregate health across continuous metrics</p>
            </div>
            <span className="text-xs text-royal-400 font-mono">128 Students Total</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase">Attendance</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{performanceOverview.attendance}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase">Avg Marks</span>
              <p className="text-xl font-bold text-white mt-1">{performanceOverview.averageMarks}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase">Submissions</span>
              <p className="text-xl font-bold text-purple-300 mt-1">{performanceOverview.assignmentCompletion}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase">At-Risk Pool</span>
              <p className="text-xl font-bold text-rose-400 mt-1">{performanceOverview.atRiskStudentsCount}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Attendance benchmarks are 2.2% above statutory target. 3 students currently require remedial intervention due to test variance.
          </p>
        </GlassCard>

        {/* Pending Tasks */}
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Actionable Pending Tasks</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">3 Pending</span>
            </div>

            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs hover:border-royal-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'urgent' ? 'bg-rose-400 animate-pulse' : task.priority === 'high' ? 'bg-amber-400' : 'bg-royal-400'}`} />
                    <div>
                      <h4 className="font-semibold text-white">{task.title}</h4>
                      <p className="text-slate-400 mt-0.5">{task.subject}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${task.priority === 'urgent' ? 'bg-rose-500/15 text-rose-400' : 'bg-royal-600/20 text-royal-300'}`}>
                    {task.deadline}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-slate-400">
            <span>Tasks auto-sync with StudentAI and evaluation rubric</span>
            <button onClick={() => navigate('/assignments')} className="text-royal-400 hover:text-royal-300 font-semibold">
              Go to Submissions →
            </button>
          </div>
        </GlassCard>
      </div>

      {/* ================= COHORT STUDENT MANAGEMENT ROSTER ================= */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Assigned Student Cohort Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">CSE Cyber Security • 6th Semester</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="glass-input w-full rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Register Number</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Internal Marks</th>
                <th className="py-3 px-4">Submissions</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-royal-500/20" />
                      <div>
                        <span className="font-semibold text-white">{s.name}</span>
                        <p className="text-[11px] text-slate-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{s.registerNumber}</td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${s.attendancePercentage < 75 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {s.attendancePercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{s.academicScore}%</td>
                  <td className="py-3 px-4 text-slate-300">{s.assignmentCompletion || 90}%</td>
                  <td className="py-3 px-4">
                    <StatusBadge type="risk" value={s.riskStatus} size="small" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/students/${s.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-royal-600/20 hover:bg-royal-600/40 text-royal-300 font-medium text-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>360° Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

