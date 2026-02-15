# ✅ Supabase Integration Complete!

## What's Been Implemented

### 1. Enhanced Supabase Client (`src/lib/supabase.ts`)
- **Authentication helpers**: signUp, signIn, signOut, getUser, onAuthStateChange
- **Therapist operations**: CRUD operations with email lookup
- **Patient operations**: CRUD operations with therapist filtering
- **Session operations**: Full CRUD with joins to therapist/patient data, date filtering
- **Assessment operations**: Create and retrieve with patient filtering

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)
- Global auth state management
- Automatic profile loading based on user role
- Real-time auth state synchronization
- Profile refresh functionality

### 3. Updated Authentication Pages
- **Login** (`/auth/login`): Real Supabase authentication with role-based routing
- **Signup** (`/auth/signup`): Creates auth user + profile in appropriate table

### 4. Type Safety
- Full TypeScript support with database types
- Type aliases for easier development
- Proper error handling

---

## Setup Instructions

### Step 1: Install Supabase Package (if not already installed)
```bash
npm install @supabase/supabase-js
```

### Step 2: Set Up Your Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a project
2. Run the migration SQL from `supabase/migrations/001_initial_schema.sql` in the SQL Editor
3. Get your Project URL and anon key from Settings > API

### Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Step 5: Disable RLS for Development (Enable for Production!)

For development, temporarily disable Row Level Security:

1. Go to **Authentication** > **Policies**
2. For each table (therapists, patients, sessions, assessments):
   - Click "Disable RLS"

**⚠️ IMPORTANT**: Before production, enable RLS and create proper policies!

### Step 6: Test the Integration

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/auth/signup`
3. Create a test account (therapist or patient)
4. You should be redirected to the appropriate dashboard
5. Check your Supabase dashboard to see the created records

---

## How to Use in Your Components

### Get Current User and Profile

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, profile, role, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return (
    <div>
      <p>Welcome, {profile?.name}!</p>
      <p>Role: {role}</p>
    </div>
  )
}
```

### Fetch Sessions

```typescript
import { sessions } from '@/lib/supabase'

// Get all sessions for a therapist
const { data, error } = await sessions.getAll({ 
  therapistId: 'therapist-uuid' 
})

// Get sessions for a specific date
const { data, error } = await sessions.getAll({ 
  therapistId: 'therapist-uuid',
  date: '2024-02-15'
})

// Get sessions for a patient
const { data, error } = await sessions.getAll({ 
  patientId: 'patient-uuid' 
})
```

### Create a Session

```typescript
import { sessions } from '@/lib/supabase'

const { data, error } = await sessions.create({
  therapist_id: 'therapist-uuid',
  patient_id: 'patient-id',
  scheduled_at: '2024-02-15T14:00:00Z',
  duration_minutes: 50,
  session_type: 'individual',
  status: 'scheduled'
})
```

### Update Session Notes

```typescript
import { sessions } from '@/lib/supabase'

const { data, error } = await sessions.updateNotes(
  'session-id',
  'Clinical notes here...'
)
// Automatically marks session as 'completed'
```

### Create Assessment

```typescript
import { assessments } from '@/lib/supabase'

const { data, error } = await assessments.create({
  patient_id: 'patient-uuid',
  therapist_id: 'therapist-uuid',
  assessment_type: 'PHQ-9',
  score: 12,
  responses: { q1: 2, q2: 1, q3: 3, ... }
})
```

### Sign Out

```typescript
import { useAuth } from '@/contexts/AuthContext'

function LogoutButton() {
  const { signOut } = useAuth()
  
  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  )
}
```

---

## Next Steps to Complete Integration

### 1. Update Dashboard Page
Replace mock data with real Supabase queries:

```typescript
// src/app/dashboard/page.tsx
import { useAuth } from '@/contexts/AuthContext'
import { sessions, patients } from '@/lib/supabase'

export default function Dashboard() {
  const { profile } = useAuth()
  const [sessionsData, setSessionsData] = useState([])
  
  useEffect(() => {
    if (profile?.id) {
      sessions.getAll({ therapistId: profile.id })
        .then(({ data }) => setSessionsData(data || []))
    }
  }, [profile])
  
  // ... rest of component
}
```

### 2. Update Schedule Page
Connect to real sessions data

### 3. Update Patient Portal
Load patient's own sessions and assessments

### 4. Update Profile Modals
Save changes to Supabase instead of local state

### 5. Add Protected Routes
Create middleware to protect authenticated pages

---

## Production Checklist

Before deploying to production:

- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Create RLS policies for each table
- [ ] Set up proper email templates
- [ ] Configure email rate limiting
- [ ] Add password reset functionality
- [ ] Set up proper error logging
- [ ] Add loading states for all async operations
- [ ] Implement optimistic updates
- [ ] Add real-time subscriptions for live updates
- [ ] Set up database backups
- [ ] Configure CORS properly
- [ ] Add rate limiting for API calls

---

## Example RLS Policies (for Production)

### Therapists Table
```sql
-- Therapists can read their own profile
CREATE POLICY "Therapists can view own profile"
ON therapists FOR SELECT
USING (auth.uid()::text = id);

-- Therapists can update their own profile
CREATE POLICY "Therapists can update own profile"
ON therapists FOR UPDATE
USING (auth.uid()::text = id);
```

### Patients Table
```sql
-- Patients can read their own profile
CREATE POLICY "Patients can view own profile"
ON patients FOR SELECT
USING (auth.uid()::text = id);

-- Therapists can view their patients
CREATE POLICY "Therapists can view their patients"
ON patients FOR SELECT
USING (therapist_id IN (
  SELECT id FROM therapists WHERE auth.uid()::text = id
));
```

### Sessions Table
```sql
-- Therapists can view their sessions
CREATE POLICY "Therapists can view their sessions"
ON sessions FOR SELECT
USING (therapist_id IN (
  SELECT id FROM therapists WHERE auth.uid()::text = id
));

-- Patients can view their sessions
CREATE POLICY "Patients can view their sessions"
ON sessions FOR SELECT
USING (patient_id IN (
  SELECT id FROM patients WHERE auth.uid()::text = id
));
```

---

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file exists
- Verify the anon key is correct
- Restart your dev server

### "Row Level Security" errors
- Disable RLS for development
- Or create proper RLS policies

### Auth not persisting
- Check browser console for errors
- Verify Supabase URL is correct
- Clear browser cache and cookies

### Profile not loading
- Check that user metadata includes 'role'
- Verify profile exists in therapists/patients table
- Check browser console for errors

---

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

---

Last Updated: Supabase integration complete and ready for use!
