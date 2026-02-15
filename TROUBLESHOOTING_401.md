# 🔧 Fixing 401 Unauthorized Error

## The Problem
You're getting a 401 error when trying to sign up, which means:
1. Your Supabase anon key is incorrect or incomplete
2. Email authentication is not enabled in Supabase
3. Your Supabase project settings need configuration

---

## Solution Steps

### Step 1: Get Your Correct Supabase Credentials

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `qarydyorosqypwsxpoxb`
3. Click **Settings** (gear icon) in the left sidebar
4. Click **API** in the settings menu
5. You'll see:
   - **Project URL**: `https://qarydyorosqypwsxpoxb.supabase.co`
   - **anon public key**: A long JWT token (starts with `eyJ...`)

### Step 2: Copy Your FULL Anon Key

**IMPORTANT**: The anon key is very long (usually 200+ characters). Make sure you copy the ENTIRE key!

It should look like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcnlkeW9yb3NxeXB3c3hwb3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MjU5NzcsImV4cCI6MjA1NTIwMTk3N30.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

The part after the last dot (`.`) is crucial!

### Step 3: Update Your .env.local File

Open `.env.local` and replace with your COMPLETE credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qarydyorosqypwsxpoxb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_complete_anon_key_here
```

**Make sure there are NO line breaks in the anon key!**

### Step 4: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** in the left sidebar
2. Click **Providers**
3. Find **Email** in the list
4. Make sure it's **ENABLED** (toggle should be ON/green)
5. Click **Save** if you made changes

### Step 5: Configure Email Settings (Optional but Recommended)

1. Still in **Authentication** > **Providers** > **Email**
2. Scroll down to **Email Settings**
3. Options:
   - **Confirm email**: Toggle OFF for development (ON for production)
   - **Secure email change**: Toggle OFF for development
   - **Double confirm email changes**: Toggle OFF for development

For development, you can disable email confirmation to test faster.

### Step 6: Restart Your Dev Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 7: Test Signup

1. Go to: http://localhost:3000/auth/therapist/signup
2. Fill out the form
3. Click "Create Therapist Account"
4. You should be redirected to `/dashboard`

---

## Quick Fix Command

Run this to check if your environment variables are loaded:

```bash
# Check if variables are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

If they're empty, your `.env.local` isn't being read.

---

## Common Issues

### Issue 1: Anon Key is Incomplete
**Symptom**: 401 error
**Solution**: Copy the ENTIRE anon key from Supabase Dashboard

### Issue 2: Email Provider Not Enabled
**Symptom**: 401 error or "Email provider is disabled"
**Solution**: Enable Email provider in Authentication > Providers

### Issue 3: Environment Variables Not Loading
**Symptom**: 401 error, variables are undefined
**Solution**: 
- Make sure file is named `.env.local` (not `.env` or `.env.local.txt`)
- Restart dev server
- Check file is in project root (same level as `package.json`)

### Issue 4: CORS Error
**Symptom**: CORS policy error in console
**Solution**: 
- Go to Supabase Dashboard > Settings > API
- Add `http://localhost:3000` to allowed origins

### Issue 5: Project URL Wrong
**Symptom**: Network error or timeout
**Solution**: Verify URL is exactly `https://qarydyorosqypwsxpoxb.supabase.co`

---

## Verify Your Setup

### Check 1: Environment Variables
```bash
cat .env.local
```
Should show both URL and complete anon key.

### Check 2: Supabase Connection
Create a test file `test-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://qarydyorosqypwsxpoxb.supabase.co'
const supabaseKey = 'your-anon-key-here'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123'
  })
  
  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Success! User created:', data.user?.email)
  }
}

test()
```

Run: `node test-supabase.js`

---

## Still Not Working?

### Check Supabase Status
1. Go to: https://status.supabase.com
2. Make sure all services are operational

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for detailed error messages
4. Check Network tab for the failed request

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click **Logs** in the left sidebar
3. Look for authentication errors

---

## Need the Correct Anon Key?

I can see your project ID is `qarydyorosqypwsxpoxb`. 

**You need to:**
1. Go to https://app.supabase.com
2. Select your project
3. Settings > API
4. Copy the COMPLETE anon key (it's very long!)
5. Update `.env.local`
6. Restart dev server

---

## After Fixing

Once you have the correct credentials:

1. ✅ Update `.env.local` with complete anon key
2. ✅ Enable Email provider in Supabase
3. ✅ Restart dev server
4. ✅ Test signup at `/auth/therapist/signup`
5. ✅ Check Supabase Dashboard > Authentication > Users

You should see your new user created!

---

## Security Reminder

After you get it working:
- ⚠️ Rotate your anon key (you shared it earlier)
- ⚠️ Enable Row Level Security
- ⚠️ Add security policies

See `SECURITY_URGENT.md` for details.
