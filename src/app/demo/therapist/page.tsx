'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

export default function TherapistDemoPage() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'sessions'>('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image 
                  src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                  alt="TherapyFlow" 
                  width={300}
                  height={60}
                  className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
              <div className="border-l border-slate-300 dark:border-slate-600 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Therapist Demo</h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Interactive Preview</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/therapist/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium">
            🎯 Demo Mode - Explore therapist features without signing up
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'dashboard'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Dashboard
              {activeTab === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'schedule'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Schedule
              {activeTab === 'schedule' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'sessions'
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Session Notes
              {activeTab === 'sessions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Dashboard Overview</h2>
              <p className="text-slate-600 dark:text-slate-400">Manage your practice at a glance</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">8</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Today's Sessions</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">24</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Patients</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">92%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Attendance Rate</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">3</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Pending Notes</div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="card">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Today's Schedule</h3>
              <div className="space-y-3">
                {[
                  { time: '09:00 AM', patient: 'John Doe', type: 'Individual Therapy', status: 'confirmed' },
                  { time: '10:30 AM', patient: 'Jane Smith', type: 'Couples Therapy', status: 'confirmed' },
                  { time: '02:00 PM', patient: 'Michael Brown', type: 'Initial Consultation', status: 'scheduled' },
                  { time: '03:30 PM', patient: 'Emily Davis', type: 'Individual Therapy', status: 'confirmed' },
                ].map((session, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                          {session.patient.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{session.patient}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{session.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{session.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        session.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {[
                    'Schedule management with calendar view',
                    'Session notes with clinical templates',
                    'Patient progress tracking',
                    'Assessment tools (PHQ-9, GAD-7)',
                    'Secure messaging system',
                    'Video call integration'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: '✅', text: 'Session completed with John Doe', time: '2 hours ago' },
                    { icon: '📊', text: 'PHQ-9 assessment submitted', time: '4 hours ago' },
                    { icon: '👤', text: 'New patient registration', time: 'Yesterday' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100">{activity.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Schedule Management</h2>
              <p className="text-slate-600 dark:text-slate-400">Organize your appointments efficiently</p>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Week View</h3>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Day
                  </button>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Week
                  </button>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Month
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{day}</div>
                    <div className={`p-4 rounded-lg border-2 ${
                      i === 2 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{10 + i}</div>
                      {i === 2 && (
                        <div className="space-y-1">
                          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-1 rounded">9:00 AM</div>
                          <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-1 rounded">2:00 PM</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Add Session</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Block Time</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Print Schedule</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="card md:col-span-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Upcoming Sessions</h4>
                <div className="space-y-2">
                  {[
                    { patient: 'Sarah Johnson', time: 'Tomorrow, 9:00 AM', type: 'Follow-up' },
                    { patient: 'Mike Wilson', time: 'Tomorrow, 11:00 AM', type: 'Initial' },
                    { patient: 'Emma Davis', time: 'Friday, 2:00 PM', type: 'Therapy' }
                  ].map((session, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{session.patient}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{session.type}</p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{session.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Session Notes</h2>
              <p className="text-slate-600 dark:text-slate-400">Document and track patient progress</p>
            </div>

            <div className="card">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Clinical Notes Template</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Session ID: DEMO-001 • Patient: John Doe</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Clinical Observations
                  </label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Patient presented with improved mood and affect. Demonstrated good engagement throughout the session. 
                      Discussed coping strategies for managing work-related stress. Patient reported using deep breathing 
                      techniques successfully this week.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Session Goals
                    </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                      <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        <li>• Review homework from previous session</li>
                        <li>• Practice mindfulness techniques</li>
                        <li>• Discuss workplace boundaries</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Homework/Action Items
                    </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                      <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        <li>• Practice 10-minute meditation daily</li>
                        <li>• Journal about work stressors</li>
                        <li>• Complete PHQ-9 assessment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Session Type: Individual</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Duration: 50 minutes</span>
                  </div>
                  <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                    Complete Session
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '📝', title: 'Structured Templates', desc: 'Pre-built clinical note templates' },
                  { icon: '🔒', title: 'HIPAA Compliant', desc: 'Secure and encrypted storage' },
                  { icon: '📊', title: 'Progress Tracking', desc: 'Visual patient progress charts' },
                  { icon: '🔍', title: 'Search & Filter', desc: 'Quick access to past sessions' }
                ].map((feature, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{feature.icon}</span>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">{feature.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 card bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-purple-100 mb-6">Join thousands of therapists managing their practice with TherapyFlow</p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/auth/therapist/signup" className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors">
                Create Account
              </Link>
              <Link href="/" className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
