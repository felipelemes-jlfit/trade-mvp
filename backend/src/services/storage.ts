import { supaAdmin } from './supabase';
import { env } from '../env';
export async function uploadBufferToStorage(filePath: string, buffer: Buffer, contentType: string) {
  const { error } = await supaAdmin.storage.from(env.SUPABASE_BUCKET).upload(filePath, buffer, { contentType, upsert: false });
  if (error) throw error;
  const { data } = supaAdmin.storage.from(env.SUPABASE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}