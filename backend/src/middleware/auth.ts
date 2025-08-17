import type { Request, Response, NextFunction } from 'express';
import { getUserFromToken } from '../services/supabase';
export interface AuthedRequest extends Request { user?: { id: string; email?: string }; }
export async function supaAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const bearer = (req.headers?.authorization as string | undefined) ?? '';
  const user = await getUserFromToken(bearer);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  req.user = { id: user.id, email: user.email ?? undefined };
  next();
}