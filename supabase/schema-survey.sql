-- AI Through Your Eyes — Survey responses
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions (id) on delete cascade,
  nickname text not null default '',
  question_1_answer text not null,
  question_2_answer text not null,
  question_3_answer text not null,
  question_4_answer text not null,
  question_5_answer text not null,
  ai_track_expectations text not null check (char_length(ai_track_expectations) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_session_created_idx on public.survey_responses (session_id, created_at desc);

alter table public.survey_responses enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'survey_insert_all') then
    create policy survey_insert_all on public.survey_responses for insert to anon, authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'survey_select_auth') then
    create policy survey_select_auth on public.survey_responses for select to authenticated using (true);
  end if;
end $$;

alter publication supabase_realtime add table public.survey_responses;