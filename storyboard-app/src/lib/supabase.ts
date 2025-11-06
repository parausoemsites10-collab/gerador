import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  name: string;
  description?: string;
  api_key?: string;
  cookies?: string;
  step1_data: any;
  step2_data: any;
  step3_data: any;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  project_id: string;
  scene_number: number;
  title: string;
  description: string;
  prompt?: string;
  images: any[];
  status: 'pending' | 'generating' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
}
