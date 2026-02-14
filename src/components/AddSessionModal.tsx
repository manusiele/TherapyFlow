'use client'

import { useState } from 'react'

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (sessionData: SessionFormData) => void
}

export interface SessionFormData {
  patient_id: string
  session_type: string
  scheduled_at: string
  duration_minutes: number
  notes: string
}

export default function AddSessionModal({ isOpen, onClose, onSubmit }: AddSessionModalProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    patient_id: '',
    session_type: 'individual',
    scheduled_at: '',
    duration_minutes: 50,
    notes: ''
  })

  // Mock patient data - would come from Redux/Supabase
  const patients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Emily Davis' },
    { id: '5', name: 'Robert Wilson' },
  ]

  const sessionTypes = [
    'Individual Therapy',
    'Couples Therapy',
    'Family Therapy',
    'Group Therapy',
    'Initial Consultation',
    'Follow-up',
  ]

  const durations = [30, 45, 50, 60, 90, 120]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form
    setFormData({
      patient_id: '',
      session_type: 'individual',
      scheduled_at: '',
      duration_minutes: 50,
      notes: ''
    })
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Schedule New Session</h2>
              <p className="text-sm text-slate-600 mt-1">Add a new therapy session to your calendar</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Patient Selection */}
              <div>
                <label htmlFor="patient_id" className="block text-sm font-medium text-slate-700 mb-2">
                  Patient
                </label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Type */}
              <div>
                <label htmlFor="session_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Session Type
                </label>
                <select
                  id="session_type"
                  name="session_type"
                  value={formData.session_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {sessionTypes.map(type => (
                    <option key={type} value={type.toLowerCase().replace(/ /g, '_')}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduled_at" className="block text-sm font-medium text-slate-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduled_at"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-slate-700 mb-2">
                    Duration
                  </label>
                  <select
                    id="duration_minutes"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>
                        {duration} minutes
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add any additional notes or preparation details..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Schedule Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
