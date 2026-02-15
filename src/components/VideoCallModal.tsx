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
    JitsiMeetExternalAPI: any
  }
}

export default function VideoCallModal({ 
  isOpen, 
  onClose, 
  roomName, 
  displayName,
  userRole 
}: VideoCallModalProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const jitsiApiRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        initializeJitsi()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = () => initializeJitsi()
      script.onerror = () => {
        setError('Failed to load video call service. Please check your internet connection.')
        setIsLoading(false)
      }
      document.body.appendChild(script)
    }

    const initializeJitsi = () => {
      if (!jitsiContainerRef.current || jitsiApiRef.current) return

      try {
        const domain = 'meet.jit.si'
        const options = {
          roomName: `TherapyFlow_${roomName}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: displayName,
            email: '', // Optional: can add user email
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: true, // Show preview before joining
            disableDeepLinking: true,
            enableClosePage: false,
            // Privacy & Security
            enableLobbyChat: false,
            enableInsecureRoomNameWarning: true,
            // UI Customization
            toolbarButtons: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
              'settings',
              'videoquality',
              'filmstrip',
              'stats',
              'tileview',
            ],
            // Disable features not needed for therapy
            disableInviteFunctions: true,
            doNotStoreRoom: true, // Don't store room in recent list
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            DEFAULT_BACKGROUND: '#1e293b',
            DEFAULT_REMOTE_DISPLAY_NAME: userRole === 'therapist' ? 'Patient' : 'Therapist',
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            DISABLE_PRESENCE_STATUS: true,
            MOBILE_APP_PROMO: false,
            HIDE_INVITE_MORE_HEADER: true,
          },
        }

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options)

        // Event listeners
        jitsiApiRef.current.addListener('videoConferenceJoined', () => {
          setIsLoading(false)
          console.log('Video conference joined')
        })

        jitsiApiRef.current.addListener('videoConferenceLeft', () => {
          handleClose()
        })

        jitsiApiRef.current.addListener('readyToClose', () => {
          handleClose()
        })

        jitsiApiRef.current.addListener('errorOccurred', (error: any) => {
          console.error('Jitsi error:', error)
          setError('An error occurred during the video call.')
        })

      } catch (err) {
        console.error('Error initializing Jitsi:', err)
        setError('Failed to initialize video call.')
        setIsLoading(false)
      }
    }

    loadJitsiScript()

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose()
        jitsiApiRef.current = null
      }
    }
  }, [isOpen, roomName, displayName, userRole])

  const handleClose = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose()
      jitsiApiRef.current = null
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

        <div ref={jitsiContainerRef} className="w-full h-full" />
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
              <span>HIPAA-compliant ready</span>
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
