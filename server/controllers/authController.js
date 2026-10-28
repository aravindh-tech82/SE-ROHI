import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';
import { config } from '../config/config.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import { getGoogleAuthUrl, getGoogleUserFromCode, verifyGoogleIdToken } from '../services/googleAuthService.js';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role = 'STUDENT', department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.findOne('users', u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr_' + uuidv4().slice(0, 8),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role.toUpperCase(),
      department: department || 'CSE Cyber Security',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=9303c5,6b21a8`,
      createdAt: new Date().toISOString()
    };

    await db.insert('users', newUser);

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.findOne('users', u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({
    success: true,
    user: req.user
  });
}

export async function googleRedirect(req, res) {
  try {
    const url = getGoogleAuthUrl();
    if (!url) {
      return res.status(503).json({
        success: false,
        message: 'Google OAuth credentials not configured in server .env. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'
      });
    }
    res.redirect(url);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function googleCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.clientUrl}/login?error=Google+authorization+code+missing`);
    }

    const googleProfile = await getGoogleUserFromCode(code);
    const email = googleProfile.email.toLowerCase().trim();

    let user = await db.findOne('users', u => u.email.toLowerCase() === email);

    if (!user) {
      // Auto-register user from Google
      user = {
        id: 'usr_' + uuidv4().slice(0, 8),
        name: googleProfile.name || 'Google User',
        email,
        password: await bcrypt.hash(uuidv4(), 10), // secure random placeholder
        role: 'STUDENT',
        department: 'CSE Cyber Security',
        avatar: googleProfile.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleProfile.name || 'User')}&backgroundColor=9303c5`,
        googleId: googleProfile.sub,
        createdAt: new Date().toISOString()
      };
      await db.insert('users', user);
    } else if (googleProfile.picture && !user.avatar) {
      await db.update('users', user.id, { avatar: googleProfile.picture });
    }

    const token = generateToken(user);
    res.redirect(`${config.clientUrl}/login?oauth_token=${token}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${config.clientUrl}/login?error=${encodeURIComponent(error.message || 'Google Authentication Failed')}`);
  }
}

export async function googleTokenVerify(req, res, next) {
  try {
    const { credential, idToken } = req.body;
    const tokenToVerify = credential || idToken;

    if (!tokenToVerify) {
      return res.status(400).json({ success: false, message: 'Google credential or ID token is required.' });
    }

    const payload = await verifyGoogleIdToken(tokenToVerify);
    const email = payload.email.toLowerCase().trim();

    let user = await db.findOne('users', u => u.email.toLowerCase() === email);

    if (!user) {
      user = {
        id: 'usr_' + uuidv4().slice(0, 8),
        name: payload.name || 'Google User',
        email,
        password: await bcrypt.hash(uuidv4(), 10),
        role: 'STUDENT',
        department: 'CSE Cyber Security',
        avatar: payload.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name || 'User')}&backgroundColor=9303c5`,
        googleId: payload.sub,
        createdAt: new Date().toISOString()
      };
      await db.insert('users', user);
    } else if (payload.picture && (!user.avatar || user.avatar.includes('dicebear'))) {
      await db.update('users', user.id, { avatar: payload.picture });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Google authentication successful.',
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await db.findOne('users', u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // For security, don't reveal if email does not exist, but provide reassuring message
      return res.json({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been dispatched.'
      });
    }

    const resetToken = uuidv4();
    const resetEntry = {
      id: 'rst_' + uuidv4().slice(0, 8),
      userId: user.id,
      email: user.email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      createdAt: new Date().toISOString()
    };

    await db.insert('passwordResets', resetEntry);
    await sendPasswordResetEmail(user.email, resetToken, user.name);

    res.json({
      success: true,
      message: 'Password reset link dispatched to your email address.',
      devNote: 'In development mode without SMTP, the reset link is logged in the server console.'
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters in length.' });
    }

    const resetRecord = await db.findOne('passwordResets', r => r.token === token);
    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or already utilized password reset token.' });
    }

    if (new Date(resetRecord.expiresAt) < new Date()) {
      await db.remove('passwordResets', resetRecord.id);
      return res.status(400).json({ success: false, message: 'This password reset link has expired. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.update('users', resetRecord.userId, { password: hashedPassword });
    await db.remove('passwordResets', resetRecord.id);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
}

