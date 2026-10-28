import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import { initDb } from './services/dbService.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import studentDashboardRoutes from './routes/studentDashboardRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow frontend dev server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'STUDENTX',
    tagline: 'Smart Student Management System',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentDashboardRoutes);

// Global Error Handler
app.use(errorHandler);

// Server Startup
async function startServer() {
  try {
    await initDb();
    app.listen(config.port, () => {
      console.log(`\n=================================================`);
      console.log(`🚀 STUDENTX Server running on port ${config.port}`);
      console.log(`🔗 API Base: http://localhost:${config.port}/api`);
      console.log(`🎨 Client URL: ${config.clientUrl}`);
      console.log(`=================================================\n`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

