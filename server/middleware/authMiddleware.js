import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { db } from '../services/dbService.js';

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please sign in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await db.findById('users', decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or session has expired.'
      });
    }

    // Attach user without password
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.'
    });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks sufficient privileges for this operation.`
      });
    }

    next();
  };
}

