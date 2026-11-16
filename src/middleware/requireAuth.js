import jwt from 'jsonwebtoken';
import { getConfig } from '../config.js';

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Authentication required' });

  try {
    const payload = jwt.verify(match[1], getConfig().jwtSecret);
    if (typeof payload !== 'object' || typeof payload.id !== 'string' || typeof payload.email !== 'string') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
