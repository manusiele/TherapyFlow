'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  displayName: string
  userRole: 'therapist' | 'patient'
}

declare global {
  interface Window {
    DailyIframe: any
  }
}

export default function VideoCallModal({ 
  isOpen, 
  onClose, 
  roomName, 
  displayName,
  userRole 
}: VideoCallModalProps) {
  const dailyContainerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Load Daily.co script
    const loadDailyScript = () => {
      if (window.DailyIframe) {
        initializeDaily()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@daily-co/daily-js'
      script.crossOrigin = 'anonymous'
      script.async = true
      script.onload = () => initializeDaily()
      script.onerror = () => {
        setError('Failed to load video call service. Please check your internet connection.')
        setIsLoading(false)
      }
      document.body.appendChild(script)
    }

    const initializeDaily = () => {
      if (!dailyContainerRef.current || callFrameRef.current) return

      try {
        // Create Daily call frame
        const callFrame = window.DailyIframe.createFrame(dailyContainerRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '8px',
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        })

        callFrameRef.current = callFrame

        // Event listeners
        callFrame.on('joined-meeting', () => {
          setIsLoading(false)
          console.log('Joined Daily meeting')
        })

        callFrame.on('left-meeting', () => {
          handleClose()
        })

        callFrame.on('error', (error: any) => {
          console.error('Daily error:', error)
          setError('An error occurred during the video call.')
        })

        // Join the room with user info
        callFrame.join({
          url: `https://manusiele.daily.co/${roomName}`,
          userName: displayName,
        }).catch((err: any) => {
          console.error('Error joining Daily room:', err)
          setError('Failed to join video call. Please try again.')
          setIsLoading(false)
        })

      } catch (err) {
        console.error('Error initializing Daily:', err)
        setError('Failed to initialize video call.')
        setIsLoading(false)
      }
    }

    loadDailyScript()

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy()
        callFrameRef.current = null
      }
    }
  }, [isOpen, roomName, displayName])

  const handleClose = () => {
    if (callFrameRef.current) {
      callFrameRef.current.destroy()
      callFrameRef.current = null
    }
    setIsLoading(true)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-white font-semibold">Therapy Session</h2>
            <p className="text-slate-400 text-sm">Secure & Private Video Call</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-white hover:text-red-400 transition-colors px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>End Call</span>
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Connecting to video call...</p>
              <p className="text-slate-400 text-sm mt-2">Please wait while we set up your session</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-lg mb-2">Connection Error</p>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div ref={dailyContainerRef} className="w-full h-full" />
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 px-6 py-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-slate-400">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Private</span>
            </div>
          </div>
          <div className="text-slate-500">
            Room: {roomName}
          </div>
        </div>
      </div>
    </div>
  )
}
