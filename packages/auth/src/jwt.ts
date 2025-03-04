import jwt from 'jsonwebtoken';
import { AuthTokens, SessionUser, RefreshTokenPayload, AuthConfig } from './types';

export class JWTService {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  /**
   * Generate access and refresh tokens for a user
   */
  generateTokens(user: SessionUser): AuthTokens {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate an access token
   */
  private generateAccessToken(user: SessionUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      this.config.jwtSecret,
      { expiresIn: this.config.jwtExpiry }
    );
  }

  /**
   * Generate a refresh token
   */
  private generateRefreshToken(userId: string): string {
    const payload: RefreshTokenPayload = {
      userId,
      tokenVersion: Date.now(),
    };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.refreshTokenExpiry,
    });
  }

  /**
   * Verify an access token
   */
  verifyAccessToken(token: string): SessionUser {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as SessionUser;
      return decoded;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  /**
   * Verify a refresh token
   */
  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as RefreshTokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No token found in Authorization header');
    }

    return authHeader.split(' ')[1];
  }

  /**
   * Decode a token without verification
   */
  decodeToken<T extends object>(token: string): T {
    try {
      const decoded = jwt.decode(token) as T;
      if (!decoded) {
        throw new Error('Failed to decode token');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Check if a token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken<{ exp: number }>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }
}

export const createJWTService = (config: AuthConfig): JWTService => {
  return new JWTService(config);
};