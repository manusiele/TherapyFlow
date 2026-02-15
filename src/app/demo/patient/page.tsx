'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

export default function PatientDemoPage() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'portal' | 'assessments' | 'resources'>('portal')
  const [moodRating, setMoodRating] = useState<number | null>(null)

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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Patient Demo</h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Interactive Preview</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/patient/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium">
            🎯 Demo Mode - Explore patient features without signing up
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'portal'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Portal
              {activeTab === 'portal' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('assessments')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'assessments'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Assessments
              {activeTab === 'assessments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'resources'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Resources
              {activeTab === 'resources' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'portal' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Patient Portal</h2>
              <p className="text-slate-600 dark:text-slate-400">Your wellness journey dashboard</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Book Session</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Schedule appointment</p>
                  </div>
                </div>
              </div>

              <div className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Take Assessment</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Wellness check</p>
                  </div>
                </div>
              </div>

              <div className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resources</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Therapy materials</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Upcoming Sessions */}
              <div className="card">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Upcoming Sessions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Dr. Sarah Johnson</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Individual Therapy</p>
                      </div>
                      <span className="text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-full">Tomorrow</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">2:00 PM - 2:50 PM</span>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Join Video</button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Dr. Sarah Johnson</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Follow-up Session</p>
                      </div>
                      <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">Next Week</span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Monday, 2:00 PM - 2:50 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Tracker */}
              <div className="card">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Mood Tracker</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-700 dark:text-slate-300">How are you feeling today?</span>
                      <span className="text-sm text-slate-500 dark:text-slate-500">Rate 1-5</span>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMoodRating(rating)}
                          className={`w-10 h-10 rounded-full border-2 transition-all font-medium ${
                            moodRating === rating
                              ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white scale-110 shadow-lg'
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-slate-600 dark:text-slate-400 hover:scale-105'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    {moodRating && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mood recorded for today
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">This Week's Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Average Mood</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">3.8/5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Improvement</span>
                        <span className="font-medium text-green-600 dark:text-green-400">+12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Resources */}
              <div className="card">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Quick Resources</h3>
                <div className="space-y-3">
                  {[
                    { icon: '📚', title: 'Coping Strategies', desc: 'Stress management' },
                    { icon: '🧘', title: 'Mindfulness', desc: 'Meditation guides' },
                    { icon: '📝', title: 'Journal Prompts', desc: 'Daily reflection' },
                    { icon: '📞', title: 'Crisis Support', desc: '24/7 hotlines' }
                  ].map((resource, i) => (
                    <button key={i} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{resource.icon}</span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{resource.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{resource.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Mental Health Assessments</h2>
              <p className="text-slate-600 dark:text-slate-400">Track your wellness with standardized tools</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">PHQ-9 Depression Screening</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      9 questions • 2-3 minutes
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Measures depression severity over the past 2 weeks
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Start Assessment
                    </button>
                  </div>
                </div>
              </div>

              <div className="card hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">GAD-7 Anxiety Screening</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      7 questions • 2 minutes
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Measures anxiety severity over the past 2 weeks
                    </p>
                    <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Start Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Assessment History</h3>
              <div className="space-y-3">
                {[
                  { type: 'PHQ-9', date: 'Feb 10, 2024', score: 8, level: 'Mild', color: 'blue' },
                  { type: 'GAD-7', date: 'Feb 8, 2024', score: 6, level: 'Mild', color: 'purple' },
                  { type: 'PHQ-9', date: 'Feb 3, 2024', score: 12, level: 'Moderate', color: 'yellow' }
                ].map((assessment, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 bg-${assessment.color}-100 dark:bg-${assessment.color}-900/30 rounded-lg flex items-center justify-center`}>
                        <span className={`text-${assessment.color}-600 dark:text-${assessment.color}-400 font-bold text-sm`}>
                          {assessment.score}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{assessment.type} Assessment</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{assessment.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 bg-${assessment.color}-100 dark:bg-${assessment.color}-900/30 text-${assessment.color}-700 dark:text-${assessment.color}-400 text-sm font-medium rounded-full`}>
                      {assessment.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Wellness Resources</h2>
              <p className="text-slate-600 dark:text-slate-400">Tools and guides for your mental health journey</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '📚',
                  title: 'Coping Strategies',
                  desc: 'Techniques for managing stress',
                  items: ['Deep breathing exercises', 'Progressive muscle relaxation', 'Grounding techniques', 'Journaling prompts']
                },
                {
                  icon: '🧘',
                  title: 'Mindfulness Exercises',
                  desc: 'Guided meditation and breathing',
                  items: ['Body scan meditation', 'Mindful breathing', 'Walking meditation', '4-7-8 breathing']
                },
                {
                  icon: '📝',
                  title: 'Journal Prompts',
                  desc: 'Daily reflection questions',
                  items: ['What am I grateful for?', 'What challenged me today?', 'What did I learn?', 'What am I looking forward to?']
                },
                {
                  icon: '📞',
                  title: 'Crisis Support',
                  desc: '24/7 emergency contacts',
                  items: ['988 Suicide & Crisis Lifeline', 'Crisis Text Line: 741741', 'SAMHSA Helpline', 'Emergency: 911']
                }
              ].map((resource, i) => (
                <div key={i} className="card hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <span className="text-4xl">{resource.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{resource.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{resource.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {resource.items.map((item, j) => (
                      <li key={j} className="flex items-start space-x-2 text-sm text-slate-700 dark:text-slate-300">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors">
                    View All
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 card bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-2">Start Your Wellness Journey</h3>
            <p className="text-blue-100 mb-6">Join thousands taking control of their mental health with TherapyFlow</p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/auth/patient/signup" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
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
