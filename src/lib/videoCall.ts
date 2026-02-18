/**
 * Video Call Utilities for Daily.co Integration
 */

/**
 * Generate a unique room name for a therapy session
 * Format: sessionId_timestamp for uniqueness and security
 */
export function generateRoomName(sessionId: string): string {
  const timestamp = Date.now()
  return `${sessionId}_${timestamp}`
}

/**
 * Generate room name from therapist and patient IDs
 * This creates a consistent room name for recurring sessions
 */
export function generateRoomNameFromIds(therapistId: string, patientId: string, sessionDate?: string): string {
  let dateStr: string
  
  if (sessionDate) {
    try {
      const date = new Date(sessionDate)
      if (isNaN(date.getTime())) {
        // Invalid date, use current date
        dateStr = new Date().toISOString().split('T')[0]
      } else {
        dateStr = date.toISOString().split('T')[0]
      }
    } catch {
      dateStr = new Date().toISOString().split('T')[0]
    }
  } else {
    dateStr = new Date().toISOString().split('T')[0]
  }
  
  const hash = `${therapistId}_${patientId}_${dateStr}`.replace(/-/g, '')
  return hash.substring(0, 32) // Limit length for cleaner URLs
}

/**
 * Validate if a room name is valid for Daily.co
 */
export function isValidRoomName(roomName: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(roomName) && roomName.length >= 2 && roomName.length <= 64
}

/**
 * Get Daily.co configuration for therapy sessions
 * Uses Daily.co hosted service at manusiele.daily.co
 */
export function getDailyConfig() {
  return {
    domain: 'manusiele.daily.co', // Your Daily.co subdomain
    scriptUrl: 'https://unpkg.com/@daily-co/daily-js',
    options: {
      // Privacy & Security
      showLeaveButton: true,
      showFullscreenButton: true,
      
      // Quality settings
      videoSource: true,
      audioSource: true,
    }
  }
}

/**
 * Check if browser supports WebRTC
 */
export function isWebRTCSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    window.RTCPeerConnection
  )
}

/**
 * Request camera and microphone permissions
 */
export async function requestMediaPermissions(): Promise<{ audio: boolean; video: boolean }> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    stream.getTracks().forEach(track => track.stop()) // Stop the stream after checking
    return { audio: true, video: true }
  } catch (error) {
    console.error('Media permissions error:', error)
    return { audio: false, video: false }
  }
}
