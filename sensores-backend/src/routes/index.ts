// Junta todas as rotas (auth, sensor, reading) num router só.
// TODO — Fase 3.
import { Router, Request, Response } from 'express';
import sensorRoutes from './sensor.routes';

const router = Router();

router.get('/health', (_req: Request, res:Response) => {
    res.status(200).json({ status: 'ok' });
});

router.use('/sensors', sensorRoutes);

export default router;
