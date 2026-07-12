# Projeto Sensores de Temperatura

Mini-projeto de estudo para a stack da SyOS. Dois usuários com permissões
diferentes:

- **Gerente** — CRUD completo de sensores.
- **Funcionário** — apenas consulta o status dos sensores.

O backend (Express + MySQL) espelha o mundo do **Besashi Server**; o frontend
(Next.js App Router) espelha o mundo do **Super Easy**.

> **Sobre os arquivos:** eles vêm como stubs. Cada arquivo-fonte tem no topo um
> comentário dizendo **para que serve** e **em qual fase** você o preenche. Os
> arquivos de configuração (`package.json`, `tsconfig.json`, etc.) estão vazios
> de propósito — você os inicializa na Fase 0. Nada de código de implementação
> foi gerado; isso a gente faz arquivo por arquivo, sob demanda.

---

## Arquitetura do backend

Arquitetura em camadas (o mesmo padrão que o NestJS te obriga a seguir no Super
Easy, aqui feito na mão para você entender *por que* ele existe):

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

---

## Redis e RabbitMQ (só o conceito)

- **Redis (cache/sessão)** — a tela de status é consultada o tempo todo. Guardar
  o último status por sensor num cache com expiração evita bater no MySQL a cada
  acesso. (Ou guardar as sessões de login.)
- **RabbitMQ (filas)** — quando uma leitura passa do `max_threshold`, publica-se
  uma mensagem numa fila em vez de mandar notificação na hora; um consumidor
  separado processa depois. Desacoplamento.

Não precisam ser implementados no escopo — apenas saber onde encaixariam.

---

## Fases de desenvolvimento

| Fase | O que fazer |
|------|-------------|
| 0 | Preparação: pastas, `package.json`, `tsconfig.json`, `docker-compose` só com MySQL. |
| 1 | Banco: `schema.sql` + `seed.sql` (CREATE TABLE, FK, ENUM). |
| 2 | Config e tipos: `env.ts`, `database.ts`, `types/`. |
| 3 | Fatia vertical: CRUD de sensores **sem auth** (repo -> service -> controller -> rota). |
| 4 | Autenticação: usuários, login, hash de senha, JWT, `auth.middleware`. |
| 5 | Proteção por role: `role.middleware` nas rotas de escrita. 401 vs 403. |
| 6 | Leituras e status: JOIN e GROUP BY. |
| 7 | Redis e RabbitMQ (conceito): marcar onde encaixam. |
| 8 | Frontend: login (`"use client"`, useState, `lib/api.ts`). |
| 9 | Frontend: lista de status (funcionário) com `useSensors`/`useEffect`. |
| 10 | Frontend: gerenciamento (gerente) com `SensorForm` (POST/PUT/DELETE). |
| 11 | Docker Compose completo: MySQL + backend + frontend. |
| 12 | Acabamento: erros, mensagens, estilo. |

---

## Mapa: tópico do guia -> onde pratica

- const/let, arrow, destructuring, spread/rest, import/export -> o projeto todo.
- async/await, Promises -> Fases 3 a 6.
- TypeScript (tipos, interface, type, generics) -> Fase 2 em diante.
- HTTP / verbos / status codes / JSON -> Fases 3, 5, 6.
- Node event loop + CommonJS -> Fase 0/3.
- Express (middleware, rota, req/res) -> Fases 3, 4, 5.
- SQL (SELECT, JOIN, WHERE, GROUP BY) -> Fases 1 e 6.
- Redis e RabbitMQ (propósito) -> Fase 7.
- React (componentes, props, state, hooks, SPA) -> Fases 8, 9, 10.
- Next.js App Router (pastas, Server vs Client, layouts) -> Fases 8 a 10.
- Docker (container, docker compose up) -> Fases 0 e 11.

Ponte para o dia a dia: na Fase 9 você busca dados com `useEffect` na mão. No
Super Easy isso é **TanStack Query**. Trocar o `useSensors` por TanStack Query
ao final é o próximo passo natural.

---

## Como trabalhar

Siga as fases na ordem. Quando for atacar um arquivo, peça a especificação dele
— você recebe o que aquele código precisa conter (funções, responsabilidades, o
que importar, casos a tratar), escreve, e manda para revisão.
