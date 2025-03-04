import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token for storage
 */
export function hashToken(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

/**
 * Generate a random API key
 */
export function generateApiKey(): string {
  const prefix = 'cak'; // CrewAI Key prefix
  const random = crypto.randomBytes(24).toString('base64url');
  return `${prefix}_${random}`;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user data for safe storage/transmission
 */
export function sanitizeUserData<T extends { password?: string }>(
  user: T
): Omit<T, 'password'> {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

/**
 * Calculate token expiration date
 */
export function calculateExpirationDate(hours: number): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + hours);
  return expiration;
}

/**
 * Check if a date is expired
 */
export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Create a random secure password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*',
  };

  let password = '';
  const allChars = Object.values(charset).join('');

  // Ensure at least one character from each set
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
  password += charset.special.charAt(Math.floor(Math.random() * charset.special.length));

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Parse Authorization header
 */
export function parseAuthHeader(header?: string): {
  type: string;
  credentials: string;
} | null {
  if (!header) {
    return null;
  }

  const [type, credentials] = header.split(' ');
  if (!type || !credentials) {
    return null;
  }

  return { type, credentials };
}