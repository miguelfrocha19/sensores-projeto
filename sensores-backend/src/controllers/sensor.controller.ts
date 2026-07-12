// Ponte req/res do CRUD. Chama o sensor.service.
// TODO — Fase 3.

// Ponte req/res do CRUD. Chama o sensor.service.
// TODO — Fase 3.
import { Request, Response } from 'express';
import * as sensorService from '../services/sensor.service';
import { HttpError } from '../utils/httpError';

type IdParams = {id:string};

function parseId (raw:string):number{
    const id = Number(raw);
    if(!Number.isInteger(id) || id <= 0){
        throw new HttpError(400, 'O id deve ser um número inteiro positivo.');
    }
    return id;
}
export async function list(_req: Request, res: Response): Promise<void> {
    const sensors = await sensorService.listSensors();
    res.status(200).json(sensors);
}


export async function getById(req: Request<IdParams>, res: Response):Promise<void>{
    const id = parseId(req.params.id);
    const sensor = await sensorService.getSensorById(id);
    res.status(200).json(sensor);
}
export async function create(req: Request, res: Response): Promise<void> {
  const sensor = await sensorService.createSensor(req.body);
  res.status(201).json(sensor);
}

export async function update(req: Request<IdParams>, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  const sensor = await sensorService.updateSensor(id, req.body);
  res.status(200).json(sensor);
}

export async function remove(req: Request<IdParams>, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  await sensorService.deleteSensor(id, req.body);
  res.status(204).send();
}