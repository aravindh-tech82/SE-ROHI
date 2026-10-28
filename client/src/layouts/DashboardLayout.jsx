import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  FileText,
  Clock,
  Bell,
  BarChart3,
  Sparkles,
  Settings,
  Search,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  Building2,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import Logo from '../components/common/Logo';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function DashboardLayout() {
  const { user, logout, isAdmin, isFaculty, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Global search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    }
    fetchNotifs();
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search debounced lookup
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [studRes, asgRes, ancRes] = await Promise.all([
          api.get(`/students?search=${encodeURIComponent(searchQuery)}&limit=4`),
          api.get('/assignments'),
          api.get('/announcements')
        ]);

        const matchedStudents = studRes.data?.data || [];
        const matchedAsg = (asgRes.data?.data || []).filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.subject.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3);
        const matchedAnc = (ancRes.data?.data || []).filter(a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3);

        setSearchResults({
          students: matchedStudents,
          assignments: matchedAsg,
          announcements: matchedAnc
        });
        setSearchOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const markNotificationRead = async (id, link) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifDropdownOpen(false);
      if (link) navigate(link);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Role-Aware Nav Items configuration
  const role = (user?.role || 'STUDENT').toUpperCase();

  const adminNavItems = [
    { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/students', icon: Users },
    { label: 'Faculty', path: '/faculty', icon: Briefcase },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Academics', path: '/academics', icon: GraduationCap },
    { label: 'Assignments', path: '/assignments', icon: FileText },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const facultyNavItems = [
    { label: 'Teaching Workspace', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Classes', path: '/faculty/classes', icon: BookOpen },
    { label: 'Students', path: '/students', icon: Users },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Marks', path: '/academics', icon: GraduationCap },
    { label: 'Assignments', path: '/assignments', icon: FileText },
    { label: 'Timetable', path: '/timetable', icon: Clock },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'Performance', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const studentNavItems = [
    { label: 'My Academic Space', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/students/profile', icon: User },
    { label: 'My Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'My Marks', path: '/academics', icon: GraduationCap },
    { label: 'My Assignments', path: '/assignments', icon: FileText },
    { label: 'My Timetable', path: '/timetable', icon: Clock },
    { label: 'Announcements', path: '/announcements', icon: Bell },
    { label: 'My Performance', path: '/analytics', icon: BarChart3 },
    { label: 'StudentAI', path: '/ai', icon: Sparkles, badge: 'AI' },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : role === 'FACULTY' ? facultyNavItems : studentNavItems;

  const roleBadgeLabel =
    role === 'ADMIN'
      ? 'Institutional Command Center'
      : role === 'FACULTY'
      ? 'Teaching Workspace'
      : 'Personal Academic Space';

  return (
    <div className="min-h-screen bg-[#02060E] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-royal-600 selection:text-white">
      {/* Background ambient royal glow accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-royal-600/10 rounded-full blur-[128px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-96 h-96 bg-royal-800/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#070D19]/80 backdrop-blur-xl border-r border-royal-600/15 p-5 justify-between z-30">
        <div className="flex flex-col">
          {/* Logo & Role Workspace Badge */}
          <div className="pb-5 border-b border-white/5 space-y-2.5">
            <Logo to="/dashboard" />
            <div className="px-2.5 py-1 rounded-lg bg-royal-600/15 border border-royal-500/25 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-royal-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-royal-200 uppercase truncate">
                {roleBadgeLabel}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex flex-col space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-royal-600/25 to-royal-600/10 text-white border border-royal-500/40 shadow-sm shadow-royal-950'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-royal-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-royal-600/40 text-royal-200 border border-royal-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=9303c5`}
              alt={user?.name}
              className="w-9 h-9 rounded-lg object-cover border border-royal-500/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <div className="mt-0.5">
                <StatusBadge type="role" value={user?.role} size="small" />
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85%] bg-[#070D19] border-r border-royal-600/30 p-5 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <Logo to="/dashboard" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2.5 px-2 py-1 rounded-lg bg-royal-600/15 border border-royal-500/25 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-royal-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-royal-200 uppercase truncate">
                  {roleBadgeLabel}
                </span>
              </div>

              <nav className="mt-5 flex flex-col space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm
                        ${isActive
                          ? 'bg-royal-600/30 text-white border border-royal-500/40'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-royal-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-royal-600/40 text-royal-200">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-20 h-16 bg-[#02060E]/80 backdrop-blur-xl border-b border-royal-600/15 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search */}
            <div ref={searchRef} className="relative w-64 sm:w-80 md:w-96">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students, assignments, notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults) setSearchOpen(true); }}
                  className="w-full bg-white/[0.04] border border-white/10 hover:border-royal-500/30 focus:border-royal-500 focus:bg-white/[0.06] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 transition-all focus:outline-none"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && searchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#070D19]/95 backdrop-blur-2xl border border-royal-600/30 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Students */}
                  {searchResults.students.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Students</span>
                      <div className="mt-1 space-y-1">
                        {searchResults.students.map(s => (
                          <div
                            key={s.id}
                            onClick={() => { navigate(`/students/${s.id}`); setSearchOpen(false); }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-medium text-white">{s.name}</span>
                              <span className="text-slate-500">{s.registerNumber}</span>
                            </div>
                            <StatusBadge type="risk" value={s.riskStatus} size="small" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assignments */}
                  {searchResults.assignments.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Assignments</span>
                      <div className="mt-1 space-y-1">
                        {searchResults.assignments.map(a => (
                          <div
                            key={a.id}
                            onClick={() => { navigate('/assignments'); setSearchOpen(false); }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors"
                          >
                            <span className="text-white truncate">{a.title}</span>
                            <StatusBadge type="assignment" value={a.status} size="small" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Announcements */}
                  {searchResults.announcements.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Announcements</span>
                      <div className="mt-1 space-y-1">
                        {searchResults.announcements.map(anc => (
                          <div
                            key={anc.id}
                            onClick={() => { navigate('/announcements'); setSearchOpen(false); }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors"
                          >
                            <span className="text-white truncate">{anc.title}</span>
                            <StatusBadge type="priority" value={anc.priority} size="small" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.students.length === 0 && searchResults.assignments.length === 0 && searchResults.announcements.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No matching records found.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Header: Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Menu */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-royal-500 ring-2 ring-[#02060E] animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#070D19]/95 backdrop-blur-2xl border border-royal-600/30 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-royal-600/30 text-royal-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-royal-400 hover:text-royal-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications at this time.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id, n.link)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.unread
                              ? 'bg-royal-950/40 border-royal-600/30 hover:border-royal-500/50'
                              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}&backgroundColor=9303c5`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-lg object-cover border border-royal-500/40"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-[10px] text-royal-400 font-medium">{user?.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#070D19]/95 backdrop-blur-2xl border border-royal-600/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    <button
                      onClick={() => { navigate(isStudent ? '/students/std_01' : '/settings'); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <User className="w-3.5 h-3.5 text-royal-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => { navigate('/settings'); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-royal-400" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => { navigate('/announcements'); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    >
                      <Bell className="w-3.5 h-3.5 text-royal-400" />
                      <span>Notifications</span>
                    </button>
                  </div>

                  <div className="mt-1 pt-1 border-t border-white/5">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY OUTLET */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

