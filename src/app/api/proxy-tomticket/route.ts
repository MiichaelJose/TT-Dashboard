import { NextRequest, NextResponse } from 'next/server';

// Secure way to interact with TomTicket API avoiding exposed tokens to the client
const TOM_TICKET_API_URL = 'https://api.tomticket.com/v2.0';
const TOM_TICKET_API_KEY = process.env.TOMTICKET_API_KEY || ''; // Load from .env

export async function GET(request: NextRequest) {
  // Use URL Search params to know what to proxy 
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // Ex: /overview
  
  // Basic rate limit and endpoint security check here if necessary
  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint param" }, { status: 400 });
  }

  try {
    // We append the auth token to the backend request
    // Example only - TomTicket implementation can differ based on v2 docs
    const res = await fetch(`${TOM_TICKET_API_URL}${endpoint}?token=${TOM_TICKET_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Using Next.js fetch cache options if needed, though RTK Query already caches
      cache: 'no-store', 
    });

    const data = await res.json();
    
    if (!res.ok) {
        // Specifically look for 429 Too Many Requests
        if (res.status === 429) {
            console.warn('[TomTicket Proxy] Rate limit reached!');
        }
        return NextResponse.json({ error: data.message || "Upstream Error" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[TomTicket Proxy] Request failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

