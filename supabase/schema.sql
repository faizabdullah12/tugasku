create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  nim text not null unique,
  major text not null,
  semester text not null,
  academic_week integer not null default 1,
  avatar_url text,
  logo_url text,
  role text not null default 'mahasiswa' check (role in ('mahasiswa', 'dosen'))
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  color text not null default 'primary',
  lecturer_name text not null
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  deadline_at timestamptz not null,
  weight numeric(5,2) not null default 0,
  file_format text not null default '',
  max_size text not null default '',
  created_at timestamptz not null default now()
);

create table public.lecturers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nip text,
  role text,
  avatar_url text,
  quote text
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  lecturer_id uuid references public.lecturers(id) on delete set null,
  submission_id text not null unique,
  file_name text not null,
  file_path text not null,
  file_size bigint not null default 0,
  file_type text not null default '',
  sha256_hash text,
  github_url text,
  notes text,
  version integer not null default 1,
  status text not null default 'menunggu-nilai' check (status in ('belum-dikumpul', 'draf', 'menunggu-nilai', 'dinilai')),
  score numeric(5,2),
  max_score numeric(5,2) not null default 100,
  grade text,
  revision_attempts_left integer not null default 2,
  submitted_at timestamptz not null default now()
);

create table public.rubrics (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  number text not null,
  title text not null,
  score numeric(5,2) not null default 0,
  max_score numeric(5,2) not null default 0,
  badge_text text not null default '',
  badge_type text not null default 'indigo',
  description text not null default '',
  percentage numeric(5,2) not null default 0
);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.tasks enable row level security;
alter table public.lecturers enable row level security;
alter table public.submissions enable row level security;
alter table public.rubrics enable row level security;

create policy "students read own profile" on public.profiles for select using (auth.uid() = id);
create policy "authenticated users read courses" on public.courses for select to authenticated using (true);
create policy "authenticated users read tasks" on public.tasks for select to authenticated using (true);
create policy "authenticated users read lecturers" on public.lecturers for select to authenticated using (true);
create policy "students read own submissions" on public.submissions for select using (auth.uid() = student_id);
create policy "students create own submissions" on public.submissions for insert with check (auth.uid() = student_id);
create policy "students read own rubrics" on public.rubrics for select using (
  exists (select 1 from public.submissions s where s.id = submission_id and s.student_id = auth.uid())
);

insert into storage.buckets (id, name, public) values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create policy "students upload own files" on storage.objects for insert to authenticated
with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "students read own files" on storage.objects for select to authenticated
using (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);
