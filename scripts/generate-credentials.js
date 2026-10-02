const crypto = require('crypto');

// 1. Senha do Banco segura e URL-safe (sem caracteres especiais como / ? # @ que quebram parsing de URL)
const dbPassword = crypto.randomBytes(24).toString('base64url');

// 2. JWT Secret robusto (64 bytes = 512 bits)
const jwtSecret = crypto.randomBytes(48).toString('base64url');

// Função auxiliar para gerar JWT HS256 assinado nativamente com crypto
function generateHS256JWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const now = Math.floor(Date.now() / 1000);
const exp = now + 10 * 365 * 24 * 60 * 60; // 10 anos de validade

const anonKey = generateHS256JWT(
  {
    role: 'anon',
    iss: 'colegio-favo',
    iat: now,
    exp: exp,
  },
  jwtSecret
);

const serviceRoleKey = generateHS256JWT(
  {
    role: 'service_role',
    iss: 'colegio-favo',
    iat: now,
    exp: exp,
  },
  jwtSecret
);

const credentials = {
  POSTGRES_USER: 'postgres',
  POSTGRES_PASSWORD: dbPassword,
  POSTGRES_DB: 'postgres',
  JWT_SECRET: jwtSecret,
  SUPABASE_ANON_KEY: anonKey,
  SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
  CONNECTION_STRINGS: {
    TUNNEL_LOCAL_DEV: `postgresql://postgres:${dbPassword}@localhost:5432/postgres?schema=public`,
    VPS_HOST_DIRECT: `postgresql://postgres:${dbPassword}@127.0.0.1:5436/postgres?schema=public`,
    VPS_DOCKER_NETWORK: `postgresql://postgres:${dbPassword}@favo-postgres-16:5432/postgres?schema=public`,
  },
};

console.log(JSON.stringify(credentials, null, 2));
