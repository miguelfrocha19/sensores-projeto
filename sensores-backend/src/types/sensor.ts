// interface Sensor (id, name, location, min/max_threshold, is_active, timestamps).
// TODO — Fase 2.
export interface Sensor{
    id: number;
    name: string;
    location: string;
    min_threshold: number;
    max_threshold: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export type SensorInput = Omit<Sensor, 'id' |'created_at'|'updated_at'>;
