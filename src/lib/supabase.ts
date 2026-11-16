import { createClient as createBrowserSupabaseClient } from '../utils/supabase/client';

export const supabase = createBrowserSupabaseClient();
export const isSupabaseConfigured = true;
