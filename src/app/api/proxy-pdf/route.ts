import { NextRequest, NextResponse } from 'next/server'

// Simple proxy to fetch a PDF from a remote backend and stream it to the client
// This helps bypass CORS and Content-Disposition: attachment issues.
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url')
    if (!url) return new NextResponse('Missing url parameter', { status: 400 })

    const backendRes = await fetch(url, {
      // Forward cookies/headers if your backend needs auth; customize as needed
      // credentials: 'include',
      headers: {
        // You can forward specific headers from the request if needed
      }
    })

    if (!backendRes.ok) {
      return new NextResponse(`Upstream error: ${backendRes.statusText}`, { status: backendRes.status })
    }

    // Stream the content to the client, normalize headers for inline viewing
    const contentType = backendRes.headers.get('content-type') || 'application/pdf'
    const body = backendRes.body
    if (!body) return new NextResponse('No content', { status: 502 })

    const res = new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Force inline display so PDF.js can render
        'Content-Disposition': 'inline'
      }
    })

    return res
  } catch (err) {
    console.error('Proxy PDF error:', err)
    return new NextResponse('Proxy PDF error', { status: 500 })
  }
}
