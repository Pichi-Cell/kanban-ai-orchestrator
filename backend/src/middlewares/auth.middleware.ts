import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey', (err, user) => {
      // Return 403 Forbidden on token error
      if (err) return res.sendStatus(403); 

      req.user = user as AuthenticatedRequest['user'];
      next();
    });
  } else {
    // 401 Unauthorized if no token
    res.sendStatus(401);
  }
};
