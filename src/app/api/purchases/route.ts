import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Local serverless array to hold transactions temporarily
// (Note: To persist through Vercel restarts, you would write this to a simple DB later)
let mockPurchases: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');

  // If there's no SteamID, it might be a Tebex heartbeat/validation GET test
  if (!steamId) {
    return NextResponse.json({ success: true, message: 'Purchases Endpoint Active' }, { status: 200 });
  }

  // Find all pending purchases for the player
  const pendingPurchases = mockPurchases.filter(p => p.steamId === steamId && p.status === 'pending');
  const ownedItems = mockPurchases.filter(p => p.steamId === steamId && p.status === 'redeemed');

  return NextResponse.json({
    success: true,
    player: steamId,
    pendingPurchases,
    ownedItems 
  });
}

export async function POST(request: Request) {
  let rawBody;
  let data;
  
  try {
    rawBody = await request.text();
    if (!rawBody) return new Response('OK', { status: 200 });
    data = JSON.parse(rawBody);
  } catch (err) {
    // If it's not valid JSON, just accept it to stay alive
    return new Response('OK', { status: 200 });
  }

  // ==========================================
  // TEBEX SECURITY SIGNATURE VERIFICATION
  // ==========================================
  const TEBEX_SECRET = process.env.TEBEX_WEBHOOK_SECRET || null;
  
  if (TEBEX_SECRET) {
      const signatureHeader = request.headers.get('x-signature');
      
      if (!signatureHeader) {
          console.error("Blocked request missing X-Signature header.");
          return NextResponse.json({ error: 'Unauthorized. Missing Signature.' }, { status: 401 });
      }
      
      // Hash the raw body exactly as it came in using your Tebex Secret
      const hash = crypto.createHmac('sha256', TEBEX_SECRET).update(rawBody).digest('hex');
      
      if (hash !== signatureHeader) {
          console.error("SECURITY ALERT: Tebex Signature Mismatch! Possible spoofing attempt blocked.");
          return NextResponse.json({ error: 'Forbidden. Invalid Signature.' }, { status: 403 });
      }
  }

  // TEBEX V2 VALIDATION: Tebex endpoints require you to instantly return their "id" back to them 
  // with a 200 OK when they send a validation.webhook event, or they will mark it as failed!
  if (data.type === 'validation.webhook' || data.id) {
    if (!data.transactionId && !data.subject) {
       return NextResponse.json({ id: data.id }, { status: 200 });
    }
  }

  const { transactionId } = data;

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
            color: 0x00ffaa, 
            fields: [
              { name: "SteamID", value: `\`${purchase.steamId}\``, inline: true },
              { name: "Discord", value: purchase.discord ? `<@${purchase.discord.replace(/[<>@]/g, '')}>` : "Unknown", inline: true },
              { name: "Transaction ID", value: transactionId, inline: false },
              { name: "Current Player Inventory", value: fullInventory || "None", inline: false }
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
    message: `Transaction ${transactionId} confirmed as redeemed in-game.`
  });
}
