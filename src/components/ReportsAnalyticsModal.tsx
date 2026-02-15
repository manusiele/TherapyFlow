'use client'

import { useState } from 'react'

interface ReportsAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  userRole: 'therapist' | 'patient'
}

export default function ReportsAnalyticsModal({ 
  isOpen, 
  onClose,
  userRole 
}: ReportsAnalyticsModalProps) {
  const [selectedReport, setSelectedReport] = useState<string>('overview')
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf')

  // Mock data - in production, fetch from database
  const therapistStats = {
    totalSessions: 156,
    completedSessions: 142,
    cancelledSessions: 14,
    activePatients: 24,
    averageSessionDuration: 52,
    attendanceRate: 91,
    revenue: 15600,
    hoursWorked: 136
  }

  const patientStats = {
    totalSessions: 12,
    completedSessions: 11,
    missedSessions: 1,
    assessmentScores: {
      phq9: [12, 10, 8, 7, 6],
      gad7: [14, 12, 10, 9, 7]
    },
    moodTrend: 'improving',
    adherenceRate: 92
  }

  const handleExport = () => {
    console.log(`Exporting ${selectedReport} as ${exportFormat}`)
    // In production, generate and download report
    alert(`Report exported as ${exportFormat.toUpperCase()}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reports & Analytics</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {userRole === 'therapist' ? 'Practice insights and performance metrics' : 'Your progress and wellness journey'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
            <div className="space-y-2">
              <button
                onClick={() => setSelectedReport('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedReport === 'overview'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">Overview</span>
                </div>
              </button>

              {userRole === 'therapist' ? (
                <>
                  <button
                    onClick={() => setSelectedReport('sessions')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport === 'sessions'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Sessions</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('patients')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport === 'patients'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Patients</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('revenue')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport === 'revenue'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Revenue</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedReport('progress')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport === 'progress'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="font-medium">Progress</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('assessments')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport === 'assessments'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-medium">Assessments</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('mood')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedReport === 'mood'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Mood Trends</span>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Date Range Selector */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            {/* Export Button */}
            <div className="mt-4">
              <button
                onClick={handleExport}
                className="w-full btn-primary py-2 text-sm flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Report</span>
              </button>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="w-full mt-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedReport === 'overview' && userRole === 'therapist' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Practice Overview</h3>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{therapistStats.totalSessions}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Sessions</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{therapistStats.activePatients}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Active Patients</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{therapistStats.attendanceRate}%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Attendance Rate</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">${therapistStats.revenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Revenue</div>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="card">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Session Trends</h4>
                  <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>Chart visualization would appear here</p>
                      <p className="text-sm mt-1">Install chart library (Chart.js, Recharts, etc.)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'overview' && userRole === 'patient' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your Progress Overview</h3>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{patientStats.completedSessions}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sessions Completed</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{patientStats.adherenceRate}%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Adherence Rate</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 capitalize">{patientStats.moodTrend}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Mood Trend</div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="card">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Assessment Score Trends</h4>
                  <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <p>PHQ-9 and GAD-7 score trends over time</p>
                      <p className="text-sm mt-1">Lower scores indicate improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other report types would be rendered here */}
            {selectedReport !== 'overview' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">Report: {selectedReport}</p>
                  <p className="text-sm mt-2">Detailed {selectedReport} analytics would appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
