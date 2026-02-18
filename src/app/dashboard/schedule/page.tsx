'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AddSessionModal, { SessionFormData } from '@/components/AddSessionModal'
import ProfileModal, { ProfileData } from '@/components/ProfileModal'
import SessionNotes from '@/components/SessionNotes'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { sessions as sessionsAPI, therapists, patients } from '@/lib/supabase'

interface Session {
  id: string
  patient_id: string
  therapist_id: string
  patient_name: string
  type: string
  time: string
  scheduled_at: string
  duration: string
  duration_minutes: number
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
}

export default function SchedulePage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week'>('day')
  const [viewCategory, setViewCategory] = useState<'therapist' | 'client'>('therapist')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isBlockTimeModalOpen, setIsBlockTimeModalOpen] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [showAllAppointments, setShowAllAppointments] = useState(false)
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSessionDetails, setShowSessionDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [showSessionNotes, setShowSessionNotes] = useState(false)
  const [sessionForNotes, setSessionForNotes] = useState<Session | null>(null)
  const [currentTime] = useState(new Date())
  const [selectedDayForModal, setSelectedDayForModal] = useState<Date | null>(null)
  const [showDaySessionsModal, setShowDaySessionsModal] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [allSessions, setAllSessions] = useState<Session[]>([])
  
  // Profile data based on view category
  const [therapistProfile, setTherapistProfile] = useState<ProfileData>({
    name: 'Therapist',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
    role: 'therapist' as const
  })
  
  const [clientProfile, setClientProfile] = useState<ProfileData>({
    name: 'Patient',
    email: '',
    phone: '',
    role: 'client' as const
  })
  
  const currentProfile = viewCategory === 'therapist' ? therapistProfile : clientProfile

  // Fetch therapist profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return

      try {
        const { data, error } = await therapists.getByEmail(user.email)
        
        if (error) {
          console.error('Error fetching profile:', error)
          return
        }

        if (data) {
          setTherapistProfile({
            name: (data as any).name || 'Therapist',
            email: (data as any).email || user.email,
            phone: (data as any).phone || '',
            specialization: (data as any).specialization || '',
            licenseNumber: (data as any).license_number || '',
            bio: (data as any).bio || '',
            role: 'therapist'
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }

    fetchProfile()
  }, [user])

  // Fetch all sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return

      setIsLoadingSessions(true)
      try {
        const { data, error } = await sessionsAPI.getAll({
          therapistId: user.id
        })

        if (error) {
          console.error('Error fetching sessions:', error)
          return
        }

        if (data) {
          // Transform sessions to match our interface
          const transformedSessions: Session[] = (data as any[]).map(session => ({
            id: session.id,
            patient_id: session.patient_id,
            therapist_id: session.therapist_id,
            patient_name: session.patient?.name || 'Patient',
            type: session.session_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            time: new Date(session.scheduled_at).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }),
            scheduled_at: session.scheduled_at,
            duration: `${session.duration_minutes} min`,
            duration_minutes: session.duration_minutes,
            status: session.status,
            notes: session.notes
          }))

          setAllSessions(transformedSessions)
        }
      } catch (err) {
        console.error('Error loading sessions:', err)
      } finally {
        setIsLoadingSessions(false)
      }
    }

    fetchSessions()
  }, [user])

  // Get sessions for selected date
  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return allSessions.filter(session => {
      const sessionDate = new Date(session.scheduled_at)
      return sessionDate.toDateString() === dateStr
    })
  }

  const sessions = getSessionsForDate(selectedDate)

  // Generate week days starting from selected date
  const getWeekDays = () => {
    const days = []
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()) // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays()

  // Get sessions for a specific day
  const getSessionsForDay = (date: Date) => {
    const dateStr = date.toDateString()
    return allSessions.filter(session => {
      const sessionDate = new Date(session.scheduled_at)
      return sessionDate.toDateString() === dateStr
    })
  }

  // Get all appointments across all days
  const getAllAppointments = () => {
    const allAppointments: Array<Session & { date: string }> = []
    
    // Add current day sessions
    sessions.forEach(session => {
      allAppointments.push({
        ...session,
        date: selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      })
    })

    // Add mock appointments for other days (these have 'patient' instead of 'patient_name')
    const mockAppointments = [
      { id: 'a1', patient_id: 'm1', therapist_id: user?.id || '', patient_name: 'Alice Cooper', type: 'Individual Therapy', time: '10:00 AM', scheduled_at: '2026-02-10T10:00:00', duration: '50 min', duration_minutes: 50, status: 'confirmed' as const, date: 'Feb 10, 2026' },
      { id: 'a2', patient_id: 'm2', therapist_id: user?.id || '', patient_name: 'Bob Martin', type: 'Group Therapy', time: '03:00 PM', scheduled_at: '2026-02-10T15:00:00', duration: '60 min', duration_minutes: 60, status: 'confirmed' as const, date: 'Feb 10, 2026' },
      { id: 'a3', patient_id: 'm3', therapist_id: user?.id || '', patient_name: 'Carol White', type: 'Couples Therapy', time: '11:00 AM', scheduled_at: '2026-02-12T11:00:00', duration: '60 min', duration_minutes: 60, status: 'pending' as const, date: 'Feb 12, 2026' },
      { id: 'a4', patient_id: 'm4', therapist_id: user?.id || '', patient_name: 'David Lee', type: 'Individual Therapy', time: '02:00 PM', scheduled_at: '2026-02-13T14:00:00', duration: '50 min', duration_minutes: 50, status: 'confirmed' as const, date: 'Feb 13, 2026' },
      { id: 'a5', patient_id: 'm5', therapist_id: user?.id || '', patient_name: 'Emma Stone', type: 'Family Therapy', time: '04:00 PM', scheduled_at: '2026-02-15T16:00:00', duration: '90 min', duration_minutes: 90, status: 'pending' as const, date: 'Feb 15, 2026' },
      { id: 'a6', patient_id: 'm6', therapist_id: user?.id || '', patient_name: 'Frank Miller', type: 'Individual Therapy', time: '09:30 AM', scheduled_at: '2026-02-17T09:30:00', duration: '50 min', duration_minutes: 50, status: 'confirmed' as const, date: 'Feb 17, 2026' },
      { id: 'a7', patient_id: 'm7', therapist_id: user?.id || '', patient_name: 'Grace Park', type: 'Group Therapy', time: '01:00 PM', scheduled_at: '2026-02-08T13:00:00', duration: '60 min', duration_minutes: 60, status: 'completed' as const, date: 'Feb 8, 2026' },
      { id: 'a8', patient_id: 'm8', therapist_id: user?.id || '', patient_name: 'Henry Ford', type: 'Individual Therapy', time: '11:00 AM', scheduled_at: '2026-02-09T11:00:00', duration: '50 min', duration_minutes: 50, status: 'cancelled' as const, date: 'Feb 9, 2026' },
    ]

    return [...allAppointments, ...mockAppointments].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  // Filter appointments based on selected filter
  const getFilteredAppointments = () => {
    const allAppointments = getAllAppointments()
    
    if (appointmentFilter === 'all') {
      return allAppointments
    }
    
    return allAppointments.filter(appointment => appointment.status === appointmentFilter)
  }

  // Get count for each status
  const getStatusCount = (status: 'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled') => {
    if (status === 'all') {
      return getAllAppointments().length
    }
    return getAllAppointments().filter(appointment => appointment.status === status).length
  }

  const handleAddSession = async (sessionData: SessionFormData) => {
    if (!user?.id) return

    try {
      if (editingSession) {
        // Update existing session
        const { data, error } = await sessionsAPI.update(editingSession.id, {
          patient_id: sessionData.patient_id,
          session_type: sessionData.session_type,
          scheduled_at: sessionData.scheduled_at,
          duration_minutes: sessionData.duration_minutes,
          notes: sessionData.notes
        })

        if (error) {
          console.error('Error updating session:', error)
          showToastMessage('Failed to update session')
          return
        }

        // Refresh sessions list
        const { data: updatedSessions } = await sessionsAPI.getAll({ therapistId: user.id })
        if (updatedSessions) {
          const transformedSessions: Session[] = (updatedSessions as any[]).map(session => ({
            id: session.id,
            patient_id: session.patient_id,
            therapist_id: session.therapist_id,
            patient_name: session.patient?.name || 'Patient',
            type: session.session_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            time: new Date(session.scheduled_at).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }),
            scheduled_at: session.scheduled_at,
            duration: `${session.duration_minutes} min`,
            duration_minutes: session.duration_minutes,
            status: session.status,
            notes: session.notes
          }))
          setAllSessions(transformedSessions)
        }

        showToastMessage('Session updated successfully!')
        setEditingSession(null)
      } else {
        // Add new session
        const { data, error } = await sessionsAPI.create({
          therapist_id: user.id,
          patient_id: sessionData.patient_id,
          session_type: sessionData.session_type,
          scheduled_at: sessionData.scheduled_at,
          duration_minutes: sessionData.duration_minutes,
          status: 'pending',
          notes: sessionData.notes
        })

        if (error) {
          console.error('Error creating session:', error)
          showToastMessage('Failed to create session')
          return
        }

        // Refresh sessions list
        const { data: updatedSessions } = await sessionsAPI.getAll({ therapistId: user.id })
        if (updatedSessions) {
          const transformedSessions: Session[] = (updatedSessions as any[]).map(session => ({
            id: session.id,
            patient_id: session.patient_id,
            therapist_id: session.therapist_id,
            patient_name: session.patient?.name || 'Patient',
            type: session.session_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            time: new Date(session.scheduled_at).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }),
            scheduled_at: session.scheduled_at,
            duration: `${session.duration_minutes} min`,
            duration_minutes: session.duration_minutes,
            status: session.status,
            notes: session.notes
          }))
          setAllSessions(transformedSessions)
        }

        showToastMessage('Session added successfully!')
      }
    } catch (err) {
      console.error('Error saving session:', err)
      showToastMessage('Failed to save session')
    }
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setIsModalOpen(true)
    setShowSessionDetails(false)
  }

  const handleBlockTime = () => {
    setIsBlockTimeModalOpen(true)
  }

  const handlePrintSchedule = () => {
    showToastMessage('Preparing schedule for print...')
    // In production, this would generate a PDF
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const handleViewAllAppointments = () => {
    setShowAllAppointments(true)
  }

  const handleScheduleSettings = () => {
    setShowSettingsPanel(!showSettingsPanel)
  }

  const handleSaveProfile = (data: typeof currentProfile) => {
    if (viewCategory === 'therapist') {
      setTherapistProfile(data as typeof therapistProfile)
    } else {
      setClientProfile(data as typeof clientProfile)
    }
    setIsProfileModalOpen(false)
    showToastMessage('Profile updated successfully!')
    // In production, save to Supabase
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session)
    setShowSessionDetails(true)
  }

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteSession = async () => {
    if (!sessionToDelete || !user?.id) return

    try {
      const { error } = await sessionsAPI.delete(sessionToDelete.id)

      if (error) {
        console.error('Error deleting session:', error)
        showToastMessage('Failed to cancel session')
        return
      }

      // Refresh sessions list
      const { data: updatedSessions } = await sessionsAPI.getAll({ therapistId: user.id })
      if (updatedSessions) {
        const transformedSessions: Session[] = (updatedSessions as any[]).map(session => ({
          id: session.id,
          patient_id: session.patient_id,
          therapist_id: session.therapist_id,
          patient_name: session.patient?.name || 'Patient',
          type: session.session_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          time: new Date(session.scheduled_at).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          scheduled_at: session.scheduled_at,
          duration: `${session.duration_minutes} min`,
          duration_minutes: session.duration_minutes,
          status: session.status,
          notes: session.notes
        }))
        setAllSessions(transformedSessions)
      }

      showToastMessage(`Session with ${sessionToDelete.patient_name} cancelled successfully`)
      setShowDeleteConfirm(false)
      setSessionToDelete(null)
      setShowSessionDetails(false)
    } catch (err) {
      console.error('Error cancelling session:', err)
      showToastMessage('Failed to cancel session')
    }
  }

  const handleOpenSessionNotes = (session: Session) => {
    setSessionForNotes(session)
    setShowSessionNotes(true)
    setShowSessionDetails(false)
  }

  const handleSaveSessionNotes = async (notes: string) => {
    if (!sessionForNotes || !user?.id) return

    try {
      const { error } = await sessionsAPI.updateNotes(sessionForNotes.id, notes)

      if (error) {
        console.error('Error saving notes:', error)
        showToastMessage('Failed to save session notes')
        return
      }

      // Refresh sessions list
      const { data: updatedSessions } = await sessionsAPI.getAll({ therapistId: user.id })
      if (updatedSessions) {
        const transformedSessions: Session[] = (updatedSessions as any[]).map(session => ({
          id: session.id,
          patient_id: session.patient_id,
          therapist_id: session.therapist_id,
          patient_name: session.patient?.name || 'Patient',
          type: session.session_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          time: new Date(session.scheduled_at).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          scheduled_at: session.scheduled_at,
          duration: `${session.duration_minutes} min`,
          duration_minutes: session.duration_minutes,
          status: session.status,
          notes: session.notes
        }))
        setAllSessions(transformedSessions)
      }

      showToastMessage('Session notes saved and session marked as completed!')
      setShowSessionNotes(false)
      setSessionForNotes(null)
    } catch (err) {
      console.error('Error saving notes:', err)
      showToastMessage('Failed to save session notes')
    }
  }

  const handleDayClick = (day: Date) => {
    setSelectedDayForModal(day)
    setShowDaySessionsModal(true)
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/therapist/login')
    }
  }, [user, router])

  // Keyboard shortcuts for better UX
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New Session
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setIsModalOpen(true)
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setIsModalOpen(false)
        setShowSessionDetails(false)
        setShowAllAppointments(false)
        setShowSettingsPanel(false)
        setIsBlockTimeModalOpen(false)
        setShowDeleteConfirm(false)
        setShowSessionNotes(false)
      }
      // Ctrl/Cmd + K: View all appointments
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowAllAppointments(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard">
              <Image 
                src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                alt="TherapyFlow" 
                width={550}
                height={700}
                className="h-12 sm:h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Toggle theme"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              {viewCategory === 'therapist' && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  title="New Session (Ctrl+N)"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                title={`${viewCategory === 'therapist' ? 'Dr. Sarah Johnson' : 'John Doe'} - View Profile`}
              >
                <span className="text-white font-medium text-sm">
                  {viewCategory === 'therapist' ? 'SJ' : 'JD'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Date and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Date Navigation */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 1)
                setSelectedDate(newDate)
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center min-w-[120px]">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
            
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 1)
                setSelectedDate(newDate)
              }}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => setSelectedDate(new Date())}
              className="ml-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-3">
            {/* Therapist/Client Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewCategory('therapist')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewCategory === 'therapist' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Therapist
              </button>
              <button
                onClick={() => setViewCategory('client')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewCategory === 'client' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Client
              </button>
            </div>

            {/* Day/Week Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'day' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'week' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={view === 'week' ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
          {/* Sessions List */}
          <div className={view === 'week' ? 'space-y-4' : 'lg:col-span-2 space-y-4'}>
            {view === 'day' ? (
            /* Day View */
            <>
              {sessions.length === 0 ? (
                <div className="card text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {viewCategory === 'therapist' ? 'No sessions scheduled for this day' : 'No appointments scheduled for this day'}
                  </p>
                  {viewCategory === 'therapist' && (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="btn-primary"
                    >
                      Schedule Session
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'}
                    </h2>
                  </div>
                  
                  {sessions.map((session) => (
                    <div 
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="card hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {session.patient_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {session.patient_name}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                session.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : session.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : session.status === 'completed'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{session.type}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {session.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {session.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenSessionNotes(session)
                            }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Session Notes"
                          >
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
              /* Week View - Consistent, Subtle Design */
              <div className="space-y-6">
                {/* Week Grid - Consistent Styling */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const daySessions = getSessionsForDay(day)
                    const isToday = day.toDateString() === new Date().toDateString()
                    const sessionCount = daySessions.length
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => handleDayClick(day)}
                        className={`group relative rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.03] backdrop-blur-md ${
                          isToday 
                            ? 'bg-blue-500/10 dark:bg-blue-500/20 border-2 border-blue-500/40 dark:border-blue-400/40 shadow-sm' 
                            : sessionCount > 0
                            ? 'bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-400/30 dark:hover:border-blue-500/30 hover:shadow-sm'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/30 hover:border-slate-300/50 dark:hover:border-slate-600/50'
                        }`}
                      >
                        {/* Session Count Badge - Consistent Blue */}
                        {sessionCount > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {sessionCount}
                          </div>
                        )}
                        
                        {/* Day Content */}
                        <div className="text-center">
                          <div className={`text-[9px] font-semibold uppercase tracking-wider mb-1 ${
                            isToday 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          
                          <div className={`text-2xl font-bold leading-none mb-0.5 ${
                            isToday 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : sessionCount > 0
                              ? 'text-slate-900 dark:text-slate-100'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}>
                            {day.getDate()}
                          </div>
                          
                          <div className={`text-[9px] font-medium ${
                            isToday 
                              ? 'text-blue-500 dark:text-blue-400' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {day.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        
                        {/* Status Indicators - Subtle Colors */}
                        {sessionCount > 0 && (
                          <div className="mt-2 flex justify-center gap-0.5">
                            {daySessions.slice(0, 5).map((session, idx) => (
                              <div 
                                key={idx}
                                className={`w-1 h-1 rounded-full ${
                                  session.status === 'confirmed' 
                                    ? 'bg-emerald-500 dark:bg-emerald-400' 
                                    : session.status === 'pending'
                                    ? 'bg-amber-500 dark:bg-amber-400'
                                    : session.status === 'completed'
                                    ? 'bg-blue-500 dark:bg-blue-400'
                                    : 'bg-slate-400 dark:bg-slate-500'
                                }`}
                              />
                            ))}
                            {sessionCount > 5 && (
                              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Week Summary - Consistent Subtle Design */}
                <div className="flex items-center justify-center gap-8 py-4 px-6 backdrop-blur-md bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weekDays.reduce((acc, day) => acc + getSessionsForDay(day).length, 0)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Sessions</div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-slate-200/50 dark:bg-slate-700/50" />

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weekDays.reduce((acc, day) => 
                          acc + getSessionsForDay(day).filter(s => s.status === 'confirmed').length, 0
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Confirmed</div>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-slate-200/50 dark:bg-slate-700/50" />

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {weekDays.reduce((acc, day) => 
                          acc + getSessionsForDay(day).filter(s => s.status === 'pending').length, 0
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Only show in day view */}
          {view === 'day' && (
            <div className="space-y-6">
            {/* Mini Calendar */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Calendar</h3>
              <div className="text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-slate-500 dark:text-slate-500 font-medium py-2">{day}</div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => (
                    <button
                      key={i}
                      className={`py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        i === 15 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Today's Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Total Sessions</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{sessions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Confirmed</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {sessions.filter(s => s.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Scheduled</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {sessions.filter(s => s.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Total Hours</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">4.5 hrs</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h3>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Add Session - Primary Action */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-200 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Add Session</div>
                        <div className="text-xs text-blue-100 dark:text-blue-200">Schedule new appointment</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>

                {/* Block Time */}
                <button 
                  onClick={handleBlockTime}
                  className="group w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Block Time</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Reserve time slot</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Print Schedule */}
                <button 
                  onClick={handlePrintSchedule}
                  className="group w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Print Schedule</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Export to PDF</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>

              {/* Additional Quick Links */}
              <div className="space-y-2">
                <button 
                  onClick={handleViewAllAppointments}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>View All Appointments</span>
                  </span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button 
                  onClick={handleScheduleSettings}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Schedule Settings</span>
                  </span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Add Session Modal */}
      <AddSessionModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSession(null)
        }}
        onSubmit={handleAddSession}
        editSession={editingSession}
      />

      {/* Block Time Modal */}
      {isBlockTimeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Block Time</h2>
              <button 
                onClick={() => setIsBlockTimeModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              showToastMessage('Time blocked successfully!')
              setIsBlockTimeModalOpen(false)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedDate.toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lunch break, Personal time"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="recurring" className="text-sm text-slate-700 dark:text-slate-300">
                    Repeat weekly
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBlockTimeModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Block Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettingsPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Schedule Settings</h2>
              <button 
                onClick={() => setShowSettingsPanel(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Working Hours */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Working Hours</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
                      <input type="time" defaultValue="09:00" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">End Time</label>
                      <input type="time" defaultValue="17:00" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Time Zone</label>
                      <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                        <option>EST</option>
                        <option>PST</option>
                        <option>CST</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Defaults */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Session Defaults</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Default Duration</label>
                    <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                      <option>30 minutes</option>
                      <option selected>50 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Buffer Time Between Sessions</label>
                    <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                      <option>No buffer</option>
                      <option selected>10 minutes</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Email reminders 24 hours before session</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">SMS reminders 1 hour before session</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Notify on cancellations</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSettingsPanel(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToastMessage('Settings saved successfully!')
                    setShowSettingsPanel(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Appointments Modal */}
      {showAllAppointments && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Appointments</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {getFilteredAppointments().length} {appointmentFilter === 'all' ? 'total' : appointmentFilter} appointments
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAllAppointments(false)
                  setAppointmentFilter('all')
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setAppointmentFilter('all')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  All ({getStatusCount('all')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('confirmed')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'confirmed'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Confirmed ({getStatusCount('confirmed')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('pending')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'pending'
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Scheduled ({getStatusCount('scheduled')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('completed')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'completed'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Completed ({getStatusCount('completed')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('cancelled')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'cancelled'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Cancelled ({getStatusCount('cancelled')})
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="flex-1 overflow-y-auto p-6">
              {getFilteredAppointments().length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400">No {appointmentFilter === 'all' ? '' : appointmentFilter} appointments found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredAppointments().map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-200 dark:border-slate-600 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                              {appointment.patient_name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {appointment.patient_name}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {appointment.type}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {appointment.date}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {appointment.time}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {appointment.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {getFilteredAppointments().length} of {getAllAppointments().length} appointments
                </div>
                <button
                  onClick={() => {
                    setShowAllAppointments(false)
                    setAppointmentFilter('all')
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Modal - Subtle Dark Theme */}
      {showSessionDetails && selectedSession && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-700/50">
            {/* Header - Subtle Blue */}
            <div className="bg-slate-800 border-b border-slate-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-slate-700/50 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-slate-600/50">
                      <span className="text-slate-200 font-bold text-2xl">
                        {selectedSession.patient_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 ${
                      selectedSession.status === 'confirmed' ? 'bg-emerald-500/80' :
                      selectedSession.status === 'pending' ? 'bg-amber-500/80' :
                      'bg-slate-500'
                    }`}></div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">
                      {selectedSession.patient_name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-3 py-1 bg-slate-700/50 backdrop-blur-sm rounded-full text-slate-300 text-sm font-medium">
                        {selectedSession.type}
                      </span>
                      <span className="px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-xs font-medium uppercase">
                        {selectedSession.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowSessionDetails(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - Subtle Cards */}
            <div className="p-8 space-y-6 bg-slate-900/50">
              {/* Info Cards - Consistent Subtle Design */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</div>
                  </div>
                  <div className="text-xl font-bold text-slate-200">{selectedSession.time}</div>
                </div>

                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</div>
                  </div>
                  <div className="text-xl font-bold text-slate-200">{selectedSession.duration}</div>
                </div>

                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-4 border border-slate-600/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</div>
                  </div>
                  <div className="text-sm font-bold text-slate-200 leading-tight">{selectedSession.type}</div>
                </div>
              </div>

              {/* Action Buttons - Subtle Theme */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/video/${selectedSession.id}`}
                  className="w-full bg-blue-600/80 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Join Video Call</span>
                </Link>

                {viewCategory === 'therapist' ? (
                  <div className="space-y-3">
                    <button 
                      onClick={() => selectedSession && handleOpenSessionNotes(selectedSession)}
                      className="w-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Add Session Notes</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => selectedSession && handleEditSession(selectedSession)}
                        className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-600/30"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteSession(selectedSession)}
                        className="bg-slate-700/50 hover:bg-red-900/30 text-slate-300 hover:text-red-400 border border-slate-600/30 hover:border-red-800/50 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowSessionDetails(false)}
                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all border border-slate-600/30"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && sessionToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cancel Session?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-600">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                You are about to cancel the session with:
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {sessionToDelete.patient_name}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {sessionToDelete.type} • {sessionToDelete.time}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSessionToDelete(null)
                }}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all"
              >
                Keep Session
              </button>
              <button
                onClick={confirmDeleteSession}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all"
              >
                Cancel Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={currentProfile}
        onSave={handleSaveProfile}
      />

      {/* Session Notes Modal */}
      {showSessionNotes && sessionForNotes && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8">
            <SessionNotes
              sessionId={sessionForNotes.id}
              initialNotes={sessionForNotes.notes || ''}
              onSave={handleSaveSessionNotes}
            />
          </div>
        </div>
      )}

      {/* Day Sessions Modal - Dark Theme with Colored Borders */}
      {showDaySessionsModal && selectedDayForModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700/50">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    {selectedDayForModal.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {getSessionsForDay(selectedDayForModal).length} {getSessionsForDay(selectedDayForModal).length === 1 ? 'session' : 'sessions'} scheduled
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowDaySessionsModal(false)
                    setSelectedDayForModal(null)
                  }}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 max-h-[calc(90vh-200px)]">
              {getSessionsForDay(selectedDayForModal).length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400">No sessions scheduled for this day</p>
                </div>
              ) : (
                getSessionsForDay(selectedDayForModal).map((session) => (
                  <div 
                    key={session.id}
                    onClick={() => {
                      setShowDaySessionsModal(false)
                      handleSessionClick(session)
                    }}
                    className={`group p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-700/30 border-2 ${
                      session.status === 'confirmed' 
                        ? 'border-emerald-500/50 hover:border-emerald-500/70' 
                        : session.status === 'pending'
                        ? 'border-amber-500/50 hover:border-amber-500/70'
                        : 'border-slate-600/50 hover:border-slate-600/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {session.patient_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-slate-100">
                              {session.patient_name}
                            </h3>
                            <span className={`text-xs font-medium ${
                              session.status === 'confirmed' 
                                ? 'text-emerald-400' 
                                : session.status === 'pending'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">
                            {session.type}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {session.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
              <button
                onClick={() => {
                  setShowDaySessionsModal(false)
                  setSelectedDayForModal(null)
                }}
                className="w-full px-4 py-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
