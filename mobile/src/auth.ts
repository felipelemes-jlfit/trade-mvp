import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
export const SUPABASE_URL = 'https://mebjrfbewlhfehgcnsfi.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lYmpyZmJld2xoZmVoZ2Nuc2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDc2MjAsImV4cCI6MjA3MDg4MzYyMH0.9fZF0vPE9kju2mnJc9_1geDIZIc9kseITt_wwyNx0dU';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const TOKEN_KEY = 'access_token';
export async function setToken(token: string) { await SecureStore.setItemAsync(TOKEN_KEY, token); }
export async function getToken() { return SecureStore.getItemAsync(TOKEN_KEY); }
export async function clearToken() { await SecureStore.deleteItemAsync(TOKEN_KEY); }
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(error?.message || 'Falha no login');
  await setToken(data.session.access_token);
  return data.session;
}