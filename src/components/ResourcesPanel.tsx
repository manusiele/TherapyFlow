'use client'

import { useState } from 'react'

interface Resource {
  id: string
  icon: string
  title: string
  description: string
  content: string[]
}

const RESOURCES: Resource[] = [
  {
    id: 'coping',
    icon: '📚',
    title: 'Coping Strategies',
    description: 'Techniques for managing stress',
    content: [
      'Deep breathing: Inhale for 4 counts, hold for 4, exhale for 4',
      'Progressive muscle relaxation: Tense and release each muscle group',
      'Grounding technique: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste',
      'Journaling: Write down your thoughts and feelings',
      'Physical activity: Take a walk or do light exercise',
      'Connect with others: Reach out to a friend or family member',
      'Limit caffeine and alcohol',
      'Maintain a regular sleep schedule'
    ]
  },
  {
    id: 'mindfulness',
    icon: '🧘',
    title: 'Mindfulness Exercises',
    description: 'Guided meditation and breathing',
    content: [
      'Body Scan Meditation: Focus attention on each part of your body from toes to head',
      'Mindful Breathing: Focus solely on your breath for 5-10 minutes',
      'Walking Meditation: Pay attention to each step and your surroundings',
      'Loving-Kindness Meditation: Send positive thoughts to yourself and others',
      'Mindful Eating: Eat slowly and notice taste, texture, and smell',
      'Sound Meditation: Listen to ambient sounds without judgment',
      '4-7-8 Breathing: Inhale for 4, hold for 7, exhale for 8',
      'Visualization: Imagine a peaceful place in detail'
    ]
  },
  {
    id: 'journal',
    icon: '📝',
    title: 'Journal Prompts',
    description: 'Daily reflection questions',
    content: [
      'What am I grateful for today?',
      'What emotions did I experience today and why?',
      'What challenged me today and how did I respond?',
      'What did I learn about myself today?',
      'What positive thing happened today, no matter how small?',
      'What would I like to improve tomorrow?',
      'Who or what made me smile today?',
      'What am I looking forward to?',
      'What boundary do I need to set?',
      'How did I practice self-care today?'
    ]
  },
  {
    id: 'crisis',
    icon: '📞',
    title: 'Crisis Support',
    description: '24/7 emergency contacts',
    content: [
      '988 Suicide & Crisis Lifeline: Call or text 988',
      'Crisis Text Line: Text HOME to 741741',
      'SAMHSA National Helpline: 1-800-662-4357',
      'National Domestic Violence Hotline: 1-800-799-7233',
      'Veterans Crisis Line: Call 988 then press 1',
      'Trevor Project (LGBTQ Youth): 1-866-488-7386',
      'RAINN Sexual Assault Hotline: 1-800-656-4673',
      'Emergency Services: Call 911',
      'Remember: You are not alone. Help is available 24/7.'
    ]
  }
]

export default function ResourcesPanel() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
  }

  const handleCloseModal = () => {
    setSelectedResource(null)
  }

  return (
    <>
      <div className="card">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Resources</h2>
        <div className="space-y-3">
          {RESOURCES.map((resource) => (
            <button
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">{resource.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{resource.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{resource.description}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Resource Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedResource.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedResource.title}</h2>
                  <p className="text-blue-100 text-sm">{selectedResource.description}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
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
              {selectedResource.id === 'crisis' ? (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                      If you're in immediate danger, please call 911 or go to your nearest emergency room.
                    </p>
                  </div>
                  {selectedResource.content.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      <p className="text-slate-900 dark:text-slate-100 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {selectedResource.content.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 flex-1">{item}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleCloseModal}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
