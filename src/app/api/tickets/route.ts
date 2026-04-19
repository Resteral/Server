import { NextResponse } from 'next/server';

// Local serverless array for holding generated tickets temporarily
let systemTickets: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  
  if (steamId) {
    const playerTickets = systemTickets.filter(t => t.steamId === steamId);
    return NextResponse.json({ success: true, tickets: playerTickets });
  }

  return NextResponse.json({ success: true, tickets: systemTickets.filter(t => t.status === 'Open') });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (data.action === 'create' || data.action === 'create_web') {
    const ticketIdNumber = Math.floor(Math.random() * 9000) + 1000;
    const newTicket = {
      id: `TKT-${ticketIdNumber}`,
      steamId: data.steamId,
      discord: data.discord || 'Not Provided',
      title: data.title,
      status: 'Open'
    };
    systemTickets.push(newTicket);

    // ==========================================
    // DISCORD BOT & WEBHOOK INTEGRATION
    // ==========================================
    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || null;
    const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || null;
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || null;

    // 1. Try to create an actual Ticket Channel if a Bot Token is provided
    if (DISCORD_BOT_TOKEN && DISCORD_GUILD_ID) {
      try {
        const createChannelRes = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/channels`, {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `ticket-${ticketIdNumber}`,
            type: 0, // Text Channel
            topic: `SteamID: ${newTicket.steamId} | Discord: ${newTicket.discord}`,
            // In a real setup, provide a 'parent_id' here to put it in a "Tickets" category
            // parent_id: process.env.TICKET_CATEGORY_ID
          })
        });

        if (createChannelRes.ok) {
          const channelData = await createChannelRes.json();
          
          // Send the initial ticket message inside the new channel!
          await fetch(`https://discord.com/api/v10/channels/${channelData.id}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: `@here A new ticket was opened from the web portal!`,
              embeds: [{
                title: `🚨 ${newTicket.title}`,
                color: 0x00f0ff,
                fields: [
                  { name: "Ticket ID", value: newTicket.id, inline: true },
                  { name: "Category", value: data.category || "General", inline: true },
                  { name: "SteamID", value: `\`${newTicket.steamId}\``, inline: false },
                  { name: "Discord", value: newTicket.discord, inline: true },
                  { name: "Message", value: data.description || "No description provided." }
                ],
                footer: { text: "Nexus Gaming Ticket Bot" }
              }]
            })
          });
        } else {
           console.error("Failed creating discord channel:", await createChannelRes.text());
        }
      } catch (e) {
        console.error("Failed to execute Discord Bot actions", e);
      }
    } 
    // 2. Fallback to just sending a Webhook message if no bot token is provided
    else if (DISCORD_WEBHOOK_URL) {
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
                { name: "SteamID", value: `\`${newTicket.steamId}\``, inline: true },
                { name: "Discord", value: `<@${newTicket.discord.replace(/[<>@]/g, '')}> (${newTicket.discord})`, inline: true },
                { name: "Message", value: data.description || "No description provided." }
              ],
              footer: { text: "Nexus Gaming Ticket System" },
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
