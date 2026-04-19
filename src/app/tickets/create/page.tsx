"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function CreateTicket() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ marginBottom: '1rem' }}>Ticket Submitted Successfully</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          We have received your request. In-game admins and web support staff have been notified.
          You can check the status on the tickets page or via the in-game /ticket command.
        </p>
        <Link href="/tickets" className="btn-primary">
          Back to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/tickets" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
          &larr; Back Support Center
        </Link>
      </div>
      
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Open a Ticket</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Need help? Submit a ticket below and our moderation team will review it. This system syncs with the game server so admins can assist you directly in-game.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
            <select className="input-field" required>
              <option value="">Select Category...</option>
              <option value="purchase">Purchase Issue / Missing Rank</option>
              <option value="report">Report a Player</option>
              <option value="appeal">Ban Appeal</option>
              <option value="general">General Support</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>SteamID / In-Game Name</label>
            <input type="text" className="input-field" placeholder="e.g. 765611980... or PlayerName" required />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
            <input type="text" className="input-field" placeholder="Brief summary of issue" required />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
            <textarea className="input-field" placeholder="Provide as many details as possible..." required></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
