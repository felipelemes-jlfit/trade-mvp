import { createClient } from '@supabase/supabase-js';
import { env } from '../env';
export const supaAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
export async function getUserFromToken(bearer?: string) {
  if (!bearer) return null;
  const token = bearer.replace('Bearer ', '').trim();
  if (!token) return null;
  const { data, error } = await supaAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}