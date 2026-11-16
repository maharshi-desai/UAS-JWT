import 'dotenv/config';

export function getConfig() {
  const { DATABASE_URL, JWTSECRET } = process.env;
  if (!DATABASE_URL) throw new Error('DATABASE_URL must be set');
  if (!JWTSECRET) throw new Error('JWTSECRET must be set');

  return {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: JWTSECRET,
  };
}
