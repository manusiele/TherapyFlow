'use client'

import { useState, useEffect } from 'react'
import { therapists } from '@/lib/supabase'

interface BookSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: BookingData) => Promise<void>
  isSubmitting?: boolean
}

export interface BookingData {
  therapistId: string
  sessionType: string
  preferredDate: string
  preferredTime: string
  notes: string
}

interface Therapist {
  id: string
  name: string
  specialization: string
}

export default function BookSessionModal({ isOpen, onClose, onSubmit, isSubmitting = false }: BookSessionModalProps) {
  const [formData, setFormData] = useState<BookingData>({
    therapistId: '',
    sessionType: 'individual',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  })
  const [therapistsList, setTherapistsList] = useState<Therapist[]>([])
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(true)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  // Fetch therapists from database
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoadingTherapists(true)
        const { data, error } = await therapists.getAll()
        
        if (error) {
          console.error('Error fetching therapists:', error)
          return
        }

        if (data) {
          setTherapistsList(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            specialization: t.specialization || 'General Therapy'
          })))
        }
      } catch (err) {
        console.error('Error loading therapists:', err)
      } finally {
        setIsLoadingTherapists(false)
      }
    }

    if (isOpen) {
      fetchTherapists()
      setShowSuccessNotification(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    
    // Show success notification
    setShowSuccessNotification(true)
    
    // Reset form
    setFormData({
      therapistId: '',
      sessionType: 'individual',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    })
    
    // Hide notification and close modal after 2 seconds
    setTimeout(() => {
      setShowSuccessNotification(false)
      onClose()
    }, 2000)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Success Notification - Appears on top */}
      {showSuccessNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-slide-down">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-green-200 dark:border-green-800 px-6 py-4 flex items-center gap-3 min-w-[320px]">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Booking Sent!</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Check your messages for details</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Book a Session</h2>
              <p className="text-blue-100 text-sm">Schedule your next appointment</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Select Therapist */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Therapist <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.therapistId}
                  onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 appearance-none cursor-pointer transition-colors"
                  required
                  disabled={isLoadingTherapists || isSubmitting}
                >
                  <option value="">
                    {isLoadingTherapists ? 'Loading therapists...' : 'Choose a therapist'}
                  </option>
                  {therapistsList.map(therapist => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name} • {therapist.specialization}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Session Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 appearance-none cursor-pointer transition-colors"
                  required
                  disabled={isSubmitting}
                >
                  <option value="individual">Individual Therapy</option>
                  <option value="couples">Couples Therapy</option>
                  <option value="family">Family Therapy</option>
                  <option value="group">Group Therapy</option>
                  <option value="consultation">Initial Consultation</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Any specific concerns or topics you'd like to discuss..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-blue-900 dark:text-blue-200">
                  <p className="font-medium mb-1">Booking Request</p>
                  <p className="text-blue-700 dark:text-blue-300">Your request will be sent to the therapist for confirmation. You'll receive a notification once approved.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Request Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
