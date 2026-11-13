-- MY WAQIT: initial schema.
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- All access goes through the backend (service role key). Row Level Security is
-- enabled on every table with NO public policies, so the browser (anon key) can
-- read or write nothing directly.

create table if not exists public.profiles (
  telegram_id   bigint primary key,
  first_name    text not null default '',
  last_name     text,
  username      text,
  language      text not null default 'kaa' check (language in ('kaa', 'uz', 'ru')),
  timezone      text not null default 'Asia/Tashkent',
  plan          text not null default 'free' check (plan in ('free', 'pro')),
  plan_until    timestamptz,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);

create table if not exists public.tasks (
  id                uuid primary key default gen_random_uuid(),
  telegram_id       bigint not null references public.profiles (telegram_id) on delete cascade,
  title             text not null check (char_length(title) between 1 and 200),
  description       text not null default '' check (char_length(description) <= 2000),
  start_date        date not null,
  start_time        time not null,
  reminder_minutes  integer not null default 30 check (reminder_minutes between 0 and 10080),
  repeat            text not null default 'none'
                    check (repeat in ('none', 'daily', 'weekly', 'monthly', 'yearly', 'weekdays')),
  repeat_days       smallint[] not null default '{}',   -- 0 = Monday ... 6 = Sunday
  category          text not null default 'personal'
                    check (category in ('personal', 'work', 'study', 'sport', 'other')),
  location          text not null default '',
  note              text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists tasks_user_idx on public.tasks (telegram_id);

-- One row per completed occurrence of a task.
create table if not exists public.task_done (
  task_id    uuid not null references public.tasks (id) on delete cascade,
  done_date  date not null,
  primary key (task_id, done_date)
);

-- One row per reminder already sent, so a reminder is never sent twice.
create table if not exists public.reminder_log (
  task_id        uuid not null references public.tasks (id) on delete cascade,
  occurrence     date not null,
  sent_at        timestamptz not null default now(),
  primary key (task_id, occurrence)
);

alter table public.profiles     enable row level security;
alter table public.tasks        enable row level security;
alter table public.task_done    enable row level security;
alter table public.reminder_log enable row level security;
