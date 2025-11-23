/**
 * Application-wide constants
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'QASA Platform';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0';
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'qasa-theme',
  USER_PREFERENCES: 'qasa-user-preferences',
  AUTH_TOKEN: 'qasa-auth-token',
} as const;

/**
 * Query keys for React Query
 */
export const QUERY_KEYS = {
  USER: 'user',
  AUDITS: 'audits',
  AUDIT_DETAIL: 'audit-detail',
  INCIDENTS: 'incidents',
  FLOORS: 'floors',
  INVENTORY: 'inventory',
  APARTMENTS: 'apartments',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUDITS: '/audits',
  AUDIT_DETAIL: (id: string) => `/audits/${id}`,
  INCIDENTS: '/incidents',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LOGIN: '/login',
} as const;

/**
 * Breakpoints (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Animation durations (in ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
