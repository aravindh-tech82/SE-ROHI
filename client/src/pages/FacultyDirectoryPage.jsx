import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Filter,
  CheckCircle,
  X,
  Award
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function FacultyDirectoryPage() {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New faculty form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CSE',
    designation: 'Assistant Professor',
    cabin: 'Academic Block B - 302',
    phone: '+91 98765 43210',
    specialization: 'Artificial Intelligence & Machine Learning'
  });
  const [saving, setSaving] = useState(false);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/faculty');
      if (res.data?.success) {
        setFaculty(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post('/admin/faculty', formData);
      if (res.data?.success) {
        success('Faculty member onboarded successfully.');
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          department: 'CSE',
          designation: 'Assistant Professor',
          cabin: 'Academic Block B - 302',
          phone: '+91 98765 43210',
          specialization: ''
        });
        fetchFaculty();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add faculty.');
    } finally {
      setSaving(false);
    }
  };

  const departmentsList = ['ALL', ...new Set(faculty.map(f => f.department).filter(Boolean))];

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch =
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Faculty Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-royal-600/20 text-royal-300 border border-royal-500/30">
              {faculty.length} Faculty
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional teaching staff, professors, subject experts, and department leads.
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-royal-950"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty by name, specialization, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
          {departmentsList.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-royal-600 text-white'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-300 font-medium">No faculty members found</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search filters or add a new faculty member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculty.map((item) => (
            <GlassCard key={item.id} className="p-5 hover:border-royal-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={item.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=9303c5`}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-royal-500/30 shrink-0 shadow-md shadow-royal-950"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                    <p className="text-xs text-royal-400 font-medium">{item.designation || 'Faculty'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.04] text-slate-300 border border-white/5">
                      {item.department}
                    </span>
                  </div>
                </div>

                {item.specialization && (
                  <div className="mt-3.5 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-royal-400 shrink-0" />
                    <span className="truncate">{item.specialization}</span>
                  </div>
                )}

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate text-slate-300">{item.email}</span>
                  </div>
                  {item.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{item.phone}</span>
                    </div>
                  )}
                  {item.cabin && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{item.cabin}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-royal-400" />
                  <span>{item.activeClasses || 2} Active Classes</span>
                </span>
                <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>On Duty</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#070D19] border border-royal-500/40 p-6 shadow-2xl shadow-royal-950/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-royal-600/20 text-royal-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Onboard New Faculty</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. A. V. Raman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="faculty@studentx.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-[#02060E] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                  >
                    <option value="CSE">CSE</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="AI & DS">AI & DS</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Cabin / Office</label>
                  <input
                    type="text"
                    value={formData.cabin}
                    onChange={(e) => setFormData({ ...formData, cabin: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Specialization / Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems & Cloud Computing"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  <span>Save Faculty</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

