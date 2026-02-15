'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth, Therapist, Patient } from '@/lib/supabase'
import { therapists, patients } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Therapist | Patient | null
  role: 'therapist' | 'client' | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Therapist | Patient | null>(null)
  const [role, setRole] = useState<'therapist' | 'client' | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (currentUser: User) => {
    const userRole = currentUser.user_metadata?.role as 'therapist' | 'client'
    setRole(userRole)

    if (userRole === 'therapist') {
      const { data } = await therapists.getByEmail(currentUser.email!)
      if (data) setProfile(data)
    } else {
      const { data } = await patients.getByEmail(currentUser.email!)
      if (data) setProfile(data)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user)
    }
  }

  useEffect(() => {
    // Check active session
    auth.getUser().then(({ user: currentUser }) => {
      setUser(currentUser)
      if (currentUser) {
        loadProfile(currentUser).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadProfile(session.user)
      } else {
        setProfile(null)
        setRole(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await auth.signOut()
    setUser(null)
    setProfile(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        signOut: handleSignOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
