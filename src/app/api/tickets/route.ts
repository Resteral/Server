import { NextResponse } from 'next/server';

let systemTickets = [
  { id: 'TKT-1029', steamId: '76561198012345678', title: 'Did not receive VIP rank', status: 'Open' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');
  const serverKey = request.headers.get('Authorization');

  if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (steamId) {
    const playerTickets = systemTickets.filter(t => t.steamId === steamId);
    return NextResponse.json({ success: true, tickets: playerTickets });
  }

  // Admin GET: return all open tickets
  return NextResponse.json({ success: true, tickets: systemTickets.filter(t => t.status === 'Open') });
}

export async function POST(request: Request) {
  const serverKey = request.headers.get('Authorization');
  if (serverKey !== 'Bearer GAME_SERVER_SECRET_KEY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  
  if (data.action === 'create') {
    const newTicket = {
      id: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
      steamId: data.steamId,
      title: data.title,
      status: 'Open'
    };
    systemTickets.push(newTicket);
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
