import { app } from './app.js';
import { getConfig } from './config.js';
import { prisma } from './db.js';

let config;
try {
  config = getConfig();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const server = app.listen(config.port, () => {
  console.log(`Authentication API listening on port ${config.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
