import { UserRole } from './types';

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  MODERATOR: 'moderator' as UserRole,
  USER: 'user' as UserRole,
};

export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.MODERATOR]: 2,
  [ROLES.USER]: 1,
};

interface PermissionMap {
  [key: string]: {
    roles: UserRole[];
    description: string;
  };
}

export const PERMISSIONS: PermissionMap = {
  'crews:create': {
    roles: [ROLES.ADMIN, ROLES.USER],
    description: 'Create new AI crews',
  },
  'crews:manage': {
    roles: [ROLES.ADMIN],
    description: 'Manage all AI crews',
  },
  'crews:delete': {
    roles: [ROLES.ADMIN],
    description: 'Delete AI crews',
  },
  'agents:create': {
    roles: [ROLES.ADMIN, ROLES.USER],
    description: 'Create new AI agents',
  },
  'agents:manage': {
    roles: [ROLES.ADMIN],
    description: 'Manage all AI agents',
  },
  'tasks:create': {
    roles: [ROLES.ADMIN, ROLES.USER],
    description: 'Create new tasks',
  },
  'tasks:manage': {
    roles: [ROLES.ADMIN, ROLES.MODERATOR],
    description: 'Manage all tasks',
  },
  'users:manage': {
    roles: [ROLES.ADMIN],
    description: 'Manage user accounts',
  },
  'settings:manage': {
    roles: [ROLES.ADMIN],
    description: 'Manage system settings',
  },
};

/**
 * Check if a user has permission to perform an action
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissionConfig = PERMISSIONS[permission];
  if (!permissionConfig) {
    return false;
  }
  return permissionConfig.roles.includes(userRole);
}

/**
 * Check if a role has higher or equal hierarchy than another role
 */
export function hasHigherOrEqualRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[targetRole];
}

/**
 * Get all permissions available for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return Object.entries(PERMISSIONS)
    .filter(([_, config]) => config.roles.includes(role))
    .map(([permission]) => permission);
}

/**
 * Validate if a role exists
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(ROLES).includes(role as UserRole);
}