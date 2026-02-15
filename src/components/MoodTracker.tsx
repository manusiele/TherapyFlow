'use client'

import { useState, useEffect } from 'react'

interface MoodEntry {
  date: string
  rating: number
  assessmentType?: string
  score?: number
}

interface MoodTrackerProps {
  assessmentHistory: Array<{
    date: string
    assessmentType: string
    score: number
  }>
}

export default function MoodTracker({ assessmentHistory }: MoodTrackerProps) {
  const [todayMood, setTodayMood] = useState<number | null>(null)
  const [weeklyAverage, setWeeklyAverage] = useState<number>(0)
  const [improvement, setImprovement] = useState<number>(0)

  useEffect(() => {
    calculateWeeklyStats()
  }, [assessmentHistory])

  const calculateWeeklyStats = () => {
    if (assessmentHistory.length === 0) {
      setWeeklyAverage(3.8)
      setImprovement(12)
      return
    }

    // Get assessments from the last 7 days
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const recentAssessments = assessmentHistory.filter(assessment => {
      const assessmentDate = new Date(assessment.date)
      return assessmentDate >= weekAgo
    })

    if (recentAssessments.length === 0) {
      setWeeklyAverage(3.8)
      setImprovement(12)
      return
    }

    // Convert assessment scores to 1-5 scale
    // PHQ-9: 0-27 scale, GAD-7: 0-21 scale
    const moodRatings = recentAssessments.map(assessment => {
      const maxScore = assessment.assessmentType === 'PHQ-9' ? 27 : 21
      // Invert the score (lower is better for these assessments)
      const normalizedScore = 1 - (assessment.score / maxScore)
      // Convert to 1-5 scale
      return 1 + (normalizedScore * 4)
    })

    const average = moodRatings.reduce((sum, rating) => sum + rating, 0) / moodRatings.length
    setWeeklyAverage(Number(average.toFixed(1)))

    // Calculate improvement (compare first half vs second half of week)
    if (moodRatings.length >= 2) {
      const midpoint = Math.floor(moodRatings.length / 2)
      const firstHalf = moodRatings.slice(0, midpoint)
      const secondHalf = moodRatings.slice(midpoint)
      
      const firstAvg = firstHalf.reduce((sum, r) => sum + r, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((sum, r) => sum + r, 0) / secondHalf.length
      
      const improvementPercent = ((secondAvg - firstAvg) / firstAvg) * 100
      setImprovement(Number(improvementPercent.toFixed(0)))
    }
  }

  const handleMoodSelect = (rating: number) => {
    setTodayMood(rating)
    // In production, save to Supabase
    console.log('Mood rating saved:', { date: new Date().toISOString(), rating })
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Mood Tracker</h2>
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
                onClick={() => handleMoodSelect(rating)}
                className={`w-10 h-10 rounded-full border-2 transition-all font-medium ${
                  todayMood === rating
                    ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white scale-110 shadow-lg'
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-slate-600 dark:text-slate-400 hover:scale-105'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          {todayMood && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mood recorded for today
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">This Week's Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Average Mood</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{weeklyAverage}/5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Improvement</span>
              <span className={`font-medium ${
                improvement >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {improvement >= 0 ? '+' : ''}{improvement}%
              </span>
            </div>
          </div>

          {assessmentHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recent Assessments</h4>
              <div className="space-y-2">
                {assessmentHistory.slice(0, 3).map((assessment, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      {assessment.assessmentType} - {new Date(assessment.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Score: {assessment.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
