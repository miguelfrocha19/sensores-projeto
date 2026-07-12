// Monta o Express e registra os middlewares globais (json, cors, rotas, erro).
// TODO — Fase 3.
import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use((_req: Request, res: Response) => {
    res.status(404).json({error: 'Rota não encontrada'});
});
app.use(errorMiddleware);
export default app;