import { SessionUser, AuthTokens } from './types';
import { JWTService } from './jwt';

export interface SessionStore {
  set(key: string, value: any, expiresIn?: number): Promise<void>;
  get(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

export class SessionManager {
  private jwtService: JWTService;
  private sessionStore: SessionStore;
  private readonly SESSION_PREFIX = 'session:';
  private readonly REFRESH_PREFIX = 'refresh:';

  constructor(jwtService: JWTService, sessionStore: SessionStore) {
    this.jwtService = jwtService;
    this.sessionStore = sessionStore;
  }

  /**
   * Create a new session for a user
   */
  async createSession(user: SessionUser): Promise<AuthTokens> {
    const tokens = this.jwtService.generateTokens(user);
    
    // Store session data
    await this.sessionStore.set(
      this.getSessionKey(user.id),
      {
        user,
        accessToken: tokens.accessToken
      },
      24 * 60 * 60 // 24 hours
    );

    // Store refresh token
    await this.sessionStore.set(
      this.getRefreshKey(tokens.refreshToken),
      {
        userId: user.id,
        tokenVersion: Date.now()
      },
      7 * 24 * 60 * 60 // 7 days
    );

    return tokens;
  }

  /**
   * Get session data for a user
   */
  async getSession(userId: string): Promise<SessionUser | null> {
    const sessionData = await this.sessionStore.get(this.getSessionKey(userId));
    return sessionData?.user || null;
  }

  /**
   * Validate a session
   */
  async validateSession(userId: string, accessToken: string): Promise<boolean> {
    const sessionData = await this.sessionStore.get(this.getSessionKey(userId));
    if (!sessionData) {
      return false;
    }
    return sessionData.accessToken === accessToken;
  }

  /**
   * Refresh a session using a refresh token
   */
  async refreshSession(refreshToken: string): Promise<AuthTokens | null> {
    const refreshData = await this.sessionStore.get(
      this.getRefreshKey(refreshToken)
    );

    if (!refreshData) {
      return null;
    }

    // Get current session
    const sessionData = await this.sessionStore.get(
      this.getSessionKey(refreshData.userId)
    );

    if (!sessionData) {
      return null;
    }

    // Generate new tokens
    const tokens = this.jwtService.generateTokens(sessionData.user);

    // Update session with new access token
    await this.sessionStore.set(
      this.getSessionKey(refreshData.userId),
      {
        user: sessionData.user,
        accessToken: tokens.accessToken
      },
      24 * 60 * 60
    );

    // Store new refresh token
    await this.sessionStore.set(
      this.getRefreshKey(tokens.refreshToken),
      {
        userId: refreshData.userId,
        tokenVersion: Date.now()
      },
      7 * 24 * 60 * 60
    );

    // Delete old refresh token
    await this.sessionStore.delete(this.getRefreshKey(refreshToken));

    return tokens;
  }

  /**
   * Invalidate a user's session
   */
  async invalidateSession(userId: string): Promise<void> {
    await this.sessionStore.delete(this.getSessionKey(userId));
  }

  /**
   * Invalidate a refresh token
   */
  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    await this.sessionStore.delete(this.getRefreshKey(refreshToken));
  }

  private getSessionKey(userId: string): string {
    return `${this.SESSION_PREFIX}${userId}`;
  }

  private getRefreshKey(refreshToken: string): string {
    return `${this.REFRESH_PREFIX}${refreshToken}`;
  }
}

export const createSessionManager = (
  jwtService: JWTService,
  sessionStore: SessionStore
): SessionManager => {
  return new SessionManager(jwtService, sessionStore);
};