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

async function getHeartData() {
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
    throw new Error(`Failed to fetch heart data: ${response.status}`)
  }
  
  const data = await response.json()
  return data.record
}

async function updateHeartData(likes: number) {
  const response = await fetch(`${JSONBIN_BASE_URL}/${JSONBIN_BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': getApiKey(),
    },
    body: JSON.stringify({ likes }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update heart data')
  }
  
  const data = await response.json()
  return data.record
}

export async function GET() {
  const apiKey = getApiKey()
  const binId = process.env.JSONBIN_BIN_ID
  
  if (!apiKey || !binId) {
    return NextResponse.json({ likes: 0, error: 'JSONBin not configured' }, { status: 200 })
  }

  try {
    const data = await getHeartData()
    return NextResponse.json({ likes: data.likes || 0 })
  } catch (error) {
    console.error('Error fetching hearts:', error)
    return NextResponse.json({ likes: 0, error: 'Failed to fetch' }, { status: 200 })
  }
}

export async function POST(request: Request) {
  const apiKey = getApiKey()
  
  if (!apiKey || !JSONBIN_BIN_ID) {
    return NextResponse.json({ likes: 0, error: 'JSONBin not configured' }, { status: 200 })
  }

  try {
    const body = await request.json()
    const { action } = body
    
    const currentData = await getHeartData()
    const currentLikes = currentData.likes || 0
    
    let newLikes = currentLikes
    if (action === 'like') {
      newLikes = currentLikes + 1
    } else if (action === 'unlike') {
      newLikes = Math.max(0, currentLikes - 1)
    }
    
    const updatedData = await updateHeartData(newLikes)
    return NextResponse.json({ likes: updatedData.likes })
  } catch (error) {
    console.error('Error updating hearts:', error)
    return NextResponse.json({ likes: 0, error: 'Failed to update' }, { status: 200 })
  }
}
