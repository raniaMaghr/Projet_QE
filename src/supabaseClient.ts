import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://faxmuldojxwkxwabrwzi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheG11bGRvanh3a3h3YWJyd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjAzOTUsImV4cCI6MjA4NTYzNjM5NX0.kVVHxgQRRG5tsUv_SekTvwmuufuQLjwvamK7dj4qyHM'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Client Supabase initialisé');
