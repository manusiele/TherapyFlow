'use client'

import { useState } from 'react'

interface SessionNotesProps {
  sessionId: string
  initialNotes?: string
  onSave: (notes: string) => void
}

export default function SessionNotes({ sessionId, initialNotes = '', onSave }: SessionNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [goals, setGoals] = useState('')
  const [homework, setHomework] = useState('')
  const [sessionType, setSessionType] = useState('individual')
  const [duration, setDuration] = useState('50')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Combine all notes into one string
      const fullNotes = `Clinical Notes:\n${notes}\n\nSession Goals:\n${goals}\n\nHomework/Action Items:\n${homework}\n\nSession Type: ${sessionType}\nDuration: ${duration} minutes`
      await onSave(fullNotes)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Session Notes</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Session ID: {sessionId}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">Auto-saved</span>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Clinical Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter detailed session notes, observations, treatment progress, and next steps..."
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-64"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Session Goals
            </label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="What were the primary goals for this session?"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Homework/Action Items
            </label>
            <textarea
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              placeholder="Assignments or tasks for the patient to complete..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <select 
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="individual">Session Type: Individual</option>
              <option value="group">Session Type: Group</option>
              <option value="couples">Session Type: Couples</option>
              <option value="family">Session Type: Family</option>
            </select>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">Duration: 30 minutes</option>
              <option value="50">Duration: 50 minutes</option>
              <option value="60">Duration: 60 minutes</option>
              <option value="90">Duration: 90 minutes</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Complete Session'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}