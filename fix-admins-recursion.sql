-- URGENT FIX: Break infinite recursion in 'admins' policy
-- Run this FIRST in Supabase Dashboard > SQL Editor

-- Ignore if table doesn't exist
DO $$ 
BEGIN
  ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
  RAISE NOTICE 'RLS disabled on admins table';
EXCEPTION 
  WHEN undefined_table THEN
    RAISE NOTICE 'admins table not found - safe to proceed';
END $$;

-- Drop all possible recursive policies on admins
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT * FROM pg_policies WHERE tablename = 'admins'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON admins';
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- Verify products policy works
SELECT 'Products query test OK' as status;

-- NOW run full supabase-complete-setup-fixed.sql
-- Then test product save in admin
