import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomName = searchParams.get('roomName')

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.DAILY_API_KEY

    if (!apiKey) {
      console.error('DAILY_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Video call service not configured' },
        { status: 500 }
      )
    }

    // Delete room from Daily.co
    const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('Daily.co API error:', data)
      return NextResponse.json(
        { error: data.error || 'Failed to delete room' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting Daily.co room:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
