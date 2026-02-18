'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { messages, therapists, patients } from '@/lib/supabase'

interface Message {
  id: string
  sender_id: string
  sender_type: 'therapist' | 'patient'
  receiver_id: string
  receiver_type: 'therapist' | 'patient'
  content: string
  is_read: boolean
  created_at: string
}

interface Conversation {
  id: string
  therapist_id: string
  patient_id: string
  last_message_at: string
  therapist?: any
  patient?: any
}

interface MessagesModalProps {
  isOpen: boolean
  onClose: () => void
  userRole: 'therapist' | 'client'
}

export default function MessagesModal({ isOpen, onClose, userRole }: MessagesModalProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageList, setMessageList] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && user?.email) {
      loadUserData()
    }
  }, [isOpen, user])

  useEffect(() => {
    if (selectedConversation && currentUserId) {
      loadMessages()
      const interval = setInterval(loadMessages, 3000) // Poll for new messages
      return () => clearInterval(interval)
    }
  }, [selectedConversation, currentUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messageList])

  const loadUserData = async () => {
    if (!user?.email) return

    try {
      if (userRole === 'therapist') {
        const { data } = await therapists.getByEmail(user.email) as { data: any }
        if (data?.id) {
          setCurrentUserId(data.id)
          loadConversations(data.id)
        }
      } else {
        const { data } = await patients.getByEmail(user.email) as { data: any }
        if (data?.id) {
          setCurrentUserId(data.id)
          loadConversations(data.id)
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err)
    }
  }

  const loadConversations = async (userId: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await messages.getConversations(userId, userRole === 'therapist' ? 'therapist' : 'patient')
      if (error) {
        console.error('Error loading conversations:', error)
        return
      }
      setConversations(data || [])
    } catch (err) {
      console.error('Error loading conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async () => {
    if (!selectedConversation || !currentUserId) return

    try {
      const otherId = userRole === 'therapist' 
        ? selectedConversation.patient_id 
        : selectedConversation.therapist_id

      const { data, error } = await messages.getMessages(currentUserId, otherId) as { data: any[], error: any }
      if (error) {
        console.error('Error loading messages:', error)
        return
      }
      setMessageList(data || [])

      // Mark unread messages as read
      data?.forEach((msg: any) => {
        if (!msg.is_read && msg.receiver_id === currentUserId) {
          messages.markAsRead(msg.id)
        }
      })
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return

    setIsSending(true)
    try {
      const receiverId = userRole === 'therapist' 
        ? selectedConversation.patient_id 
        : selectedConversation.therapist_id

      await messages.sendMessage({
        sender_id: currentUserId,
        sender_type: userRole === 'therapist' ? 'therapist' : 'patient',
        receiver_id: receiverId,
        receiver_type: userRole === 'therapist' ? 'patient' : 'therapist',
        content: newMessage.trim()
      })

      setNewMessage('')
      await loadMessages()
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getConversationName = (conversation: Conversation) => {
    if (userRole === 'therapist') {
      return conversation.patient?.name || 'Unknown Patient'
    } else {
      return conversation.therapist?.name || 'Unknown Therapist'
    }
  }

  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Messages</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Secure HIPAA-compliant messaging
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
          {/* Conversations List */}
          <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-slate-500">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-2">Start a conversation with your {userRole === 'therapist' ? 'patients' : 'therapist'}</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-sm">
                          {getConversationName(conversation).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {getConversationName(conversation)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(conversation.last_message_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {getConversationName(selectedConversation).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {getConversationName(selectedConversation)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {userRole === 'therapist' ? 'Patient' : 'Therapist'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messageList.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messageList.map((message) => {
                      const isOwn = message.sender_id === currentUserId
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                            <div className={`text-xs text-slate-500 dark:text-slate-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                              {formatTime(message.created_at)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <span>Send</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
