import { NextResponse } from 'next/server';

// Local serverless array to hold transactions temporarily
// (Note: To persist through Vercel restarts, you would write this to a simple DB later)
let mockPurchases: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const serverKey = request.headers.get('Authorization');

  // Verify server identity via secret key (Commented out for easy dev testing)
  // if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
  //  return NextResponse.json({ error: 'Unauthorized game server request' }, { status: 401 });
  // }

  if (!steamId) {
    return NextResponse.json({ error: 'steamId is required' }, { status: 400 });
  }

  // Find all pending purchases for the player
  const pendingPurchases = mockPurchases.filter(p => p.steamId === steamId && p.status === 'pending');
  const ownedItems = mockPurchases.filter(p => p.steamId === steamId && p.status === 'redeemed');

  return NextResponse.json({
    success: true,
    player: steamId,
    pendingPurchases,
    ownedItems // Include owned items so the game server can check what they already have
  });
}

export async function POST(request: Request) {
  // const serverKey = request.headers.get('Authorization');
  // if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
  //  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const data = await request.json();
  const { transactionId } = data;

  // Tebex sends validation pings when you first configure the endpoint which don't contain a transactionId.
  // We MUST return 200 OK to tell Tebex the URL is alive.
  if (!transactionId) {
    return NextResponse.json({ success: true, message: 'Endpoint Validated' }, { status: 200 });
  }

  // Find the purchase and mark it as redeemed
  const purchase = mockPurchases.find(p => p.id === transactionId);
  if (purchase) {
    purchase.status = 'redeemed';
  }

  // ==========================================
  // DISCORD WEBHOOK: ADMIN PURCHASE TRACKER
  // ==========================================
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || null;
  
  if (purchase && DISCORD_WEBHOOK_URL) {
    try {
      // Find all items this player now owns to show the admins a full inventory
      const fullInventory = mockPurchases
        .filter(p => p.steamId === purchase.steamId && p.status === 'redeemed')
        .map(p => `- ${p.package}`)
        .join('\n');

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          username: "Nexus Sales Logs",
          avatar_url: "https://i.imgur.com/8QG3XQ2.png",
          embeds: [{
            title: `💰 Purchase Redeemed In-Game: ${purchase.package}`,
            color: 0x00ffaa, // Green success color
            fields: [
              { name: "SteamID", value: `\`${purchase.steamId}\``, inline: true },
              { name: "Discord", value: purchase.discord ? `<@${purchase.discord.replace(/[<>@]/g, '')}>` : "Unknown", inline: true },
              { name: "Transaction ID", value: transactionId, inline: false },
              { name: "Current Player Inventory (Owned Items)", value: fullInventory || "None", inline: false }
            ],
            footer: { text: "Nexus Gaming System Integration" },
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (e) {
      console.error("Failed to send Discord webhook", e);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Transaction ${transactionId} confirmed as redeemed in-game. Discord admins notified.`
  });
}
