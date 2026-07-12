// interface User e type Role ('gerente' | 'funcionario').
// TODO — Fase 2.
export type Role = 'gerente' | 'funcionario';

export interface User{
    id: number;
    name: string;
    email:string;
    password_hash: string;
    role: Role;
    created_at: Date;
}