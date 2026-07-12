# Projeto Sensores de Temperatura

Mini-projeto de estudo. Dois usuários com permissões
diferentes:

- **Gerente** — CRUD completo de sensores.
- **Funcionário** — apenas consulta o status dos sensores.

> **Sobre os arquivos:** eles vêm como stubs. Cada arquivo-fonte tem no topo um
> comentário dizendo **para que serve** e **em qual fase** você o preenche. Os
> arquivos de configuração (`package.json`, `tsconfig.json`, etc.) estão vazios
> de propósito — você os inicializa na Fase 0. Nada de código de implementação
> foi gerado; isso a gente faz arquivo por arquivo, sob demanda.

---

## Arquitetura do backend


```
rota -> controller -> service -> repository -> banco
```

- **routes** — mapeiam URL + verbo + middleware + controller.
- **middlewares** — autenticação, checagem de role, tratamento de erro.
- **controllers** — só cuidam de `req`/`res`. Camada fina.
- **services** — regra de negócio. Não conhecem HTTP.
- **repositories** — os *únicos* arquivos que escrevem SQL.
- **config / types** — conexão e variáveis de ambiente / tipos do domínio.

---

## Modelo de dados

**users** — `id`, `name`, `email` (único), `password_hash`, `role`
(`'gerente' | 'funcionario'`), `created_at`.

**sensors** — `id`, `name`, `location`, `min_threshold`, `max_threshold`,
`is_active`, `created_at`, `updated_at`.

**readings** — `id`, `sensor_id` (FK -> sensors), `temperature`, `recorded_at`.

O **status** que o funcionário consulta é uma regra de negócio: pega a última
leitura e compara com os thresholds -> *Normal*, *Alto*, *Baixo* ou *Sem dados*.

Onde cada SQL do guia aparece: **JOIN** ao listar leituras com o nome do sensor;
**WHERE** ao filtrar por sensor/período; **GROUP BY** ao calcular média/mín/máx
por sensor.

---

## Estrutura — backend

```
sensores-backend/
├── src/
│   ├── config/
│   │   ├── env.ts            # lê e valida as variáveis de ambiente (.env)
│   │   └── database.ts       # cria o pool de conexão com o MySQL
│   ├── types/
│   │   ├── user.ts           # interface User + type Role
│   │   ├── sensor.ts         # interface Sensor
│   │   └── reading.ts        # interface Reading + tipo do status
│   ├── utils/
│   │   ├── httpError.ts      # erro que carrega um status code (404, 403...)
│   │   └── jwt.ts            # assinar e verificar o token
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # valida o token e anexa o usuário ao req
│   │   ├── role.middleware.ts    # 403 se não for gerente
│   │   └── error.middleware.ts   # captura erros e devolve o status/JSON certo
│   ├── repositories/
│   │   ├── user.repository.ts     # SQL: buscar usuário por email
│   │   ├── sensor.repository.ts   # SQL: CRUD da tabela sensors
│   │   └── reading.repository.ts  # SQL: inserir leitura + JOIN/GROUP BY
│   ├── services/
│   │   ├── auth.service.ts     # login: confere senha e gera token
│   │   ├── sensor.service.ts   # regras de negócio do CRUD
│   │   └── reading.service.ts  # calcula o status vs thresholds
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── sensor.controller.ts
│   │   └── reading.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts      # POST /auth/login
│   │   ├── sensor.routes.ts    # GET/POST/PUT/DELETE /sensors
│   │   ├── reading.routes.ts   # /sensors/:id/status, /readings
│   │   └── index.ts            # junta todas as rotas
│   ├── app.ts                 # monta o Express + middlewares globais
│   └── server.ts              # ponto de entrada: sobe o servidor
├── sql/
│   ├── schema.sql             # CREATE TABLE das três tabelas
│   └── seed.sql               # dados iniciais
├── .env.example
├── tsconfig.json
├── package.json
└── Dockerfile
```

---

## Estrutura — frontend

```
sensores-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # layout raiz (html/body, providers)
│   │   ├── page.tsx               # home: redireciona login/dashboard
│   │   ├── login/
│   │   │   └── page.tsx           # "use client": formulário de login
│   │   └── (dashboard)/           # route group: agrupa sem virar segmento
│   │       ├── layout.tsx         # nav + verificação de sessão
│   │       ├── sensores/
│   │       │   ├── page.tsx       # lista de sensores com status
│   │       │   └── [id]/
│   │       │       └── page.tsx   # detalhe/histórico (rota dinâmica)
│   │       └── gerenciar/
│   │           └── page.tsx       # CRUD — só o gerente
│   ├── components/
│   │   ├── Nav.tsx                # itens mudam conforme a role
│   │   ├── SensorCard.tsx         # card de status (props)
│   │   ├── SensorTable.tsx        # tabela de sensores
│   │   └── SensorForm.tsx         # formulário de criar/editar
│   ├── hooks/
│   │   └── useSensors.ts          # useState + useEffect para buscar dados
│   ├── lib/
│   │   ├── api.ts                 # wrapper de fetch (base URL + token)
│   │   └── auth.ts                # guardar/ler token e role no client
│   └── types/
│       └── index.ts               # tipos compartilhados
├── .env.local.example
├── tsconfig.json
├── package.json
└── next.config.js
```

