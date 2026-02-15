# 🚨 URGENT SECURITY ACTIONS REQUIRED

## ⚠️ Your Supabase Credentials Were Exposed!

You shared your Supabase credentials in a public conversation. While I've secured them in `.env.local`, you need to take immediate action.

---

## Immediate Actions (Do This NOW!)

### 1. Rotate Your Supabase API Keys

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `qarydyorosqypwsxpoxb`
3. Go to **Settings** > **API**
4. Click **"Reset anon key"** or **"Generate new anon key"**
5. Copy the new key
6. Update your `.env.local` file with the new key

### 2. Check for Unauthorized Access

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Check if there are any unauthorized user accounts
3. Delete any suspicious accounts

### 3. Review Database Activity

1. Go to **Database** > **Logs**
2. Check for any suspicious queries or activity
3. Look for unusual timestamps or patterns

### 4. Enable Row Level Security (RLS)

**CRITICAL**: Your database is currently unprotected!

1. Go to **Authentication** > **Policies**
2. For EACH table (therapists, patients, sessions, assessments):
   - Click on the table
   - Click **"Enable RLS"**
   - Add policies (see below)

---

## Required RLS Policies

Run these in your SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Therapists can only see their own profile
CREATE POLICY "Therapists can view own profile"
ON therapists FOR SELECT
USING (auth.uid()::text = id);

CREATE POLICY "Therapists can update own profile"
ON therapists FOR UPDATE
USING (auth.uid()::text = id);

-- Patients can only see their own profile
CREATE POLICY "Patients can view own profile"
ON patients FOR SELECT
USING (auth.uid()::text = id);

CREATE POLICY "Patients can update own profile"
ON patients FOR UPDATE
USING (auth.uid()::text = id);

-- Therapists can view their patients
CREATE POLICY "Therapists can view their patients"
ON patients FOR SELECT
USING (
  therapist_id IN (
    SELECT id FROM therapists WHERE auth.uid()::text = id
  )
);

-- Sessions: Therapists can view their sessions
CREATE POLICY "Therapists can view their sessions"
ON sessions FOR SELECT
USING (
  therapist_id IN (
    SELECT id FROM therapists WHERE auth.uid()::text = id
  )
);

CREATE POLICY "Therapists can manage their sessions"
ON sessions FOR ALL
USING (
  therapist_id IN (
    SELECT id FROM therapists WHERE auth.uid()::text = id
  )
);

-- Sessions: Patients can view their sessions
CREATE POLICY "Patients can view their sessions"
ON sessions FOR SELECT
USING (
  patient_id IN (
    SELECT id FROM patients WHERE auth.uid()::text = id
  )
);

-- Assessments: Therapists can view their patients' assessments
CREATE POLICY "Therapists can view patient assessments"
ON assessments FOR SELECT
USING (
  therapist_id IN (
    SELECT id FROM therapists WHERE auth.uid()::text = id
  )
);

CREATE POLICY "Therapists can create assessments"
ON assessments FOR INSERT
WITH CHECK (
  therapist_id IN (
    SELECT id FROM therapists WHERE auth.uid()::text = id
  )
);

-- Assessments: Patients can view their own assessments
CREATE POLICY "Patients can view own assessments"
ON assessments FOR SELECT
USING (
  patient_id IN (
    SELECT id FROM patients WHERE auth.uid()::text = id
  )
);

CREATE POLICY "Patients can create own assessments"
ON assessments FOR INSERT
WITH CHECK (
  patient_id IN (
    SELECT id FROM patients WHERE auth.uid()::text = id
  )
);
```

---

## Security Best Practices Going Forward

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already done)
- Use environment variables for all secrets
- Enable RLS on all tables
- Rotate keys regularly
- Monitor database logs
- Use strong passwords
- Enable 2FA on your Supabase account

### ❌ DON'T:
- Share API keys in chat, email, or public forums
- Commit `.env.local` to git
- Disable RLS in production
- Use the same password everywhere
- Share your database password

---

## What's Already Protected

✅ `.env.local` is in `.gitignore` - won't be committed to git
✅ Environment variables are properly configured
✅ Using `NEXT_PUBLIC_` prefix for client-side variables (this is safe for anon key)

---

## Understanding Supabase Keys

### Anon Key (Public)
- **What you shared**: This is the "anon" key
- **Safe to expose**: Yes, but with RLS enabled
- **Used for**: Client-side requests
- **Protection**: RLS policies control what users can access

### Service Role Key (Secret)
- **Never share this**: Has full database access
- **Used for**: Server-side admin operations
- **Keep it**: In server-only environment variables

---

## Next Steps

1. ✅ **Done**: Credentials saved to `.env.local`
2. ⚠️ **You must do**: Rotate your anon key in Supabase
3. ⚠️ **You must do**: Enable RLS and add policies
4. ⚠️ **You must do**: Check for unauthorized access
5. ✅ **Done**: Verify `.gitignore` includes `.env.local`

---

## Testing After Security Setup

After enabling RLS and adding policies:

```bash
# Restart your dev server
npm run dev

# Test signup
# Test login
# Test creating sessions
# Verify users can only see their own data
```

---

## If You Need Help

- Supabase Discord: https://discord.supabase.com
- Supabase Docs: https://supabase.com/docs/guides/auth/row-level-security
- Security Guide: https://supabase.com/docs/guides/platform/security

---

## Summary

Your credentials are now safely stored in `.env.local`, but you MUST:
1. Rotate your anon key immediately
2. Enable RLS on all tables
3. Add the security policies above
4. Monitor for unauthorized access

**Don't skip these steps!** Your database is currently unprotected.
