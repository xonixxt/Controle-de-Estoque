import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token inválido' });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default requireAuth;
