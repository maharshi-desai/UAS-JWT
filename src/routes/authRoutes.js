import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db.js';
import { createToken, normalizeEmail, publicUser } from '../auth.js';

export const authRoutes = Router();

authRoutes.post('/signup', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password must be strings' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  if (name !== undefined && name !== null && typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be a string' });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) return res.status(409).json({ error: 'Email is already registered' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        ...(typeof name === 'string' && name.trim() ? { name: name.trim() } : {}),
      },
    });
    return res.status(201).json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    throw error;
  }
});

authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required as strings' });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
  if (!user || !passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.status(200).json({ user: publicUser(user), token: createToken(user) });
});
