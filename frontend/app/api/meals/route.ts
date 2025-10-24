import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const NODE_HOST = process.env.NODE_BACKEND_URL || 'http://localhost:5001'
    const resp = await fetch(`${NODE_HOST}/api/meals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: request.headers.get('authorization') || '' },
      body: JSON.stringify(body)
    })
    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (err) {
    return NextResponse.json({ error: 'proxy error', details: String(err) }, { status: 500 })
  }
}
