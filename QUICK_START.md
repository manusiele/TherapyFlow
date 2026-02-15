# 🚀 Quick Start Guide

## Your Supabase is Connected!

Your environment variables are configured and ready to use.

---

## Step 1: Secure Your Database (CRITICAL!)

**Read `SECURITY_URGENT.md` and follow ALL steps immediately!**

The most important actions:
1. Rotate your anon key in Supabase Dashboard
2. Enable Row Level Security (RLS)
3. Add security policies

---

## Step 2: Run the Database Migration

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Paste and click **Run**

You should see: "Success. No rows returned"

---

## Step 3: Start Your Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 4: Test the Integration

### Create a Test Account

1. Go to http://localhost:3000/auth/signup
2. Fill in the form:
   - Name: Test Therapist
   - Email: test@therapist.com
   - Password: password123
   - Role: Therapist
3. Click "Create Account"
4. You should be redirected to `/dashboard`

### Verify in Supabase

1. Go to Supabase Dashboard > **Authentication** > **Users**
2. You should see your test user
3. Go to **Table Editor** > **therapists**
4. You should see a new therapist record

---

## Step 5: Explore the Features

### As Therapist:
- Dashboard: http://localhost:3000/dashboard
- Schedule: http://localhost:3000/dashboard/schedule
- Create sessions, add notes, manage patients

### As Patient:
- Create another account with role "Patient"
- Patient Portal: http://localhost:3000/patient
- Book sessions, take assessments, view resources

---

## Current Features

✅ Authentication (Login/Signup)
✅ Session Notes Integration
✅ Supabase Database Connection
✅ Profile Management
✅ Session Management
✅ Assessment System
✅ Mood Tracking
✅ Resources Panel
✅ PWA Support
✅ Dark Mode
✅ Responsive Design

---

## What's Next?

Now that Supabase is connected, you can:

1. **Replace Mock Data**: Update components to use real Supabase queries
2. **Add Real-time Updates**: Use Supabase subscriptions
3. **Implement Messages**: Build the chat system (Priority 4)
4. **Add Video Calls**: Integrate video provider (Priority 5)
5. **Deploy**: Host on Vercel or your preferred platform

---

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

---

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Signup page
│   ├── dashboard/
│   │   ├── page.tsx             # Therapist dashboard
│   │   └── schedule/page.tsx    # Schedule management
│   ├── patient/page.tsx         # Patient portal
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
├── contexts/
│   ├── AuthContext.tsx          # Auth state management
│   └── ThemeContext.tsx         # Theme management
├── lib/
│   └── supabase.ts              # Supabase client & helpers
└── types/
    └── database.ts              # Database types
```

---

## Environment Variables

Your `.env.local` contains:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public anon key

**Never commit `.env.local` to git!** (Already in `.gitignore`)

---

## Troubleshooting

### "Invalid API key" error
- Restart your dev server: `npm run dev`
- Check `.env.local` exists and has correct values

### Can't create account
- Check Supabase Dashboard > Authentication > Providers
- Ensure Email provider is enabled
- Check browser console for errors

### Database errors
- Verify migration was run successfully
- Check RLS is disabled for development (or policies are correct)
- Look at Supabase Dashboard > Database > Logs

### Profile not loading
- Check that user was created in auth.users
- Verify profile exists in therapists/patients table
- Check browser console for errors

---

## Getting Help

- Check `SUPABASE_INTEGRATION_COMPLETE.md` for detailed docs
- Read `SECURITY_URGENT.md` for security setup
- Review `IMPLEMENTATION_PROGRESS.md` for feature status

---

## Ready to Code!

Your TherapyFlow app is now connected to Supabase and ready for development. 

**Remember**: Secure your database first (see `SECURITY_URGENT.md`), then start building!

Happy coding! 🎉
