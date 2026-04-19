import { NextResponse } from 'next/server';

// Mock DB for demonstration
const mockPurchases = [
  { id: 'tx-001', steamId: '76561198012345678', packageId: 1, package: 'VIP Rank', status: 'pending' },
  { id: 'tx-002', steamId: '76561198012345678', packageId: 3, package: 'Supply Drop', status: 'pending' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const serverKey = request.headers.get('Authorization');

  // Verify server identity via secret key
  if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
    return NextResponse.json({ error: 'Unauthorized game server request' }, { status: 401 });
  }

  if (!steamId) {
    return NextResponse.json({ error: 'steamId is required' }, { status: 400 });
  }

  // Find all pending purchases for the player
  const pendingPurchases = mockPurchases.filter(p => p.steamId === steamId && p.status === 'pending');

  return NextResponse.json({
    success: true,
    player: steamId,
    pendingPurchases
  });
}

export async function POST(request: Request) {
  const serverKey = request.headers.get('Authorization');
  if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { transactionId } = data;

  if (!transactionId) {
    return NextResponse.json({ error: 'transactionId required' }, { status: 400 });
  }

  // Logic to mark the purchase as redeemed in database
  // Example: db.purchases.update({ id: transactionId }, { status: 'redeemed' })

  return NextResponse.json({
    success: true,
    message: `Transaction ${transactionId} confirmed as redeemed in-game.`
  });
}
