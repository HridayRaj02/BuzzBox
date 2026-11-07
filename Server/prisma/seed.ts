import { PrismaClient, EventCategory, EventStatus, TicketTierType, UserRole } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const cities = await Promise.all([
    prisma.city.upsert({ where: { slug: "delhi-ncr" }, update: { isActive: true }, create: { name: "Delhi NCR", slug: "delhi-ncr", state: "Delhi", isActive: true } }),
    prisma.city.upsert({ where: { slug: "mumbai" }, update: { isActive: false }, create: { name: "Mumbai", slug: "mumbai", state: "Maharashtra", isActive: false } }),
    prisma.city.upsert({ where: { slug: "bengaluru" }, update: { isActive: false }, create: { name: "Bengaluru", slug: "bengaluru", state: "Karnataka", isActive: false } }),
  ]);
  const city = cities[0]!;
  const venueSpecs = [
    ["The Dhan Mill Compound", "dhan-mill-compound", "100 Feet Road, Chhatarpur", "Chhatarpur"],
    ["The Piano Man", "the-piano-man", "Basant Lok, Vasant Vihar", "Vasant Vihar"],
    ["Hauz Khas Cellar", "hauz-khas-cellar", "Hauz Khas Village", "Hauz Khas"],
    ["Dear Donna", "dear-donna", "Mehrauli, New Delhi", "Mehrauli"],
    ["Summer House Cafe", "summer-house-cafe", "Aurobindo Place Market", "Hauz Khas"],
  ] as const;
  const venues = await Promise.all(venueSpecs.map(([name, slug, address, area]) => prisma.venue.upsert({ where: { slug }, update: { cityId: city.id }, create: { name, slug, address, area, cityId: city.id, capacity: 500 } })));
  const host = await prisma.user.upsert({ where: { handle: "buzzbox-host" }, update: { role: UserRole.HOST }, create: { name: "BUZZBOX Host", handle: "buzzbox-host", role: UserRole.HOST, cityId: city.id } });
  const artists = ["DJ Nucleya", "Ritviz", "Maalavika Manoj", "The Local Train", "Aditi Mittal", "Kanan Gill", "Project 91", "Perch Collective", "Midnight Traffic", "Sitar for Mental Health", "Rohan Joshi", "Prateek Kuhad"];
  const artistRecords = await Promise.all(artists.map((name) => { const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); return prisma.artist.upsert({ where: { slug }, update: {}, create: { name, slug } }); }));
  const specs: { title: string; slug: string; category: EventCategory; date: string; venue: number; featured?: boolean; tags: string[] }[] = [
    { title: "LOW-FI LISTENING CLUB", slug: "low-fi-listening-club", category: EventCategory.MUSIC, date: "2026-10-31T21:00:00+05:30", venue: 0, featured: true, tags: ["Listening", "Electronic"] },
    { title: "SUB-CIRCUIT 011: WAREHOUSE EDITION", slug: "sub-circuit-011-warehouse-edition", category: EventCategory.RAVE, date: "2026-10-19T21:00:00+05:30", venue: 0, tags: ["Warehouse", "Techno"] },
    { title: "ROOM SERVICE: DISCO SPECIAL", slug: "room-service-disco-special", category: EventCategory.CLUBS, date: "2026-11-01T22:30:00+05:30", venue: 1, featured: true, tags: ["Disco", "Dance"] },
    { title: "ODDBALL COMEDY: LATE NIGHT SHOWCASE", slug: "oddball-comedy-late-night-showcase", category: EventCategory.COMEDY, date: "2026-10-19T21:00:00+05:30", venue: 2, tags: ["Stand-up", "Late night"] },
    { title: "CITY LIGHTS FESTIVAL", slug: "city-lights-festival", category: EventCategory.FESTIVALS, date: "2026-11-14T17:00:00+05:30", venue: 3, tags: ["Festival", "Live"] },
    { title: "SUNDAY LIVE SESSIONS", slug: "sunday-live-sessions", category: EventCategory.LIVE_SHOWS, date: "2026-11-15T19:00:00+05:30", venue: 1, tags: ["Live music", "Indie"] },
    { title: "ART AFTER DARK", slug: "art-after-dark", category: EventCategory.ART_CULTURE, date: "2026-11-20T20:00:00+05:30", venue: 4, tags: ["Art", "Culture"] },
    { title: "ROOFTOP MOON RITUAL", slug: "rooftop-moon-ritual", category: EventCategory.EXPERIENCES, date: "2026-11-21T19:00:00+05:30", venue: 3, tags: ["Rooftop", "Immersive"] },
    { title: "AFTER HOURS: NO SLEEP CLUB", slug: "after-hours-no-sleep-club", category: EventCategory.AFTER_HOURS, date: "2026-11-22T23:00:00+05:30", venue: 0, tags: ["After hours", "House"] },
  ];
  for (const [index, spec] of specs.entries()) {
    const tiers = [
      { name: "Early Bird", type: TicketTierType.EARLY_BIRD, price: 49900, quantity: 80, position: 0 },
      { name: "General Access", type: TicketTierType.GENERAL, price: 79900, quantity: 160, position: 1 },
      { name: "VIP", type: TicketTierType.VIP, price: 149900, quantity: 30, position: 2 },
    ];
    const event = await prisma.event.upsert({
      where: { slug: spec.slug },
      update: { title: spec.title, category: spec.category, startsAt: new Date(spec.date), venueId: venues[spec.venue]!.id, cityId: city.id, hostId: host.id, status: EventStatus.PUBLISHED, isFeatured: spec.featured ?? false, startingPrice: Math.min(...tiers.map((tier) => tier.price)) },
      create: { title: spec.title, slug: spec.slug, subtitle: "A BUZZBOX night out", description: `${spec.title} brings Delhi together for a night to remember.`, category: spec.category, status: EventStatus.PUBLISHED, startsAt: new Date(spec.date), endsAt: new Date(new Date(spec.date).getTime() + 4 * 60 * 60 * 1000), venueId: venues[spec.venue]!.id, cityId: city.id, hostId: host.id, coverImage: `/images/events/${spec.slug}.jpg`, isFeatured: spec.featured ?? false, startingPrice: Math.min(...tiers.map((tier) => tier.price)) },
    });
    await prisma.$transaction([
      prisma.eventRule.deleteMany({ where: { eventId: event.id } }),
      prisma.eventArtist.deleteMany({ where: { eventId: event.id } }),
      prisma.eventImage.deleteMany({ where: { eventId: event.id } }),
    ]);
    for (const tier of tiers) {
      await prisma.ticketTier.upsert({ where: { eventId_name: { eventId: event.id, name: tier.name } }, update: { ...tier }, create: { ...tier, eventId: event.id } });
    }
    await prisma.eventRule.createMany({ data: ["Valid government ID required", "Doors open 30 minutes before start", "No re-entry after exit", "Tickets are non-transferable"].map((title, position) => ({ eventId: event.id, title, position })) });
    await prisma.eventImage.create({ data: { eventId: event.id, url: `/images/events/${spec.slug}-1.jpg`, position: 0 } });
    await prisma.eventArtist.createMany({ data: artistRecords.slice(index % 7, (index % 7) + 3).map((artist, position) => ({ eventId: event.id, artistId: artist.id, role: position === 0 ? "Headliner" : "Artist", position })) });
    for (const name of spec.tags) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const tag = await prisma.tag.upsert({ where: { slug }, update: { name }, create: { name, slug } });
      await prisma.event.update({ where: { id: event.id }, data: { tags: { connect: { id: tag.id } } } });
    }
  }
}

main().finally(async () => prisma.$disconnect());
