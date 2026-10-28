import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Calendar,
  User,
  Tag,
  Trash2,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function AnnouncementsPage() {
  const { user, isAdmin, isFaculty } = useAuth();
  const { success, error: showError } = useNotification();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Normal',
    tag: 'Notice'
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/announcements?priority=${priorityFilter}`);
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      showError('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [priorityFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/announcements', formData);
      if (res.data.success) {
        success('Announcement published and notifications dispatched.');
        setIsCreateModalOpen(false);
        setFormData({ title: '', description: '', priority: 'Normal', tag: 'Notice' });
        fetchAnnouncements();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to publish announcement.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/announcements/${id}`);
      if (res.data.success) {
        success('Announcement deleted.');
        fetchAnnouncements();
      }
    } catch (err) {
      showError('Failed to delete announcement.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Institutional Announcements</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official communications, examination circulars, placement drives, and compliance notices.
          </p>
        </div>

        {(isAdmin || isFaculty) && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* ================= PRIORITY FILTER TABS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Normal', 'Important', 'Urgent'].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`
              px-3.5 py-1.5 rounded-xl font-medium transition-colors
              ${priorityFilter === p
                ? 'bg-royal-600/30 text-white border border-royal-500/40'
                : 'text-slate-400 hover:text-white bg-white/[0.02] border border-white/5'
              }
            `}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ================= ANNOUNCEMENTS LIST ================= */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading notices...</div>
        ) : announcements.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No notices in this category.</div>
        ) : (
          announcements.map((anc) => (
            <GlassCard key={anc.id} className="p-6" hoverEffect>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    anc.priority === 'Urgent'
                      ? 'bg-rose-500/20 text-rose-400'
                      : anc.priority === 'Important'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-royal-600/20 text-royal-400'
                  }`}>
                    <Megaphone className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-white">{anc.title}</h3>
                      <StatusBadge type="priority" value={anc.priority} />
                      {anc.tag && (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[11px] font-medium border border-white/10">
                          {anc.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed max-w-4xl">
                      {anc.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-royal-400" />
                        <span>{anc.publisher}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-royal-400" />
                        <span>{new Date(anc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(anc.id)}
                    title="Delete notice"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors self-end sm:self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* ================= CREATE ANNOUNCEMENT MODAL ================= */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Publish Institutional Notice">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1">Notice Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule for Mid-Term Continuous Assessment"
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Priority Classification</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Category Tag</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. Examinations, Placements, Attendance"
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">Notice Content</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide full description and instructions for students and staff..."
              className="glass-input w-full rounded-xl px-3 py-2 text-white"
              required
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
              Dispatch Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

