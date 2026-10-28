import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Filter,
  ArrowUpDown,
  Download,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

export default function StudentsPage() {
  const { isAdmin, isFaculty } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters & Search
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [year, setYear] = useState(searchParams.get('year') || 'All');
  const [riskStatus, setRiskStatus] = useState(searchParams.get('riskStatus') || 'All');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    email: '',
    phone: '',
    department: 'CSE Cyber Security',
    year: '3rd Year',
    semester: '6th Semester',
    attendancePercentage: 85,
    academicScore: 75,
    bloodGroup: 'B+'
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        department,
        year,
        riskStatus,
        sortBy,
        order,
        page: pagination.page,
        limit: 12
      }).toString();

      const res = await api.get(`/students?${query}`);
      if (res.data.success) {
        setStudents(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showError('Failed to retrieve student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, year, riskStatus, sortBy, order, pagination.page]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      registerNumber: '',
      email: '',
      phone: '',
      department: 'CSE Cyber Security',
      year: '3rd Year',
      semester: '6th Semester',
      attendancePercentage: 90,
      academicScore: 80,
      bloodGroup: 'B+'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      registerNumber: student.registerNumber,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      semester: student.semester,
      attendancePercentage: student.attendancePercentage,
      academicScore: student.academicScore,
      bloodGroup: student.bloodGroup
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/students', formData);
      if (res.data.success) {
        success('Student profile created successfully.');
        setIsAddModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add student.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/students/${selectedStudent.id}`, formData);
      if (res.data.success) {
        success('Student profile updated successfully.');
        setIsEditModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update student.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/students/${selectedStudent.id}`);
      if (res.data.success) {
        success('Student removed from database.');
        setIsDeleteModalOpen(false);
        fetchStudents();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Student Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student records, monitors, attendance, and risk assessments.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        )}
      </div>

      {/* ================= FILTERS & CONTROLS ================= */}
      <GlassCard className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input w-full rounded-xl pl-9 pr-3 py-2 text-xs text-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white bg-[#070D19]"
            >
              <option value="All">All Departments</option>
              <option value="CSE Cyber Security">CSE Cyber Security</option>
              <option value="CSE AI & ML">CSE AI & ML</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white bg-[#070D19]"
            >
              <option value="All">All Academic Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskStatus}
              onChange={(e) => setRiskStatus(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white bg-[#070D19]"
            >
              <option value="All">All Risk Categories</option>
              <option value="Stable">Stable (0-30)</option>
              <option value="Needs Attention">Needs Attention (31-60)</option>
              <option value="At Risk">At Risk (61-100)</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* ================= STUDENTS TABLE ================= */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Student</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('attendancePercentage')}>
                  <div className="flex items-center gap-1.5">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('academicScore')}>
                  <div className="flex items-center gap-1.5">
                    <span>Academic</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('riskScore')}>
                  <div className="flex items-center gap-1.5">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
                      <span>Fetching records...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-semibold text-white">No students found.</p>
                      <p className="text-xs">Try adjusting your filters or search keywords.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-royal-500/20"
                        />
                        <div>
                          <p
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="font-semibold text-white hover:text-royal-300 cursor-pointer transition-colors"
                          >
                            {student.name}
                          </p>
                          <p className="text-[11px] text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{student.registerNumber}</td>
                    <td className="py-3 px-4 text-slate-300">{student.department}</td>
                    <td className="py-3 px-4 text-slate-400">{student.year}</td>

                    {/* Attendance */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${student.attendancePercentage < 75 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                          {student.attendancePercentage}%
                        </span>
                        {student.attendancePercentage < 75 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Below 75%" />
                        )}
                      </div>
                    </td>

                    {/* Academic Score */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200">{student.academicScore}%</span>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{student.riskScore}/100</span>
                        <StatusBadge type="risk" value={student.riskStatus} size="small" />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {student.status || 'Active'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          title="View 360° Profile"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-royal-300 hover:bg-white/5 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {(isAdmin || isFaculty) && (
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            title="Edit Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleOpenDeleteModal(student)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {students.length} of {pagination.total} registered students</span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-white">Page {pagination.page} of {pagination.totalPages || 1}</span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </GlassCard>

      {/* ================= ADD STUDENT MODAL ================= */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Student Profile">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Student Name"
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Register Number</label>
              <input
                type="text"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                placeholder="e.g. 718122BCS014"
                className="glass-input w-full rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@studentx.edu"
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98400 00000"
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                <option value="CSE Cyber Security">CSE Cyber Security</option>
                <option value="CSE AI & ML">CSE AI & ML</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Academic Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Semester</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="6th Semester"
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Initial Attendance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendancePercentage}
                onChange={(e) => setFormData({ ...formData, attendancePercentage: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Initial Academic Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.academicScore}
                onChange={(e) => setFormData({ ...formData, academicScore: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white"
            >
              Add Student
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= EDIT STUDENT MODAL ================= */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Student Record">
        <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Register Number</label>
              <input
                type="text"
                value={formData.registerNumber}
                disabled
                className="glass-input w-full rounded-xl px-3 py-2 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                <option value="CSE Cyber Security">CSE Cyber Security</option>
                <option value="CSE AI & ML">CSE AI & ML</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#070D19]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Attendance (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendancePercentage}
                onChange={(e) => setFormData({ ...formData, attendancePercentage: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Academic Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.academicScore}
                onChange={(e) => setFormData({ ...formData, academicScore: e.target.value })}
                className="glass-input w-full rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 rounded-xl font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Removal" maxWidth="max-w-md">
        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Are you sure you want to permanently remove <strong>{selectedStudent?.name}</strong> ({selectedStudent?.registerNumber}) from the database? This action cannot be reversed.
          </p>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-900/40"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

