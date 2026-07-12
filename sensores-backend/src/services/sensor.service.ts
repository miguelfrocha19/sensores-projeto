import * as sensorRepository from '../repositories/sensor.repository';
import { HttpError } from '../utils/httpError';
import { Sensor, SensorInput } from '../types/sensor';

function parseSensorInput(body: unknown): SensorInput {
  const { name, location, min_threshold, max_threshold, is_active } =
    (body ?? {}) as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim() === '') {
    throw new HttpError(400, 'O campo "name" é obrigatório.');
  }
  if (typeof location !== 'string' || location.trim() === '') {
    throw new HttpError(400, 'O campo "location" é obrigatório.');
  }

  const min = Number(min_threshold);
  const max = Number(max_threshold);
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new HttpError(400, 'Os campos "min_threshold" e "max_threshold" devem ser números.');
  }
  if (min >= max) {
    throw new HttpError(400, 'O "min_threshold" deve ser menor que o "max_threshold".');
  }
  if (is_active !== undefined && typeof is_active !== 'boolean') {
    throw new HttpError(400, 'O campo "is_active" deve ser booleano.');
  }

  return {
    name: name.trim(),
    location: location.trim(),
    min_threshold: min,
    max_threshold: max,
    is_active: is_active ?? true,
  };
}

export async function listSensors(): Promise<Sensor[]> {
  return sensorRepository.findAll();
}

export async function getSensorById(id: number):Promise<Sensor>{
    const sensor = await sensorRepository.findById(id);
    if (sensor === null){
        throw new HttpError(404, `Sensor ${id} não encontrado.`);
    }
    return sensor;
}

export async function createSensor(body:unknown):Promise<Sensor>{
    const input = parseSensorInput(body);
    const newId = await sensorRepository.create(input);
    return getSensorById(newId);
}
export async function updateSensor(id:number, body: unknown): Promise<Sensor>{
    const input = parseSensorInput(body);
    const updated = await sensorRepository.update(id, input);
    if (!updated){
        throw new HttpError(404, `Sensor ${id} não encontrado.`);
    }        
    return getSensorById(id);
}
export async function deleteSensor(id:number, body:unknown): Promise<Sensor>{
    const input = parseSensorInput(body);
    const deleted = await sensorRepository.remove(id, input);
    if(!deleted){
        throw new HttpError(404, `Sensor ${id} não encontrado`);
    }
    
}