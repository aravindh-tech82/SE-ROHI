import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  FileText,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Calendar,
  X,
  Send,
  Bot,
  User
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
import api from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  // Floating AI Assistant Modal State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your personal StudentAI assistant. How can I help you with your classes, attendance, or upcoming assignments today?"
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const fetchStudentData = async () => {
    try {
      const res = await api.get('/student/dashboard');
      if (res.data.success) {
        setStudentData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleSendAi = async (promptText) => {
    const query = (promptText || aiInput).trim();
    if (!query) return;

    setAiMessages(prev => [...prev, { id: 'usr_' + Date.now(), sender: 'user', text: query }]);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await api.post('/ai/query', { query });
      if (res.data.success) {
        setAiMessages(prev => [
          ...prev,
          {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            text: res.data.summary,
            recommendation: res.data.recommendation
          }
        ]);
      }
    } catch (err) {
      setAiMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: 'Unable to analyze query right now. Please try again.'
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Loading Personal Academic Space...</p>
        </div>
      </div>
    );
  }

  const student = studentData?.student || {
    name: 'Aravindh S',
    registerNumber: '718122BCS014',
    department: 'CSE Cyber Security',
    semester: '6th Semester',
    cgpa: '8.42',
    performanceStatus: 'STABLE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  };

  const personalMetrics = studentData?.personalMetrics || {
    attendance: 87,
    assignments: 91,
    averageMarks: 82,
    riskScore: 18,
    riskStatus: 'Stable'
  };

  const performanceTrend = studentData?.performanceTrend || [];
  const subjectPerformance = studentData?.subjectPerformance || [];
  const todaySchedule = studentData?.todaySchedule || {
    nextClass: { subject: 'Network Security & Cryptography', code: 'CS3602', time: '10:00 AM', room: 'CS-204', faculty: 'Prof. Rajesh Khanna' },
    upcomingAssignments: [],
    upcomingExam: { title: 'Continuous Assessment 2', date: 'Monday • 09:30 AM', room: 'Exam Hall 3' }
  };

  return (
    <div className="space-y-8 pb-16 relative">
      {/* ================= STUDENT HERO BANNER ================= */}
      <GlassCard glow className="p-6 sm:p-8 bg-gradient-to-r from-[#070D19]/90 via-[#0B1324]/80 to-[#070D19]/90 border-royal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-royal-500/40 shadow-xl shadow-royal-950"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-royal-400">
                  MY ACADEMIC SPACE
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                  student.performanceStatus === 'STABLE'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {student.performanceStatus}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">{student.name}</h1>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">{student.registerNumber} • {student.department}</p>
              <p className="text-xs text-slate-400 mt-1">{student.semester} • Section {student.section || 'A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl self-start md:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Cumulative GPA</span>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-royal-400 to-[#C084FC]">
                {student.cgpa}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">Top 10% of Cohort</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ================= 4 PERSONAL METRICS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Attendance */}
        <GlassCard className="p-5" hoverEffect onClick={() => navigate('/attendance')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${personalMetrics.attendance < 75 ? 'text-rose-400' : 'text-white'}`}>
              {personalMetrics.attendance}%
            </h3>
            <span className={`text-[11px] font-medium ${personalMetrics.attendance < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {personalMetrics.attendance >= 75 ? '✓ Compliant with 75% Rule' : '⚠ Below 75% Threshold'}
            </span>
          </div>
        </GlassCard>

        {/* Assignments */}
        <GlassCard className="p-5" hoverEffect onClick={() => navigate('/assignments')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Assignments</span>
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{personalMetrics.assignments}%</h3>
            <span className="text-[11px] text-royal-400 font-medium">7 of 8 Completed</span>
          </div>
        </GlassCard>

        {/* Average Marks */}
        <GlassCard className="p-5" hoverEffect onClick={() => navigate('/academics')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Marks</span>
            <div className="p-2 rounded-xl bg-royal-600/15 border border-royal-500/20 text-royal-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{personalMetrics.averageMarks}%</h3>
            <span className="text-[11px] text-emerald-400 font-medium">+3.2% vs Previous Term</span>
          </div>
        </GlassCard>

        {/* Risk Score */}
        <GlassCard className="p-5" hoverEffect>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Risk Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">
              {personalMetrics.riskScore} <span className="text-xs text-slate-500">/ 100</span>
            </h3>
            <div className="mt-0.5">
              <StatusBadge type="risk" value={personalMetrics.riskStatus} size="small" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ================= PROGRESS VISUALIZATION ("MY PERFORMANCE") ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">MY PERFORMANCE</h3>
              <p className="text-xs text-slate-400">Assessment marks trajectory vs class average</p>
            </div>
            <span className="text-xs text-royal-400 font-mono font-semibold">Semester 6</span>
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
                <Line type="monotone" dataKey="score" name="My Score" stroke="#9303C5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="classAverage" name="Class Average" stroke="#64748B" strokeWidth={1.8} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Subject Performance Breakdown */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Subject-wise Mastery</h3>
              <p className="text-xs text-slate-400">Current scores and letter grades</p>
            </div>
            <button onClick={() => navigate('/academics')} className="text-xs text-royal-400 hover:text-royal-300 font-medium">
              View Transcript →
            </button>
          </div>

          <div className="space-y-3">
            {subjectPerformance.map((sub, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-white">{sub.fullName}</span>
                  <p className="text-[11px] text-slate-500 font-mono">{sub.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">{sub.total}%</span>
                  <span className="px-2 py-0.5 rounded bg-royal-600/30 text-royal-200 font-bold border border-royal-500/30">
                    {sub.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ================= TODAY SECTION (NEXT CLASS, UPCOMING ASSIGNMENTS & EXAMS) ================= */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-royal-400" />
          <span>TODAY & UPCOMING SCHEDULE</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Next Class */}
          <GlassCard className="p-5 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-xs">
                <span className="font-mono text-royal-400">Next Class</span>
                <span className="px-2 py-0.5 rounded bg-royal-600/20 text-royal-300 font-mono text-[10px]">Today</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{todaySchedule.nextClass.subject}</h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">{todaySchedule.nextClass.code}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-royal-400" />
                <span>{todaySchedule.nextClass.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-royal-400" />
                <span>{todaySchedule.nextClass.room}</span>
              </div>
            </div>
          </GlassCard>

          {/* Upcoming Assignment Deadlines */}
          <GlassCard className="p-5 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-xs">
                <span className="font-mono text-amber-400">Assignment Deadlines</span>
                <span className="text-[10px] text-slate-400">Action Required</span>
              </div>
              <div className="space-y-2 mt-2 text-xs">
                {todaySchedule.upcomingAssignments.map(asg => (
                  <div key={asg.id} className="flex justify-between items-center">
                    <span className="text-white truncate max-w-[160px]">{asg.title}</span>
                    <span className="text-amber-300 font-mono text-[11px] shrink-0">{asg.deadline}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => navigate('/assignments')}
                className="text-xs text-royal-400 hover:text-royal-300 font-semibold flex items-center gap-1"
              >
                <span>Submit Work on Portal →</span>
              </button>
            </div>
          </GlassCard>

          {/* Upcoming Exam */}
          <GlassCard className="p-5 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-xs">
                <span className="font-mono text-purple-400">Upcoming Assessment</span>
                <span className="text-[10px] text-slate-400">Continuous Evaluation</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{todaySchedule.upcomingExam.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{todaySchedule.upcomingExam.room}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-purple-300 font-mono font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>{todaySchedule.upcomingExam.date}</span>
              </div>
              <button onClick={() => navigate('/timetable')} className="text-royal-400 hover:text-royal-300 font-medium">
                Syllabus
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ================= FLOATING AI ASSISTANT BUTTON ================= */}
      <button
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-royal-600 to-purple-600 text-white shadow-2xl shadow-royal-950 hover:scale-105 transition-transform flex items-center gap-2 border border-royal-400/40"
        title="Open StudentAI Assistant"
      >
        <Sparkles className="w-5 h-5 text-white animate-spin [animation-duration:8s]" />
        <span className="text-xs font-semibold pr-1">Ask StudentAI</span>
      </button>

      {/* ================= FLOATING AI CHAT PANEL ================= */}
      {isAiOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#070D19]/95 backdrop-blur-2xl border-l border-royal-600/30 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-royal-600/30 text-royal-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">StudentAI Co-Pilot</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Personal Academic Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-3 pb-2 flex flex-wrap gap-1.5 text-[11px]">
              {[
                'What is my attendance?',
                'What assignments are pending?',
                'When is my next class?',
                'Which subject needs improvement?',
                'How can I improve my performance?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAi(chip)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-royal-600/20 border border-white/10 hover:border-royal-500/30 text-slate-300 transition-colors text-left"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="mt-3 max-h-[50vh] overflow-y-auto space-y-3 pr-1 text-xs">
              {aiMessages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-royal-600/20 text-royal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-royal-600 text-white shadow-md'
                      : 'bg-white/[0.04] border border-white/5 text-slate-200'
                  }`}>
                    <p>{msg.text}</p>
                    {msg.recommendation && (
                      <p className="mt-2 pt-2 border-t border-white/10 text-royal-300 text-[11px]">
                        💡 {msg.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="text-xs text-slate-500 font-mono animate-pulse">
                  StudentAI is reviewing your records...
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="pt-3 border-t border-white/10 relative">
            <input
              type="text"
              placeholder="Ask anything about your courses or grades..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendAi(); }}
              className="glass-input w-full rounded-xl pl-3 pr-10 py-2.5 text-xs text-white"
            />
            <button
              onClick={() => handleSendAi()}
              disabled={!aiInput.trim()}
              className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

