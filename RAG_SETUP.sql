-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists documents (
  id bigserial primary key,
  content text, -- The text content of the chunk
  metadata jsonb, -- Original filename, page number, etc.
  embedding vector(768) -- Gemini 1.5 Flash/Pro embedding dimension is 768
);

-- Enable RLS on documents
alter table documents enable row level security;

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a storage bucket for official docs (if not exists)
insert into storage.buckets (id, name, public)
values ('official-docs', 'official-docs', true)
on conflict (id) do nothing;

-- Allow public read access to official docs
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'official-docs' );

-- Allow authenticated users to upload (for Admin Dashboard)
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'official-docs' and auth.role() = 'authenticated' );
