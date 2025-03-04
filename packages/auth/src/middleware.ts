import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from './jwt';
import { AuthConfig, SessionUser } from './types';
import { hasPermission } from './roles';

export interface AuthenticatedRequest extends Request {
  user?: SessionUser;
}

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: SessionUser;
}

/**
 * Express authentication middleware
 */
export const createAuthMiddleware = (config: AuthConfig) => {
  const jwtService = new JWTService(config);

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = jwtService.extractTokenFromHeader(authHeader);
      const user = jwtService.verifyAccessToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

/**
 * Express permission middleware
 */
export const createPermissionMiddleware = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !hasPermission(user.role, permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

/**
 * Next.js authentication middleware
 */
export const withAuth = (config: AuthConfig) => {
  const jwtService = new JWTService(config);

  return (handler: NextApiHandler) => {
    return async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
      try {
        const authHeader = req.headers.authorization;
        const token = jwtService.extractTokenFromHeader(authHeader);
        const user = jwtService.verifyAccessToken(token);
        req.user = user;
        return handler(req, res);
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    };
  };
};

/**
 * Next.js permission middleware
 */
export const withPermission = (permission: string) => {
  return (handler: NextApiHandler) => {
    return (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
      const user = req.user;
      if (!user || !hasPermission(user.role, permission)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return handler(req, res);
    };
  };
};

/**
 * Combine multiple Next.js middleware functions
 */
export const combineMiddleware = (...middlewares: Array<(handler: NextApiHandler) => NextApiHandler>) => {
  return (handler: NextApiHandler) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
};

/**
 * Example usage:
 * 
 * Express:
 * ```typescript
 * app.use(createAuthMiddleware(config));
 * app.use('/admin', createPermissionMiddleware('admin:access'));
 * ```
 * 
 * Next.js:
 * ```typescript
 * export default combineMiddleware(
 *   withAuth(config),
 *   withPermission('users:manage')
 * )(handler);
 * ```
 */