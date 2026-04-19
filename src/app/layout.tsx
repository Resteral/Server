import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nexus Gaming | Store',
  description: 'Official Webstore and Ticket Portal for Nexus Gaming',
  manifest: '/manifest.json',
  themeColor: '#00f0ff'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="navbar-brand text-gradient">
            NEXUS GAMING
          </Link>
          <div className="navbar-links">
            <Link href="/" className="nav-link">Store</Link>
            <Link href="/tickets" className="nav-link">Support Tickets</Link>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Login with Steam
            </button>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
        <footer style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', background: 'rgba(10, 10, 15, 0.8)' }}>
          <p>&copy; {new Date().getFullYear()} Nexus Gaming. Not affiliated with Facepunch or respective game developers.</p>
        </footer>
      </body>
    </html>
  );
}
