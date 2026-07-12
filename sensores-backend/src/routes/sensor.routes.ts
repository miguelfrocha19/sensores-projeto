// Rotas: GET/POST/PUT/DELETE em /sensors (escrita protegida por role).
// TODO — Fases 3 e 5.
import { Router } from 'express';
import * as sensorController from '../controllers/sensor.controller';

const router = Router();

router.get('/', sensorController.list);
router.get('/:id', sensorController.getById);
router.post('/', sensorController.create);
router.put('/:id', sensorController.update);
router.delete('/:id', sensorController.remove);

export default router;