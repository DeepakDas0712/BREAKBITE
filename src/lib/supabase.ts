/**
 * BreakBite Supabase Client Connector
 * If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured in .env,
 * this client connects directly to your live Supabase database.
 * Otherwise, the application seamlessly runs on our reactive, persistent local engine.
 */

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL'
  );
};

export const SUPABASE_SETUP_INSTRUCTIONS = `
To connect BreakBite to Supabase:
1. Create a project at https://supabase.com
2. Run the SQL script from 'supabase/schema.sql' in the Supabase SQL Editor.
3. Create a '.env' file in your project root:
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
4. Restart the development server (npm run dev).
`;
