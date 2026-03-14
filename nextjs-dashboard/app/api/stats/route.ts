import { NextResponse } from 'next/server';

// In-memory state to simulate live data
let requestsMade = 1247;
let tokensUsed = 58432;
let activeConnections = 23;

export async function GET() {
  // Increment requests counter
  requestsMade += Math.floor(Math.random() * 5) + 1;

  // Increment tokens used
  tokensUsed += Math.floor(Math.random() * 150) + 50;

  // Fluctuate active connections (can go up or down)
  const connectionChange = Math.floor(Math.random() * 7) - 3;
  activeConnections = Math.max(5, Math.min(50, activeConnections + connectionChange));

  return NextResponse.json({
    requestsMade,
    tokensUsed,
    activeConnections,
    timestamp: new Date().toISOString(),
  });
}
