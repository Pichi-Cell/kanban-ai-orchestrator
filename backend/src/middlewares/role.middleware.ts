import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Missing user context' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: `Forbidden: Requires ${requiredRole} role` });
    }

    next();
  };
};
