'use client'

import { useState, useEffect } from 'react'

export default function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // Show prompt if permission is default and user hasn't dismissed recently
      const dismissed = localStorage.getItem('notification-prompt-dismissed')
      if (Notification.permission === 'default' && !dismissed) {
        // Show after 5 seconds
        setTimeout(() => setShowPrompt(true), 5000)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShowPrompt(false)
      
      if (result === 'granted') {
        // Register for push notifications
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const registration = await navigator.serviceWorker.ready
            // Show success feedback
            new Notification('TherapyFlow Notifications Enabled', {
              body: 'You will now receive appointment reminders and important updates.',
              icon: '/logo/logo-icon.png',
              badge: '/logo/logo-icon.png',
            })
            console.log('Push notification subscription ready')
          } catch (error) {
            console.error('Push subscription failed:', error)
          }
        }
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('notification-prompt-dismissed', Date.now().toString())
  }

  if (!showPrompt || permission !== 'default') return null

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm animate-slide-down">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Enable Notifications
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Get notified about appointments, messages, and important updates.
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={requestPermission}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Allow
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
