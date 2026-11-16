import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const userRoutes = Router();

userRoutes.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json({ user });
});

userRoutes.get('/dashboard', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { email: true, name: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json({ message: `Welcome, ${user.name?.trim() || user.email}!` });
});
