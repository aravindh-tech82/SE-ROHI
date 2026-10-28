import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/config.js';
import axios from 'axios';

let client = null;

function getClient() {
  if (!client && config.google.clientId) {
    client = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.callbackUrl
    );
  }
  return client;
}

/**
 * Generates the Google OAuth authorization URL
 */
export function getGoogleAuthUrl() {
  const oauthClient = getClient();
  if (!oauthClient || !config.google.clientId || config.google.clientId.includes('mock_client_id')) {
    return null;
  }

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes
  });
}

/**
 * Exchanges auth code for tokens and fetches user profile
 */
export async function getGoogleUserFromCode(code) {
  const oauthClient = getClient();
  if (!oauthClient) throw new Error('Google OAuth client is not configured.');

  const { tokens } = await oauthClient.getToken(code);
  oauthClient.setCredentials(tokens);

  const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });

  return response.data; // { sub, name, given_name, family_name, picture, email, email_verified }
}

/**
 * Verifies a Google ID token from frontend Google Identity Services
 */
export async function verifyGoogleIdToken(idToken) {
  const oauthClient = getClient();
  if (!oauthClient) {
    throw new Error('Google OAuth client is not configured.');
  }

  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: config.google.clientId
  });

  const payload = ticket.getPayload();
  return payload; // { sub, email, name, picture, email_verified }
}

