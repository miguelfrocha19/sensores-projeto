// SQL puro: CRUD completo da tabela sensors (SELECT/INSERT/UPDATE/DELETE).
// TODO — Fase 3.
// SQL puro: CRUD completo da tabela sensors (SELECT/INSERT/UPDATE/DELETE).
// TODO — Fase 3.
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { Sensor, SensorInput } from '../types/sensor';

const COLUMNS = 'id, name, location, min_threshold, max_threshold, is_active, created_at, updated_at';

function mapRowToSensor(row:RowDataPacket): Sensor{
    return{
    id: Number(row.id),
    name: row.name,
    location: row.location,
    min_threshold: Number(row.min_threshold),
    max_threshold: Number(row.max_threshold),
    is_active: Boolean(row.is_active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function findAll(): Promise<Sensor[]>{
    const [rows] = await pool.execute<RowDataPacket[]>(
     `SELECT ${COLUMNS} FROM sensors ORDER BY id`,    );
    return rows.map(mapRowToSensor);
}

export async function findById(id: number): Promise<Sensor | null>{
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT ${COLUMNS} FROM sensors WHERE id = ?`,
        [id],
        
    );
    if (rows.length === 0){
        return null;
    }
    return mapRowToSensor(rows[0]);
}

export async function create(input: SensorInput): Promise<number>{
    const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO sensors (name, location, min_threshold, max_threshold, is_active) VALUES (?, ?, ?, ?, ?)',
        [input.name, input.location, input.min_threshold, input.max_threshold, input.is_active],
  );
    return result.insertId;
}
export async function update(id: number, input: SensorInput): Promise<boolean>{
    const [result] = await pool.execute<ResultSetHeader>(
        'UPDATE sensors SET name = ?, location = ?, min_threshold = ?, max_threshold = ?, is_active = ? WHERE id = ?',
        [input.name, input.location, input.min_threshold, input.max_threshold, input.is_active, id],
    );
    return result.affectedRows > 0;
}

export async function remove(id: number, input: SensorInput):Promise<boolean>{
    const [result] = await pool.execute<ResultSetHeader>(
        `DELETE FROM sensores where id = ?`,
        [id],
    );
    return result.affectedRows > 0;
}