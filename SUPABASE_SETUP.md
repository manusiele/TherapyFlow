# Supabase Setup Guide for TherapyFlow

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in the project details:
   - **Name**: TherapyFlow (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine for development
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Run Database Migration

1. In your Supabase project dashboard, click on the **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned" - this means your tables were created!

## Step 4: Get Your API Credentials

1. In your Supabase dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long JWT token starting with `eyJ...`
4. Keep this page open - you'll need these values next

## Step 5: Configure Environment Variables

1. In your project root, copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Replace the values with your actual Project URL and anon key from Step 4

## Step 6: Verify the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. The Supabase client in `src/lib/supabase.ts` will automatically use these environment variables

## Step 7: Test the Database (Optional)

You can test the connection by adding some sample data:

1. Go to **Table Editor** in your Supabase dashboard
2. Click on the `therapists` table
3. Click "Insert row" and add a test therapist:
   - name: "Dr. Sarah Johnson"
   - email: "sarah@example.com"
   - specialization: "Clinical Psychology"
4. Click "Save"

## Step 8: Enable Row Level Security (RLS) - Important for Production

For now, we'll disable RLS for development. In production, you MUST enable it:

1. Go to **Authentication** > **Policies** in Supabase
2. For each table (therapists, patients, sessions, assessments):
   - Click on the table
   - Click "Disable RLS" for development
   - **Note**: Before going to production, enable RLS and create proper policies!

## Environment Variables Reference

Your `.env.local` should look like this:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Troubleshooting

### Error: "Invalid API key"
- Double-check that you copied the entire anon key
- Make sure there are no extra spaces or line breaks
- Verify the key starts with `eyJ`

### Error: "Failed to fetch"
- Check that your Project URL is correct
- Ensure you're using `https://` not `http://`
- Verify your internet connection

### Tables not showing up
- Make sure you ran the migration SQL in Step 3
- Check the SQL Editor for any error messages
- Verify all tables were created in the Table Editor

### Environment variables not loading
- Restart your dev server after changing `.env.local`
- Make sure the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
- Verify the variables start with `NEXT_PUBLIC_`

## Next Steps

Once connected, you can:

1. **Fetch data**: Use the Supabase client to query your tables
2. **Insert data**: Create new records through your app
3. **Real-time subscriptions**: Listen to database changes
4. **Authentication**: Add user login/signup (optional)

## Security Best Practices

Before deploying to production:

1. ✅ Enable Row Level Security (RLS) on all tables
2. ✅ Create proper RLS policies for each table
3. ✅ Never commit `.env.local` to git (it's in `.gitignore`)
4. ✅ Use environment variables in your hosting platform
5. ✅ Rotate your API keys if they're ever exposed
6. ✅ Set up proper authentication for therapists and patients

## Useful Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Need Help?

- Check the Supabase [Discord community](https://discord.supabase.com)
- Review the [GitHub discussions](https://github.com/supabase/supabase/discussions)
- Read the [troubleshooting guide](https://supabase.com/docs/guides/platform/troubleshooting)
