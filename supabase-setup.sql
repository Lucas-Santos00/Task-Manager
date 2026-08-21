-- SprintBoard — Setup completo do banco de dados
-- Execute este SQL no Supabase > SQL Editor

-- Tabela de sprints
create table if not exists sprints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  goal text,
  is_active boolean default false,
  created_at timestamptz default now()
);

-- Tabela de tarefas
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid references sprints(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'backlog'
    check (status in ('backlog','in_progress','review','done')),
  priority text not null default 'medium'
    check (priority in ('low','medium','high')),
  assignee text
    check (assignee in ('Ana','Bruno','Carla','Diego') or assignee is null),
  story_points int check (story_points >= 0 and story_points <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índice para busca por sprint
create index if not exists tasks_sprint_id_idx on tasks(sprint_id);
create index if not exists tasks_status_idx on tasks(status);

-- RLS: habilitar e permitir acesso total (sem login)
alter table sprints enable row level security;
alter table tasks enable row level security;

-- Política pública: qualquer um pode ler e escrever
create policy "public_all_sprints" on sprints
  for all using (true) with check (true);

create policy "public_all_tasks" on tasks
  for all using (true) with check (true);

-- Realtime: habilitar para tasks
alter publication supabase_realtime add table tasks;

-- Gatilho para updated_at automático
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- Dados de exemplo (opcional — remova se não quiser)
do $$
declare
  sprint_id uuid;
begin
  insert into sprints (name, start_date, end_date, goal, is_active)
  values ('Sprint 1 — Setup', current_date, current_date + 14, 'Estrutura base do projeto funcionando', true)
  returning id into sprint_id;

  insert into tasks (sprint_id, title, description, status, priority, assignee, story_points) values
    (sprint_id, 'Configurar ambiente de desenvolvimento', 'Instalar dependências e rodar localmente', 'done', 'high', 'Bruno', 3),
    (sprint_id, 'Definir arquitetura do banco de dados', 'Modelar tabelas e relacionamentos no Supabase', 'done', 'high', 'Ana', 5),
    (sprint_id, 'Implementar autenticação', null, 'in_progress', 'medium', 'Carla', 8),
    (sprint_id, 'Criar tela de listagem de tarefas', null, 'review', 'medium', 'Diego', 5),
    (sprint_id, 'Escrever testes unitários', null, 'backlog', 'low', null, 3),
    (sprint_id, 'Deploy na Vercel', 'Configurar variáveis de ambiente e domínio', 'backlog', 'high', 'Bruno', 2);
end;
$$;
