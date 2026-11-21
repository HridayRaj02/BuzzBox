// Visual profile defaults fill optional fields that are not yet part of the database schema.
export const profileDisplayDefaults = {
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85',
  city: 'Delhi NCR',
  badges: ['Founding Pass Holder', 'Curated Clubber', 'Night Crawler Tier'],
  genreFrequencies: [{ genre: 'Berlin Industrial Techno', frequency: 38 }, { genre: 'Deep Dub & Breaks', frequency: 34 }, { genre: 'Leftfield UK Bass', frequency: 28 }],
  favouriteVenues: ['The Dhan Mill Warehouse', 'Southside Sub-Vault', 'The Factory Floor'],
  nightRoutine: 'Arrives at peak midnight (01:16 avg peak), prefers analog sound systems and underground boiler-room layouts, strictly no flash photography.',
  tasteStatus: 'Aesthetic Purist',
  tasteRank: 2,
  notifications: { whatsappDrops: true, radarAlerts: false, waitlistOffers: true },
  security: { phone: '+91 ••••• 9922', connectedIdentity: 'Account identity', vaultStatus: 'Hardware Encrypted' },
}
