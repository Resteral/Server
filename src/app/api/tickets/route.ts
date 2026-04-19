import { NextResponse } from 'next/server';

let systemTickets = [
  { id: 'TKT-1029', steamId: '76561198012345678', discord: 'user123', title: 'Did not receive VIP rank', status: 'Open' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const serverKey = request.headers.get('Authorization');

  // Commented out secret key for easier testing during dev. Re-enable in production!
  // if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
  //  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  if (steamId) {
    const playerTickets = systemTickets.filter(t => t.steamId === steamId);
    return NextResponse.json({ success: true, tickets: playerTickets });
  }

  // Admin GET: return all open tickets
  return NextResponse.json({ success: true, tickets: systemTickets.filter(t => t.status === 'Open') });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (data.action === 'create' || data.action === 'create_web') {
    const newTicket = {
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      steamId: data.steamId,
      discord: data.discord || 'Not Provided',
      title: data.title,
      status: 'Open'
    };
    systemTickets.push(newTicket);

    // ==========================================
    // DISCORD WEBHOOK INTEGRATION
    // ==========================================
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || null;
    
    if (DISCORD_WEBHOOK_URL) {
      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            username: "Nexus Support Bot",
            avatar_url: "https://i.imgur.com/4M34hiw.png",
            embeds: [{
              title: `🚨 New Ticket: ${newTicket.title}`,
              color: 0x00f0ff,
              fields: [
                { name: "Ticket ID", value: newTicket.id, inline: true },
                { name: "Category", value: data.category || "General", inline: true },
                { name: "SteamID", value: `\`${newTicket.steamId}\``, inline: false },
                { name: "Discord", value: `<@${newTicket.discord.replace(/[<>@]/g, '')}> (${newTicket.discord})`, inline: true },
                { name: "Message", value: data.description || "No description provided." }
              ],
              footer: { text: "Nexus Gaming Store & Support" },
              timestamp: new Date().toISOString()
            }]
          })
        });
      } catch (e) {
        console.error("Failed to send Discord webhook", e);
      }
    }

    return NextResponse.json({ success: true, ticket: newTicket });
  }

  if (data.action === 'updateStatus') {
    const tkt = systemTickets.find(t => t.id === data.ticketId);
    if (tkt) {
      tkt.status = data.status;
      return NextResponse.json({ success: true, ticket: tkt });
    }
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
