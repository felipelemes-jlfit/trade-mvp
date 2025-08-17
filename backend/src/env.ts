import 'dotenv/config';
function required(name: string): string { const v = process.env[name]; if (!v) throw new Error(`Missing env ${name}`); return v; }
export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
  SUPABASE_URL: required('SUPABASE_URL'),
  SUPABASE_ANON_KEY: required('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE: required('SUPABASE_SERVICE_ROLE'),
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET ?? 'photos',
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL ?? '',
  OPENAI_API_KEY: required('OPENAI_API_KEY'),
  OPENAI_MODEL: process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
};