import { JwtPayload } from 'jsonwebtoken';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiry: string;
  refreshTokenExpiry: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}