import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const NODE_HOST = process.env.NODE_BACKEND_URL || 'http://localhost:5001'
    const resp = await fetch(`${NODE_HOST}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (err) {
    return NextResponse.json({ error: 'proxy error', details: String(err) }, { status: 500 })
  }
}
