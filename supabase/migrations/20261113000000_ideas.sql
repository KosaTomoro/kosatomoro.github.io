begin;

create schema ideas_private;
revoke all on schema ideas_private from public, anon, authenticated;

-- A single owner, assigned in the Supabase SQL editor after their first sign-in.
create table ideas_private.owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users (id) on delete cascade
);

create function public.is_ideas_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from ideas_private.owner
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_ideas_owner() from public, anon, authenticated;
grant execute on function public.is_ideas_owner() to authenticated;

create table public.ideas (
  id uuid primary key,
  body text not null check (char_length(body) between 1 and 500 and body ~ '[^[:space:]]'),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.ideas enable row level security;
revoke all on table public.ideas from public, anon, authenticated;
grant select on table public.ideas to anon, authenticated;

create policy "Anyone can read published ideas"
  on public.ideas for select to anon, authenticated
  using (published_at is not null);

create policy "The owner can read drafts"
  on public.ideas for select to authenticated
  using ((select public.is_ideas_owner()));

create index ideas_public_timeline
  on public.ideas (published_at desc, id desc) where published_at is not null;

-- Only drafts can be updated. A revision prevents overwriting changes from another device.
create function public.write_idea(
  p_id uuid, p_body text, p_publish boolean, p_revision integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved public.ideas;
begin
  if not public.is_ideas_owner() then
    raise exception 'Ideas owner access required' using errcode = '42501';
  end if;

  if p_publish is null then
    raise exception 'Publish intent is required' using errcode = '22023';
  end if;

  if p_revision is null then
    insert into public.ideas (id, body, published_at)
    values (p_id, p_body, case when p_publish then now() end)
    on conflict (id) do nothing
    returning * into saved;
  else
    update public.ideas
    set body = p_body, revision = revision + 1, updated_at = now(),
        published_at = case when p_publish then now() end
    where id = p_id and revision = p_revision and published_at is null
    returning * into saved;
  end if;

  if not found then
    -- A repeated request can succeed after the first response was lost.
    select * into saved from public.ideas
    where id = p_id and revision = coalesce(p_revision, 0) + 1
      and body = p_body and (published_at is not null) = p_publish;
    if not found then
      raise exception 'The draft changed or was published' using errcode = '40001';
    end if;
  end if;

  return to_jsonb(saved);
end;
$$;

revoke all on function public.write_idea(uuid, text, boolean, integer) from public, anon, authenticated;
grant execute on function public.write_idea(uuid, text, boolean, integer) to authenticated;

commit;
