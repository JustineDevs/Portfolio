import { NextResponse } from 'next/server'

function getApiKey() {
  const encoded = process.env.JSONBIN_API_KEY_ENCODED
  if (encoded) {
    return Buffer.from(encoded, 'base64').toString('utf-8')
  }
  return process.env.JSONBIN_API_KEY || ''
}

const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b'

interface HeartData {
  visitorIds: string[]
  likes: number // Calculated from visitorIds.length for backward compatibility
}

async function getHeartData(): Promise<HeartData> {
  const url = `${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}/latest`
  const response = await fetch(url, {
    headers: {
      'X-Master-Key': getApiKey(),
    },
    cache: 'no-store',
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('JSONBin API error:', response.status, errorText)
    // Return default structure if fetch fails
    return { visitorIds: [], likes: 0 }
  }
  
  const data = await response.json()
  const record = data.record || {}
  
  // Handle migration: if old format (just { likes: number }), convert to new format
  if (record.likes !== undefined && !Array.isArray(record.visitorIds)) {
    return { visitorIds: [], likes: record.likes || 0 }
  }
  
  // Ensure visitorIds is an array
  const visitorIds = Array.isArray(record.visitorIds) ? record.visitorIds : []
  return {
    visitorIds,
    likes: visitorIds.length, // Calculate from array length
  }
}

async function updateHeartData(data: HeartData): Promise<HeartData> {
  const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': getApiKey(),
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update heart data')
  }
  
  const result = await response.json()
  const updatedRecord = result.record || data
  return {
    visitorIds: Array.isArray(updatedRecord.visitorIds) ? updatedRecord.visitorIds : [],
    likes: updatedRecord.visitorIds?.length || 0,
  }
}

export async function GET(request: Request) {
  const apiKey = getApiKey()
  const binId = process.env.JSONBIN_BIN_ID
  
  if (!apiKey || !binId) {
    return NextResponse.json({ likes: 0, hasLiked: false, error: 'JSONBin not configured' }, { status: 200 })
  }

  try {
    const data = await getHeartData()
    
    // Check if visitor has liked (from query param)
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')
    const hasLiked = visitorId ? data.visitorIds.includes(visitorId) : false
    
    return NextResponse.json({ 
      likes: data.likes, 
      hasLiked,
    })
  } catch (error) {
    console.error('Error fetching hearts:', error)
    return NextResponse.json({ likes: 0, hasLiked: false, error: 'Failed to fetch' }, { status: 200 })
  }
}

export async function POST(request: Request) {
  const apiKey = getApiKey()
  
  if (!apiKey || !JSONBIN_BIN_ID) {
    return NextResponse.json({ likes: 0, hasLiked: false, error: 'JSONBin not configured' }, { status: 200 })
  }

  try {
    const body = await request.json()
    const { action, visitorId } = body
    
    if (!visitorId) {
      return NextResponse.json({ likes: 0, hasLiked: false, error: 'Visitor ID required' }, { status: 400 })
    }
    
    const currentData = await getHeartData()
    let updatedVisitorIds = [...currentData.visitorIds]
    let hasLiked = updatedVisitorIds.includes(visitorId)
    
    if (action === 'like') {
      // Only add if not already liked
      if (!hasLiked) {
        updatedVisitorIds.push(visitorId)
        hasLiked = true
      }
    } else if (action === 'unlike') {
      // Remove visitor ID if they liked
      updatedVisitorIds = updatedVisitorIds.filter(id => id !== visitorId)
      hasLiked = false
    }
    
    const updatedData = await updateHeartData({
      visitorIds: updatedVisitorIds,
      likes: updatedVisitorIds.length,
    })
    
    return NextResponse.json({ 
      likes: updatedData.likes,
      hasLiked,
    })
  } catch (error) {
    console.error('Error updating hearts:', error)
    return NextResponse.json({ likes: 0, hasLiked: false, error: 'Failed to update' }, { status: 200 })
  }
}
