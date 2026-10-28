import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  ShieldAlert,
  Edit2,
  Building2,
  ExternalLink,
  X,
  CheckCircle,
  Search
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function DepartmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    headOfDept: '',
    buildingZone: 'Main Tech Tower',
    studentCount: 180,
    facultyCount: 12
  });
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/departments');
      if (res.data?.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingDept) {
        const res = await api.put(`/admin/departments/${editingDept.id}`, formData);
        if (res.data?.success) {
          success(`Department ${formData.code} updated.`);
        }
      } else {
        const res = await api.post('/admin/departments', formData);
        if (res.data?.success) {
          success(`Department ${formData.code} created.`);
        }
      }
      setShowAddModal(false);
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      headOfDept: dept.headOfDept || '',
      buildingZone: dept.buildingZone || 'Main Tech Tower',
      studentCount: dept.studentCount || 150,
      facultyCount: dept.facultyCount || 10
    });
    setShowAddModal(true);
  };

  const filteredDepts = departments.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.headOfDept?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Academic Departments</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-royal-600/20 text-royal-300 border border-royal-500/30">
              {departments.length} Zones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional department zones, faculties, academic oversight, and cohort metrics.
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              setEditingDept(null);
              setFormData({
                code: '',
                name: '',
                headOfDept: '',
                buildingZone: 'Main Tech Tower',
                studentCount: 180,
                facultyCount: 12
              });
              setShowAddModal(true);
            }}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-royal-950"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by code, department name, or HOD..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500"
        />
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
        </div>
      ) : filteredDepts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/5">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-300 font-medium">No departments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDepts.map((dept) => (
            <GlassCard
              key={dept.id}
              className="p-5 hover:border-royal-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white border border-white/10 shadow-md"
                    style={{ backgroundColor: `${dept.color || '#9303C5'}33`, borderColor: `${dept.color || '#9303C5'}88` }}
                  >
                    {dept.code}
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                      title="Edit Department"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-white group-hover:text-royal-300 transition-colors">
                    {dept.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{dept.buildingZone || 'Academic Block'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    HOD: <strong className="text-slate-200">{dept.headOfDept}</strong>
                  </p>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-400">Students</p>
                    <p className="text-sm font-bold text-white mt-0.5">{dept.studentCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-400">Faculty</p>
                    <p className="text-sm font-bold text-white mt-0.5">{dept.facultyCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-400">Attendance</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">{dept.avgAttendance}%</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-slate-400">Performance</p>
                    <p className="text-sm font-bold text-royal-400 mt-0.5">{dept.avgPerformance}%</p>
                  </div>
                </div>

                {dept.atRiskCount > 0 && (
                  <div className="mt-2.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      <span>At-Risk Students</span>
                    </span>
                    <strong className="font-bold">{dept.atRiskCount}</strong>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/students?dept=${encodeURIComponent(dept.name)}`)}
                  className="text-xs text-royal-400 hover:text-royal-300 font-medium flex items-center gap-1"
                >
                  <span>View Students</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => navigate('/faculty')}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Faculty
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#070D19] border border-royal-500/40 p-6 shadow-2xl shadow-royal-950/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingDept ? `Edit Department ${editingDept.code}` : 'Add Department Zone'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-300">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="CSE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white uppercase focus:outline-none focus:border-royal-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Computer Science & Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Head of Department (HOD)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. P. Ramanathan"
                  value={formData.headOfDept}
                  onChange={(e) => setFormData({ ...formData, headOfDept: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Building / Zone</label>
                <input
                  type="text"
                  placeholder="e.g. Ramanujan Block, Floor 3"
                  value={formData.buildingZone}
                  onChange={(e) => setFormData({ ...formData, buildingZone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Student Count</label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Faculty Count</label>
                  <input
                    type="number"
                    value={formData.facultyCount}
                    onChange={(e) => setFormData({ ...formData, facultyCount: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-royal-500"
                  />
                </div>
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
                  <span>{editingDept ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

