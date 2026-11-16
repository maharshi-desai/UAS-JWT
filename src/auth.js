import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { getConfig } from './config.js';

export function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    getConfig().jwtSecret,
    { jwtid: randomUUID(), expiresIn: '1h' },
  );
}

export function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
