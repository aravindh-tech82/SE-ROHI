import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

// Authenticated Pages
import DashboardPage from '../pages/DashboardPage';
import StudentsPage from '../pages/StudentsPage';
import StudentProfilePage from '../pages/StudentProfilePage';
import FacultyDirectoryPage from '../pages/FacultyDirectoryPage';
import DepartmentsPage from '../pages/DepartmentsPage';
import AuditLogsPage from '../pages/AuditLogsPage';
import AttendancePage from '../pages/AttendancePage';
import AcademicsPage from '../pages/AcademicsPage';
import AssignmentsPage from '../pages/AssignmentsPage';
import TimetablePage from '../pages/TimetablePage';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import StudentAiPage from '../pages/StudentAiPage';
import SettingsPage from '../pages/SettingsPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#02060E]">
        <div className="w-8 h-8 rounded-full border-2 border-royal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Authenticated Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/profile" element={<StudentProfilePage />} />
        <Route path="/students/:id" element={<StudentProfilePage />} />
        <Route path="/faculty" element={<FacultyDirectoryPage />} />
        <Route path="/faculty/classes" element={<StudentsPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai" element={<StudentAiPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

