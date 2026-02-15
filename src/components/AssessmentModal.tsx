'use client'

import { useState } from 'react'

interface AssessmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AssessmentData) => void
}

export interface AssessmentData {
  assessmentType: string
  responses: Record<string, number>
  score: number
}

// PHQ-9 Depression Assessment Questions
const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself or that you are a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly, or being fidgety or restless',
  'Thoughts that you would be better off dead or hurting yourself'
]

// GAD-7 Anxiety Assessment Questions
const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen'
]

const RESPONSE_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
]

export default function AssessmentModal({ isOpen, onClose, onSubmit }: AssessmentModalProps) {
  const [assessmentType, setAssessmentType] = useState<'phq9' | 'gad7' | null>(null)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [currentStep, setCurrentStep] = useState<'select' | 'questions' | 'results'>('select')

  if (!isOpen) return null

  const questions = assessmentType === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS
  const totalQuestions = questions.length

  const handleSelectAssessment = (type: 'phq9' | 'gad7') => {
    setAssessmentType(type)
    setResponses({})
    setCurrentStep('questions')
  }

  const handleResponseChange = (questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }))
  }

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, val) => sum + val, 0)
  }

  const getScoreInterpretation = (score: number, type: 'phq9' | 'gad7') => {
    if (type === 'phq9') {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' }
      if (score <= 9) return { level: 'Mild', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' }
      if (score <= 14) return { level: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' }
      if (score <= 19) return { level: 'Moderately Severe', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' }
      return { level: 'Severe', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' }
    } else {
      if (score <= 4) return { level: 'Minimal', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' }
      if (score <= 9) return { level: 'Mild', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' }
      if (score <= 14) return { level: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' }
      return { level: 'Severe', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' }
    }
  }

  const handleSubmit = () => {
    const score = calculateScore()
    onSubmit({
      assessmentType: assessmentType === 'phq9' ? 'PHQ-9' : 'GAD-7',
      responses,
      score
    })
    handleClose()
  }

  const handleClose = () => {
    setAssessmentType(null)
    setResponses({})
    setCurrentStep('select')
    onClose()
  }

  const allQuestionsAnswered = Object.keys(responses).length === totalQuestions

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mental Health Assessment</h2>
              <p className="text-purple-100 text-sm">
                {currentStep === 'select' && 'Choose an assessment'}
                {currentStep === 'questions' && `${assessmentType === 'phq9' ? 'PHQ-9 Depression' : 'GAD-7 Anxiety'} Screening`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Select Assessment */}
          {currentStep === 'select' && (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Select a standardized assessment to complete. These assessments help track your mental health and provide valuable insights for your therapist.
              </p>

              <button
                onClick={() => handleSelectAssessment('phq9')}
                className="w-full text-left p-6 bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
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
                  </div>
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => handleSelectAssessment('gad7')}
                className="w-full text-left p-6 bg-slate-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
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
                  </div>
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 'questions' && assessmentType && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Instructions:</strong> Over the last 2 weeks, how often have you been bothered by the following problems?
                </p>
              </div>

              {questions.map((question, index) => (
                <div key={index} className="space-y-3">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {index + 1}. {question}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {RESPONSE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleResponseChange(index, option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          responses[index] === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setCurrentStep('select')}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {allQuestionsAnswered ? 'Submit Assessment' : `Answer all questions (${Object.keys(responses).length}/${totalQuestions})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
