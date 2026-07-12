// Ponto de entrada: importa o app e sobe o servidor numa porta.
// TODO — Fase 3.
import app from './app';
import { env } from './config/env';
import { testConnection } from './config/database';
import { setRandomFallback } from 'bcryptjs';


async function start():Promise<void>{
    await testConnection();

    app.listen(env.port, () => {
        console.log(`Servidor rodando em htpp://localhost:${env.port}`);
    });
}
start().catch((error) => {
    console.error('Falha ao iniciar o servidor: ', error);
    process.exit(1);
});