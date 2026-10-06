-- Apply to a dedicated LAHZA Supabase project, not an existing school database.
create extension if not exists vector;
create table if not exists public.knowledge_sources (
 source_id text primary key, authority text not null, source_name text not null,
 reference text not null, url text not null, original_text text not null,
 language text not null, approved_translation text, translation_status text not null,
 topic text not null, use_scope text not null,
 scientific_review text not null default 'pending', linguistic_review text not null default 'pending',
 reviewed_at timestamptz, retrieved_at timestamptz not null default now(),
 approved_for_prototype boolean not null default false, corpus_version text not null
);
create table if not exists public.knowledge_chunks (
 chunk_id text primary key, source_id text not null references public.knowledge_sources(source_id),
 topic text not null, text_ar text not null, text_en text not null, search_terms text not null,
 embedding vector(1536), embedding_model text,
 search_document tsvector generated always as (to_tsvector('simple',text_ar || ' ' || text_en || ' ' || search_terms)) stored
);
create index if not exists knowledge_search on public.knowledge_chunks using gin(search_document);
alter table public.knowledge_sources enable row level security;
alter table public.knowledge_chunks enable row level security;
-- No anonymous or authenticated read/write policies. Trusted server only.
create or replace function public.match_knowledge(query_embedding vector(1536),match_count integer default 4)
returns table(chunk_id text, source_id text, topic text, text_ar text, text_en text, similarity float)
language sql stable security invoker set search_path=public as $$
 select c.chunk_id,c.source_id,c.topic,c.text_ar,c.text_en,1-(c.embedding <=> query_embedding) as similarity
 from knowledge_chunks c join knowledge_sources s using(source_id)
 where s.approved_for_prototype=true and c.embedding is not null
 order by c.embedding <=> query_embedding limit least(greatest(match_count,1),6);
$$;
revoke all on function public.match_knowledge(vector,integer) from public,anon,authenticated;
grant execute on function public.match_knowledge(vector,integer) to service_role;
