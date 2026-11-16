import express from 'express';
import { authRoutes } from './routes/authRoutes.js';

export const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

app.get('/', (_req, res) => {
  res.json({ message: 'User Authentication API' });
});

app.use(authRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Request body must contain valid JSON' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});
