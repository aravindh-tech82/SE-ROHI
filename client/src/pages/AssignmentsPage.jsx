import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  UploadCloud,
  Check,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function AssignmentsPage() {
  const { user, isAdmin, isFaculty } = useAuth();
  const { success, error: showError } = useNotification();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAsg, setSelectedAsg] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    title: '',
    subject: 'Cyber Security & Forensics',
    deadline: '',
    maxScore: 20,
    description: ''
  });

  const [submissionNotes, setSubmissionNotes] = useState('');

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/assignments?status=${statusFilter}`);
      if (res.data.success) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      showError('Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [statusFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/assignments', createForm);
      if (res.data.success) {
        success('New assignment published successfully.');
        setIsCreateModalOpen(false);
        fetchAssignments();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create assignment.');
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/assignments/${selectedAsg.id}/status`, {
        status: 'Submitted',
        studentNotes: submissionNotes
      });
      if (res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#9303C5', '#A855F7', '#C084FC', '#38BDF8']
        });

        success('Assignment submitted successfully!');
        setIsSubmitModalOpen(false);
        fetchAssignments();
      }
    } catch (err) {
      showError('Failed to record submission.');
    }
  };

  // Helper for deadline countdown
  const getDaysRemaining = (deadlineDate) => {
    const diffTime = new Date(deadlineDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, isLate: true };
    if (diffDays === 0) return { text: 'Due today', isUrgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isUrgent: true };
    return { text: `${diffDays} days left`, isNormal: true };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Academic Assignments</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track coursework, simulation projects, due dates, and submission evaluations.
          </p>
        </div>

        {(isAdmin || isFaculty) && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* ================= STATUS FILTERS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Pending', 'Submitted', 'Late', 'Graded'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
              px-3.5 py-1.5 rounded-xl font-medium transition-colors
              ${statusFilter === status
                ? 'bg-royal-600/30 text-white border border-royal-500/40'
                : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ================= ASSIGNMENT CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400">No assignments match this filter.</div>
        ) : (
          assignments.map((asg) => {
            const daysInfo = getDaysRemaining(asg.deadline);

            return (
              <GlassCard key={asg.id} className="p-5 flex flex-col justify-between" hoverEffect>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono text-royal-400">{asg.subject}</span>
                    <StatusBadge type="assignment" value={asg.status} />
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{asg.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-royal-400" />
                      <span className={daysInfo.isLate ? 'text-rose-400 font-bold' : daysInfo.isUrgent ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                        {daysInfo.text}
                      </span>
                    </div>
                    <span>Max: {asg.maxScore} Pts</span>
                  </div>

                  {asg.status !== 'Submitted' && asg.status !== 'Graded' ? (
                    <button
                      onClick={() => {
                        setSelectedAsg(asg);
                        setIsSubmitModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-royal-600/30 hover:bg-royal-600 text-white font-medium transition-colors text-xs self-start sm:self-auto flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* ================= CREATE ASSIGNMENT MODAL ================= */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Assignment">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Assignment Title</label>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Memory Dump Analysis & Rootkit Identification"
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Subject</label>
              <select
                value={createForm.subject}
                onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                <option value="Cyber Security & Forensics">Cyber Security & Forensics</option>
                <option value="Network Defense & Cryptography">Network Defense & Cryptography</option>
                <option value="Cloud Security Architecture">Cloud Security Architecture</option>
                <option value="Ethical Hacking & Penetration Testing">Ethical Hacking</option>
                <option value="Deep Learning & Neural Networks">Deep Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Submission Deadline</label>
              <input
                type="datetime-local"
                value={createForm.deadline}
                onChange={(e) => setCreateForm({ ...createForm, deadline: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Max Score</label>
            <input
              type="number"
              min="5"
              max="100"
              value={createForm.maxScore}
              onChange={(e) => setCreateForm({ ...createForm, maxScore: e.target.value })}
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Brief Description / Objective</label>
            <textarea
              rows="3"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Outline evaluation criteria, requirements, or lab specifications..."
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= SUBMIT SOLUTION MODAL ================= */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Assignment Work">
        <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
          <div>
            <p className="text-white font-semibold text-sm">{selectedAsg?.title}</p>
            <p className="text-slate-400 mt-0.5">{selectedAsg?.subject} • Max Score: {selectedAsg?.maxScore} pts</p>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Repository / Submission Notes</label>
            <textarea
              rows="4"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Paste GitHub repository URL, simulation code summary, or write submission notes here..."
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-royal-950/40 border border-royal-600/20 text-slate-300 text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-royal-400 shrink-0" />
            <span>Submitted work will be sent to faculty for automated plagiarism and rubric evaluation.</span>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Submission</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

