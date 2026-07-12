// Cria e exporta o pool de conexão com o MySQL (mysql2/promise).
// TODO — Fase 2.
import mysql from 'mysql2/promise';
import { env } from './env';

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection():Promise<void>{
    const connection = await pool.getConnection();
    try{
        await connection.ping();
        console.log('Conectado ao MySQL');
    } finally{
        connection.release();
    }
}
export default pool;