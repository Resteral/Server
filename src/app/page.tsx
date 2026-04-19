"use client";

import { useState } from 'react';

const CATEGORIES = [
  {
    title: 'Ranks & Perks',
    items: [
      { id: 'pkg_vip', checkoutUrl: '', name: 'VIP Rank', price: '10.00', image: '👑', desc: 'Get access to priority queue, custom chat colors, and x2 experience.' },
      { id: 'pkg_mvp', checkoutUrl: '', name: 'MVP Rank', price: '25.00', image: '⭐', desc: 'Highest tier. Bypass all queues, exclusive kits, and personalized Discord roles.' },
    ]
  },
  {
    title: 'Weapons & Armory',
    items: [
      { id: 'pkg_assault_rifle', checkoutUrl: '', name: 'Assault Rifle Blueprint', price: '12.00', image: '🔫', desc: 'Permanent blueprint to craft custom military-grade assault rifles at any workbench.' },
      { id: 'pkg_heavy_sniper', checkoutUrl: '', name: 'Heavy Sniper Kit', price: '25.00', image: '🎯', desc: 'A lethal high-caliber sniper rifle dropped instantly into your inventory with a thermal scope and 50 rounds.' },
    ]
  },
  {
    title: 'Real Estate & Mansions',
    items: [
      { id: 'pkg_mansion1', checkoutUrl: '', name: 'Vinewood Mansion', price: '50.00', image: '🏡', desc: 'A massive 3-story mansion in the hills. Includes a 10-car garage, pool, and helipad.' },
      { id: 'pkg_penthouse', checkoutUrl: '', name: 'Luxury Penthouse', price: '35.00', image: '🏙️', desc: 'Top floor city penthouse with panoramic views, secret vault, and private elevator access.' },
    ]
  },
  {
    title: 'Businesses & Enterprises',
    items: [
      { id: 'pkg_nightclub', checkoutUrl: '', name: 'Own a Nightclub', price: '40.00', image: '🍸', desc: 'Become the owner of a premier nightclub. Earn weekly passive income and host events.' },
      { id: 'pkg_mechanic', checkoutUrl: '', name: 'Auto Shop Business', price: '30.00', image: '🔧', desc: 'Own a fully equipped mechanic shop. Access exclusive mods and repair tools.' },
    ]
  },
  {
    title: 'Gangs & Organizations',
    items: [
      { id: 'pkg_gang', checkoutUrl: '', name: 'Official Gang Tier', price: '60.00', image: '🏴‍☠️', desc: 'Get your gang whitelisted. Includes a custom hideout map, shared stash, and gang bank.' },
      { id: 'pkg_mafia', checkoutUrl: '', name: 'Mafia Family Status', price: '100.00', image: '🕴️', desc: 'The ultimate empire. Giant private compound, armored convoy vehicles, and custom NPC guards.' },
    ]
  },
  {
    title: 'Vehicles / Cars',
    items: [
      { id: 'pkg_supercar', checkoutUrl: '', name: 'Neon Supercar', price: '15.00', image: '🏎️', desc: 'Unlock the fastest supercar on the server with customized neon underglow.' },
      { id: 'pkg_truck', checkoutUrl: '', name: 'Armored Transport', price: '20.00', image: '🛡️', desc: 'Perfect for crew transport and surviving heavy raids. Heavy durability and 6 seats.' },
    ]
  },
  {
    title: 'Companions / Pets',
    items: [
      { id: 'pkg_dragon', checkoutUrl: '', name: 'Shoulder Dragon', price: '8.50', image: '🐉', desc: 'A rare mini dragon that sits on your shoulder and occasionally shoots tiny fire.' },
      { id: 'pkg_husky', checkoutUrl: '', name: 'Loyal Husky', price: '5.00', image: '🐺', desc: 'A faithful canine companion that follows you around the open world.' },
    ]
  },
  {
    title: 'Currency / Items',
    items: [
      { id: 'pkg_gems1', checkoutUrl: '', name: '500x Gems', price: '4.99', image: '💎', desc: 'Premium currency used to buy exclusive skins and cosmetic emotes in-game.' },
      { id: 'pkg_gems2', checkoutUrl: '', name: '2000x Gems (Best Value!)', price: '14.99', image: '💰', desc: 'Stock up on premium gems with a 25% bonus included.' },
      { id: 'pkg_supply', checkoutUrl: '', name: 'Supply Drop', price: '5.00', image: '📦', desc: 'Instantly spawn a massive supply drop at your in-game location packed with gear.' }
    ]
  }
];

export default function StoreFront() {
  const [selectedPack, setSelectedPack] = useState<any | null>(null);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', padding: '2rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }} className="text-gradient">
          Enhance Your Experience
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Support the server and get amazing perks in return. All purchases are automatically synced and credited in-game usually within 60 seconds.
        </p>
      </header>

      {CATEGORIES.map((category, catIdx) => (
        <div key={category.title} style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            {category.title}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {category.items.map((pkg, idx) => (
              <div 
                key={pkg.id} 
                className={`glass-panel delay-${(idx % 3) + 1}`}
                style={{ 
                  padding: '2rem', 
                  textAlign: 'center',
                  border: selectedPack?.id === pkg.id ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPack(pkg)}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>{pkg.image}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{pkg.name}</h3>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '1rem' }}>
                  ${pkg.price} USD
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', minHeight: '80px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {pkg.desc}
                </p>
                <button 
                  className={selectedPack?.id === pkg.id ? "btn-primary" : "btn-secondary"}
                  style={{ width: '100%' }}
                >
                  {selectedPack?.id === pkg.id ? 'Selected' : 'Select Package'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedPack && (
        <div className="glass-panel animate-fade-in" style={{ 
          marginTop: '2rem', 
          padding: '2rem',
          position: 'sticky',
          bottom: '20px',
          zIndex: 50,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          borderTop: '2px solid var(--accent-primary)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Complete Purchase: <span className="text-gradient">{selectedPack.name}</span>
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                You are about to purchase the <strong>{selectedPack.name}</strong> for ${selectedPack.price}. Enter your credentials to sync this purchase and get Discord roles.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '350px' }}>
               <input type="text" placeholder="SteamID / Username..." className="input-field" style={{ marginBottom: 0, flex: 1 }} />
               <input type="text" placeholder="Discord Username (optional)" className="input-field" style={{ marginBottom: 0, flex: 1 }} />
               <button className="btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={() => {
                  if (selectedPack.checkoutUrl && selectedPack.checkoutUrl.length > 5) {
                    window.location.href = selectedPack.checkoutUrl;
                  } else {
                    alert(`SETUP REQUIRED: Open your code and paste the real Tebex link for ${selectedPack.name} into the 'checkoutUrl' slot!`);
                  }
               }}>
                 Pay ${selectedPack.price}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
