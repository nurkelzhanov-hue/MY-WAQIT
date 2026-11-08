-- MY WAQIT: initial schema (stage 1)
-- Access model: only the backend (service role) reads/writes data.
-- RLS is enabled on every table and no public policies are created.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- users
create table public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null unique,
  name text,
  username text,
  language text not null default 'kaa' check (language in ('kaa', 'uz', 'ru')),
  timezone text not null default 'Asia/Tashkent',
  location text not null default 'Nukus',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- user_settings
create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  language text not null default 'kaa' check (language in ('kaa', 'uz', 'ru')),
  timezone text not null default 'Asia/Tashkent',
  daily_summary_enabled boolean not null default true,
  daily_summary_time time not null default '08:00',
  prayer_reminders_enabled boolean not null default true,
  audio_reminders_enabled boolean not null default true,
  text_reminders_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  task_date date not null,
  start_time time,
  end_time time,
  location text,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'done', 'postponed', 'cancelled')),
  recurrence_rule text not null default 'none',
  reminder_minutes integer not null default 30 check (reminder_minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_user_date_idx on public.tasks (user_id, task_date);

-- recurring_tasks
create table public.recurring_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  recurrence_type text not null
    check (recurrence_type in ('daily', 'weekly', 'monthly', 'yearly', 'custom_days')),
  recurrence_days integer[],
  recurrence_end date,
  created_at timestamptz not null default now()
);
create index recurring_tasks_user_idx on public.recurring_tasks (user_id);

-- reminders
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  reminder_at timestamptz not null,
  reminder_type text not null default 'task'
    check (reminder_type in ('task', 'daily_summary', 'prayer')),
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'cancelled')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index reminders_due_idx on public.reminders (status, reminder_at);
create index reminders_user_idx on public.reminders (user_id);

-- prayer_times (API names: fajr, dhuhr, asr, maghrib, isha)
create table public.prayer_times (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  location text not null,
  prayer_date date not null,
  fajr time not null,
  dhuhr time not null,
  asr time not null,
  maghrib time not null,
  isha time not null,
  created_at timestamptz not null default now(),
  unique (user_id, prayer_date)
);

-- ai_conversations
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  created_at timestamptz not null default now()
);
create index ai_conversations_user_idx on public.ai_conversations (user_id, created_at);

-- ai_actions
create table public.ai_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  action_type text not null,
  task_id uuid references public.tasks(id) on delete set null,
  action_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index ai_actions_user_idx on public.ai_actions (user_id, created_at);

-- updated_at triggers
create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings
  for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- Row Level Security: enabled everywhere, no public policies
alter table public.users enable row level security;
alter table public.user_settings enable row level security;
alter table public.tasks enable row level security;
alter table public.recurring_tasks enable row level security;
alter table public.reminders enable row level security;
alter table public.prayer_times enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_actions enable row level security;

-- No direct access for public roles (service role bypasses RLS)
revoke all on all tables in schema public from anon, authenticated;
