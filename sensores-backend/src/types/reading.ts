// interface Reading e o type do status calculado ('normal' | 'alto' | 'baixo' | 'sem_dados').
// TODO — Fase 2.
export interface Reading {
  id: number;
  sensor_id: number;
  temperature: number;
  recorded_at: Date;
}
export type SensorStatus= 'normal'| 'alto' | 'baixo'|'sem_dados';