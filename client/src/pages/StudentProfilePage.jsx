import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  CalendarCheck,
  Award,
  FileText,
  TrendingUp,
  ShieldAlert,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Heart,
  Calendar,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: showError } = useNotification();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    async function fetchStudentProfile() {
      setLoading(true);
      try {
        const studentId = (!id || id === 'profile' || id === 'me')
          ? (user?.studentId || 'std_04')
          : id;
        const res = await api.get(`/students/${studentId}`);
        if (res.data.success) {
          setStudent(res.data.student);
        }
      } catch (err) {
        showError('Unable to load student 360° profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchStudentProfile();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Loading Student 360° Profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Student not found.</p>
        <button onClick={() => navigate('/students')} className="btn-secondary px-4 py-2 mt-4 text-xs rounded-xl">
          Return to Directory
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'academic', label: 'Academic & Courses', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'marks', label: 'Marks & Grades', icon: Award },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'trend', label: 'Performance Trend', icon: TrendingUp },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert },
    { id: 'activity', label: 'Recent Activity', icon: Clock }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/students')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Student Directory</span>
      </button>

      {/* ================= 360° HERO DOSSIER ================= */}
      <GlassCard className="p-6 sm:p-8" glow>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Identifiers */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-royal-500/40 shadow-xl shadow-royal-950"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400" title="Active">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-royal-400">Student 360°</span>
                <StatusBadge type="risk" value={student.riskStatus} size="small" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-0.5">{student.name}</h1>
              <p className="text-xs text-slate-300 font-mono mt-0.5">{student.registerNumber} • {student.department}</p>
              <p className="text-xs text-slate-500 mt-1">{student.year} • {student.semester} (Section {student.section || 'A'})</p>
            </div>
          </div>

          {/* 4 Summary Telemetry Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 shrink-0">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Attendance</span>
              <p className={`text-xl font-bold mt-1 ${student.attendancePercentage < 75 ? 'text-rose-400' : 'text-white'}`}>
                {student.attendancePercentage}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Academic Score</span>
              <p className="text-xl font-bold text-white mt-1">{student.academicScore}%</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Assignments</span>
              <p className="text-xl font-bold text-white mt-1">{student.assignmentCompletion || 91}%</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center min-w-[95px]">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Risk Score</span>
              <p className={`text-xl font-bold mt-1 font-mono ${student.riskScore >= 61 ? 'text-rose-400' : student.riskScore >= 31 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {student.riskScore}/100
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 text-xs no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200
                ${isActive
                  ? 'bg-royal-600/30 text-white border border-royal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 text-royal-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB CONTENT PANELS ================= */}
      <div className="mt-4">
        {/* Tab 1: Personal Information */}
        {activeTab === 'personal' && (
          <GlassCard className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Personal & Institutional Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-royal-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Institutional Email</span>
                  <span className="text-white font-medium">{student.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-royal-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Contact Number</span>
                  <span className="text-white font-medium">{student.phone || '+91 98402 31245'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-royal-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Date of Birth</span>
                  <span className="text-white font-medium">{student.dob || '2004-05-18'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-4 h-4 text-royal-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Blood Group</span>
                  <span className="text-white font-medium">{student.bloodGroup || 'O+'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-royal-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Faculty Mentor</span>
                  <span className="text-white font-medium">{student.mentor || 'Prof. Rajesh Khanna'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="w-4 h-4 text-royal-400 mt-0.5" />
                <div>
                  <span className="text-slate-500 block">Permanent Residence</span>
                  <span className="text-white font-medium">{student.address || 'Chennai, Tamil Nadu, India'}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tab 2: Academic Information */}
        {activeTab === 'academic' && (
          <GlassCard className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Current Enrolled Courses (6th Semester)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-slate-500 font-mono text-[11px]">CS3601 • 4 Credits</span>
                    <h4 className="font-semibold text-white text-sm mt-0.5">Cyber Security & Forensics</h4>
                    <p className="text-slate-400 mt-1">Instructor: Prof. Rajesh Khanna</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-300 font-semibold">Grade: A+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-slate-500 font-mono text-[11px]">CS3602 • 4 Credits</span>
                    <h4 className="font-semibold text-white text-sm mt-0.5">Network Defense & Cryptography</h4>
                    <p className="text-slate-400 mt-1">Instructor: Dr. K. Senthil Nathan</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-300 font-semibold">Grade: A</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-slate-500 font-mono text-[11px]">CS3603 • 3 Credits</span>
                    <h4 className="font-semibold text-white text-sm mt-0.5">Cloud Security Architecture</h4>
                    <p className="text-slate-400 mt-1">Instructor: Dr. Meenakshi Sundaram</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-300 font-semibold">Grade: A+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-slate-500 font-mono text-[11px]">CS3604 • 3 Credits</span>
                    <h4 className="font-semibold text-white text-sm mt-0.5">Ethical Hacking & Penetration Testing</h4>
                    <p className="text-slate-400 mt-1">Instructor: Prof. Rajesh Khanna</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-300 font-semibold">Grade: B+</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div>
                <h3 className="text-base font-semibold text-white">Attendance Audit</h3>
                <p className="text-xs text-slate-400">Current aggregate: {student.attendancePercentage}%</p>
              </div>
              {student.attendancePercentage < 75 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Below Statutory 75% Threshold</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-500">Total Instructional Sessions</span>
                <p className="text-xl font-bold text-white mt-1">120 Hours</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-500">Sessions Attended</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{Math.round((student.attendancePercentage / 100) * 120)} Hours</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-500">Unexcused Absences</span>
                <p className="text-xl font-bold text-rose-400 mt-1">{120 - Math.round((student.attendancePercentage / 100) * 120)} Hours</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-slate-500">Attendance Status</span>
                <p className="text-sm font-bold text-white mt-2">
                  {student.attendancePercentage >= 75 ? 'Compliant' : 'Shortage Notice Dispatched'}
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tab 4: Marks & Grades */}
        {activeTab === 'marks' && (
          <GlassCard className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Continuous Assessment & Examination Grades</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Internal 1 (50)</th>
                    <th className="py-2.5 px-3">Internal 2 (50)</th>
                    <th className="py-2.5 px-3">Assignment (20)</th>
                    <th className="py-2.5 px-3">Exam (100)</th>
                    <th className="py-2.5 px-3">Total (100)</th>
                    <th className="py-2.5 px-3 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {student.marks && student.marks.length > 0 ? (
                    student.marks.map((m) => (
                      <tr key={m.id}>
                        <td className="py-3 px-3 font-medium text-white">{m.subjectName}</td>
                        <td className="py-3 px-3">{m.internal1}</td>
                        <td className="py-3 px-3">{m.internal2}</td>
                        <td className="py-3 px-3">{m.assignmentMarks}</td>
                        <td className="py-3 px-3">{m.semesterExam}</td>
                        <td className="py-3 px-3 font-bold text-white">{m.totalScore}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-300 font-semibold">
                            {m.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-slate-500">
                        No continuous assessment marks logged yet for this semester.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Tab 5: Assignments */}
        {activeTab === 'assignments' && (
          <GlassCard className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Submitted & Pending Tasks</h3>
            <div className="space-y-3 text-xs">
              {(student.recentAssignments || []).map((asg) => (
                <div key={asg.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-white">{asg.title}</h4>
                    <p className="text-slate-400 mt-0.5">{asg.subject} • Due: {new Date(asg.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="assignment" value={asg.status} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Tab 6: Performance Trend */}
        {activeTab === 'trend' && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">5-Day Attendance Trajectory</h3>
                <p className="text-xs text-slate-400">Visual breakdown of weekday presence</p>
              </div>
              <span className={`text-xs font-semibold ${student.performanceTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {student.performanceTrend >= 0 ? `+${student.performanceTrend}% Trajectory` : `${student.performanceTrend}% Trajectory`}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={student.attendanceTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9303C5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9303C5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
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
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#9303C5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#studentTrendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {/* Tab 7: Risk Analysis */}
        {activeTab === 'risk' && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-semibold text-white">Algorithmic Risk Diagnostic</h3>
                <p className="text-xs text-slate-400">Synthesized from attendance, internal assessments, and submissions</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-white">{student.riskScore}/100</span>
                <div className="mt-0.5">
                  <StatusBadge type="risk" value={student.riskStatus} size="small" />
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {student.riskDetails?.factors?.map((f, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${f.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : f.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">{f.metric} Factor</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">{f.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Tab 8: Recent Activity */}
        {activeTab === 'activity' && (
          <GlassCard className="p-6">
            <h3 className="text-base font-semibold text-white mb-4">Audit Trail</h3>
            <div className="space-y-3 text-xs">
              <div className="py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-slate-300">Logged present for Cyber Security & Forensics</span>
                <span className="text-slate-500">Yesterday 09:15 AM</span>
              </div>
              <div className="py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-slate-300">Submitted Cryptographic Hash Function Attack Simulation</span>
                <span className="text-slate-500">2 days ago</span>
              </div>
              <div className="py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-slate-300">Internal assessment 1 marks published: 44/50</span>
                <span className="text-slate-500">4 days ago</span>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

