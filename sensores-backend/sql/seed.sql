-- Dados iniciais: sensores e leituras de exemplo.
-- Usuarios (gerente/funcionario) sao criados na Fase 4, quando o bcrypt estiver disponivel.

-- ---------- Sensores ----------
INSERT INTO sensors (name, location, min_threshold, max_threshold, is_active) VALUES
  ('Camara Fria 01',      'Cozinha - Bloco A',   -5.00,   5.00, TRUE),
  ('Sala de Servidores',  'TI - 2o andar',       18.00,  27.00, TRUE),
  ('Estoque Refrigerado', 'Deposito - Bloco B',    2.00,   8.00, TRUE),
  ('Camara Fria 02',      'Cozinha - Bloco A',   -5.00,   5.00, FALSE);

-- ---------- Leituras ----------
-- recorded_at explicito pra que a ULTIMA leitura de cada sensor seja previsivel
-- (a Fase 6 calcula o status com base nela). Resultado esperado por sensor:
--   sensor 1 -> ALTO | sensor 2 -> NORMAL | sensor 3 -> BAIXO | sensor 4 -> SEM DADOS

INSERT INTO readings (sensor_id, temperature, recorded_at) VALUES
  -- Sensor 1 (Camara Fria 01, limites -5.00 a 5.00)
  (1,  2.50, '2026-07-09 08:00:00'),   -- normal
  (1, -6.20, '2026-07-09 10:00:00'),   -- baixo
  (1,  6.80, '2026-07-09 12:00:00'),   -- alto   <- ultima

  -- Sensor 2 (Sala de Servidores, limites 18.00 a 27.00)
  (2, 29.50, '2026-07-09 08:00:00'),   -- alto
  (2, 24.00, '2026-07-09 10:00:00'),   -- normal
  (2, 22.30, '2026-07-09 12:00:00'),   -- normal <- ultima

  -- Sensor 3 (Estoque Refrigerado, limites 2.00 a 8.00)
  (3,  5.00, '2026-07-09 08:00:00'),   -- normal
  (3,  8.90, '2026-07-09 10:00:00'),   -- alto
  (3,  1.20, '2026-07-09 12:00:00');   -- baixo  <- ultima

  -- Sensor 4 (Camara Fria 02) fica SEM leituras de proposito -> status "Sem dados"