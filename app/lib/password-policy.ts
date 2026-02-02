'use client';

// A compact list of common and easily guessable passwords.
// This is not exhaustive but covers the most frequent and obvious cases.
const COMMON_PASSWORDS = new Set([
  '123456', 'password', '123456789', '12345678', '12345', '111111', '1234567', 'qwerty',
  '123123', '987654321', 'password123', 'admin', 'user', 'test', 'welcome', 'letmein',
  'secret', 'root', 'master', 'login', 'guest', 'iloveyou', 'sunshine', 'football',
  'baseball', 'basketball', 'monkey', 'dragon', 'shadow', 'anonymous', 'administrator',
  'changeme', 'default', 'example', 'demo', '123qweasd', 'asdfghjkl', 'zxcvbnm',
  // Add more obvious patterns as needed
  ...Array.from({ length: 10 }, (_, i) => String(i).repeat(6)), // '000000' to '999999'
]);

// Patterns to block, case-insensitive
const BLOCKED_PATTERNS = [
  'password', 'qwerty', 'admin', 'letmein', '123456', 'iloveyou', 'welcome'
];

interface ValidationResult {
  isValid: boolean;
  reasons: string[];
  strength: 'Weak' | 'Okay' | 'Strong' | 'Very Strong';
}

/**
 * Validates a password against the defined policy.
 * @param password The password to validate.
 * @param appName An optional app name to block.
 * @param tenantName An optional tenant name to block.
 * @returns An object with validation result.
 */
export function validatePassword(
  password_raw: string,
  appName?: string,
  tenantName?: string
): ValidationResult {
  const password = password_raw.trim();
  const reasons: string[] = [];
  
  if (password_raw !== password) {
      reasons.push('Leading or trailing spaces are not allowed.');
  }

  // Rule 1: Minimum length
  if (password.length < 12) {
    reasons.push('Must be at least 12 characters long.');
  }

  // Rule 2: Character categories (at least 3 of 4)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const categoryCount = [hasLowercase, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;

  if (categoryCount < 3) {
    reasons.push('Must use at least 3 of: lowercase, uppercase, numbers, and symbols.');
  }

  // Rule 3: Block common passwords and patterns
  const lowerCasePassword = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lowerCasePassword)) {
    reasons.push('This password is too common. Please choose a more unique one.');
  }

  const blocked = BLOCKED_PATTERNS.some(pattern => lowerCasePassword.includes(pattern));
  if(blocked) {
    reasons.push('Password contains a blocked pattern (e.g., "password", "admin").');
  }

  // Block app/tenant names if provided
  if (appName && lowerCasePassword.includes(appName.toLowerCase())) {
    reasons.push('Password cannot contain the app name.');
  }
  if (tenantName && lowerCasePassword.includes(tenantName.toLowerCase())) {
    reasons.push('Password cannot contain your workspace name.');
  }

  const isValid = reasons.length === 0;
  let strength: ValidationResult['strength'] = 'Weak';
  if (isValid) {
      if (password.length >= 16 && categoryCount >= 4) {
          strength = 'Very Strong';
      } else if (password.length >= 14 && categoryCount >= 3) {
          strength = 'Strong';
      } else {
          strength = 'Okay';
      }
  } else {
      if(categoryCount === 2) strength = 'Okay';
  }


  return { isValid, reasons, strength };
}

/**
 * Provides a simplified strength indicator.
 * @param password The password to check.
 * @returns 'Weak', 'Okay', or 'Strong'.
 */
export const getPasswordStrength = (password: string): 'Weak' | 'Okay' | 'Strong' => {
  const length = password.length;
  const categoryCount = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password)
  ].filter(Boolean).length;

  if (length < 8 || categoryCount < 2) return 'Weak';
  if (length >= 12 && categoryCount >= 3) return 'Strong';
  return 'Okay';
};
