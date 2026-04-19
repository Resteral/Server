"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all open tickets from our own Next.js API
    fetch('/api/tickets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tickets) {
          setTickets(data.tickets);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient">Support Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your web and in-game tickets</p>
        </div>
        <Link href="/tickets/create" className="btn-primary">
          Open New Ticket
        </Link>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '16px' }}>Ticket ID</th>
              <th style={{ padding: '16px' }}>SteamID</th>
              <th style={{ padding: '16px' }}>Title</th>
              <th style={{ padding: '16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading incoming tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active tickets found.
                </td>
              </tr>
            ) : (
              tickets.map(tkt => (
                <tr key={tkt.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{tkt.id}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{tkt.steamId}</td>
                  <td style={{ padding: '16px' }}>{tkt.title}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: tkt.status === 'Open' ? 'var(--success)' : 'var(--danger)',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tkt.status === 'Open' ? 'var(--success)' : 'var(--danger)' }}></div>
                      {tkt.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
