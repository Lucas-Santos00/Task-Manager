# SprintBoard

Board Kanban para gestão de sprints — 4 devs, sem login, deploy na Vercel + Supabase.

## Deploy em 5 passos

### 1. Criar projeto no Supabase

- Acesse [supabase.com](https://supabase.com) → **New project**
- Anote o **Project URL** e a **anon key** (em Settings → API)

### 2. Rodar o SQL de setup

- No Supabase: **SQL Editor** → cole o conteúdo de `supabase-setup.sql` → **Run**
- Isso cria as tabelas, políticas públicas e dados de exemplo

### 3. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 4. Rodar localmente

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 5. Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Ou pelo site: [vercel.com](https://vercel.com) → Import Git Repository  
Adicione as duas variáveis de ambiente no painel da Vercel.

---

## Time

| Dev   | Cor    |
|-------|--------|
| Ana   | Azul   |
| Bruno | Roxo   |
| Carla | Verde  |
| Diego | Rosa   |

Para adicionar membros: edite `MEMBERS` em `TaskModal.tsx`, `SprintHeader.tsx` e `TaskCard.tsx`.

## Funcionalidades

- Criar e gerenciar sprints com datas e objetivo
- Board Kanban com 4 colunas: Backlog → Em andamento → Revisão → Concluído
- Criar, editar, mover e excluir tarefas
- Prioridade (Alta/Média/Baixa), story points, responsável
- **Atualização em tempo real** via Supabase Realtime — mudanças de um usuário aparecem para todos
- Barra de progresso do sprint no topo
- Contador de dias restantes
