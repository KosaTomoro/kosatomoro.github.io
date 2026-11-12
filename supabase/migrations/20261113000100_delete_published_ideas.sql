begin;

alter table public.ideas add column deleted_at timestamptz;

alter policy "Anyone can read published ideas" on public.ideas
  using (published_at is not null and deleted_at is null);

alter policy "The owner can read drafts" on public.ideas
  using (deleted_at is null and (select public.is_ideas_owner()));

create or replace function public.delete_published_idea(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_ideas_owner() then
    raise exception 'Ideas owner access required' using errcode = '42501';
  end if;

  update public.ideas
  set deleted_at = now()
  where id = p_id and published_at is not null and deleted_at is null;
end;
$$;

revoke all on function public.delete_published_idea(uuid) from public, anon, authenticated;
grant execute on function public.delete_published_idea(uuid) to authenticated;

commit;
