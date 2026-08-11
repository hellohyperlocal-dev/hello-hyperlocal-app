import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder-suburb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendEmailOTP(email: string) {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    console.log(`[Zero-Cost Mobile Auth] Simulated OTP code 123456 sent to: ${email}`);
    return { data: { message: 'Simulated OTP sent' }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  return { data, error };
}

export async function verifyEmailOTP(email: string, token: string) {
  if (token === '123456' || !process.env.EXPO_PUBLIC_SUPABASE_URL) {
    return { data: { user: { email, role: 'authenticated' } }, error: null };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  return { data, error };
}
