-- Run against a disposable database after applying the migration.
begin;

insert into auth.users (id, email) values
  ('10000000-0000-4000-8000-000000000001', 'ideas-owner@example.invalid'),
  ('10000000-0000-4000-8000-000000000002', 'ideas-visitor@example.invalid');
insert into ideas_private.owner (user_id) values ('10000000-0000-4000-8000-000000000001');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $$
declare
  idea_id constant uuid := '20000000-0000-4000-8000-000000000001';
  saved jsonb;
begin
  assert public.is_ideas_owner(), 'Owner access was denied';
  saved := public.write_idea(idea_id, 'Private idea', false, null);
  assert (saved->>'revision')::integer = 1;
  assert saved->>'published_at' is null;
  assert public.write_idea(idea_id, 'Private idea', false, null) = saved, 'Save retry duplicated the idea';
  assert (select count(*) from public.ideas where id = idea_id) = 1, 'Owner cannot read draft';

  perform public.write_idea(idea_id, 'Edited private idea', false, 1);
  begin
    perform public.write_idea(idea_id, 'Stale edit', true, 1);
    raise exception 'Stale revision was published';
  exception when serialization_failure then
    null;
  end;
end;
$$;

set local role anon;
do $$
begin
  assert (select count(*) from public.ideas) = 0, 'Anonymous visitor can read drafts';
  begin
    perform public.write_idea('20000000-0000-4000-8000-000000000001', 'Anonymous edit', true, 2);
    raise exception 'Anonymous write was allowed';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
do $$
begin
  assert not public.is_ideas_owner();
  assert (select count(*) from public.ideas) = 0, 'Other account can read drafts';
  begin
    perform public.write_idea('20000000-0000-4000-8000-000000000001', 'Visitor edit', true, 2);
    raise exception 'Non-owner write was allowed';
  exception when insufficient_privilege then
    null;
  end;
end;
$$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
do $$
declare
  idea_id constant uuid := '20000000-0000-4000-8000-000000000001';
  saved jsonb;
begin
  saved := public.write_idea(idea_id, 'Published idea', true, 2);
  assert saved->>'published_at' is not null;
  assert public.write_idea(idea_id, 'Published idea', true, 2) = saved, 'Publish retry changed the row';
  begin
    perform public.write_idea(idea_id, 'Back to draft', false, 3);
    raise exception 'A published row was changed by the draft editor';
  exception when serialization_failure then
    null;
  end;
end;
$$;

set local role anon;
do $$
begin
  assert (select count(*) from public.ideas where body = 'Published idea') = 1;
  assert (select count(*) from public.ideas where published_at is null) = 0;
end;
$$;

rollback;
