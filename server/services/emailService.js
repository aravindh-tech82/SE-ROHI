import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

let transporter = null;

// Initialize transporter
function getTransporter() {
  if (transporter) return transporter;

  if (config.email.user && config.email.pass && config.email.pass !== 'mock_email_app_password') {
    transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  } else {
    // Ethereal / development fallback - logs email link to console
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n📧 ================= [STUDENTX EMAIL DISPATCH] =================');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Preview Text:\n${mailOptions.text || mailOptions.html.replace(/<[^>]*>/g, '')}`);
        console.log('=================================================================\n');
        return { messageId: 'dev-mock-id-' + Date.now() };
      }
    };
  }

  return transporter;
}

export async function sendPasswordResetEmail(toEmail, resetToken, userName = 'StudentX User') {
  const mailer = getTransporter();
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(toEmail)}`;

  const mailOptions = {
    from: config.email.from,
    to: toEmail,
    subject: 'STUDENTX - Password Reset Request',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #02060E; color: #F8FAFC; padding: 40px; border-radius: 12px; max-width: 580px; margin: auto; border: 1px solid rgba(147, 3, 197, 0.3);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #F8FAFC; margin: 0; font-size: 26px; letter-spacing: -0.5px;">STUDENT<span style="color: #9303C5;">X</span></h1>
          <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0;">Smart Student Management System</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 24px;">
          <h2 style="font-size: 18px; color: #FFFFFF; margin-top: 0;">Password Reset Instructions</h2>
          <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
            We received a request to reset the password associated with your STUDENTX account. Click the button below to establish a new password:
          </p>
          
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #9303C5 0%, #6B21A8 100%); color: #FFFFFF; padding: 12px 28px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(147, 3, 197, 0.35);">
              Reset Your Password
            </a>
          </div>
          
          <p style="color: #94A3B8; font-size: 12px; line-height: 1.5;">
            Or copy and paste this link into your browser:<br/>
            <span style="color: #C084FC; word-break: break-all;">${resetUrl}</span>
          </p>
          <p style="color: #64748B; font-size: 12px; margin-top: 20px;">
            This reset link is valid for 1 hour. If you did not request this password reset, please ignore this email.
          </p>
        </div>
      </div>
    `,
    text: `Hello ${userName},\n\nClick the link below to reset your STUDENTX password:\n${resetUrl}\n\nThis link is valid for 1 hour.`
  };

  return await mailer.sendMail(mailOptions);
}

