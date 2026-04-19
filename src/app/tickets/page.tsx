"use client";

import Link from 'next/link';

// Mock data for tickets
const TICKETS = [
  { id: 'TKT-1029', title: 'Did not receive VIP rank', status: 'Open', date: '2026-04-19 14:30', category: 'Purchase Issue' },
  { id: 'TKT-1025', title: 'Ban Appeal', status: 'Closed', date: '2026-04-18 09:15', category: 'Appeal' },
];

export default function TicketsPage() {
  return (
    <div className="animate-fade-in">
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
              <th style={{ padding: '16px' }}>Title</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.map(tkt => (
              <tr key={tkt.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px', fontWeight: 'bold' }}>{tkt.id}</td>
                <td style={{ padding: '16px' }}>{tkt.title}</td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)', fontSize: '0.9rem' }}>{tkt.category}</span></td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    color: tkt.status === 'Open' ? 'var(--success)' : 'var(--danger)',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tkt.status === 'Open' ? 'var(--success)' : 'var(--danger)' }}></div>
                    {tkt.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{tkt.date}</td>
              </tr>
            ))}
            {TICKETS.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  You have no active or past tickets.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
