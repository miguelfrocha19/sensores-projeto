// Lê e valida as variáveis de ambiente (.env). Exporta um objeto de config tipado.
// TODO — Fase 2.
import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string{
    const value = process.env[key];
    if (value === undefined || value === ''){
        throw new Error('Variável de ambiente ${key} não definida. Confira o seu arquivo .env');
    }
    return value;
}

export const env = {
  port: Number(requireEnv('PORT')),
  db: {
    host: requireEnv('DB_HOST'),
    port: Number(requireEnv('DB_PORT')),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    name: requireEnv('DB_NAME'),
  },
  jwtSecret: requireEnv('JWT_SECRET'),
};