import { cityOptions } from './cities.js'

const image = {
  rave: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeCxKYEognTTfug19Dr8YqkiCOFtKaI6Fz_9HX8DK9G_XJ4VI_w28DF_tlvRCcn4DLJaCzcDcxPZ2VQLpV8-r8NJu7MCAwRb7xpAUAtgK3a2cPfNxtf3nrd9ytaFkIFEkYyvrRV8y9KTOfc_Gvr46o6EepleMnLP8z20s19ijY-p7ilqJircE3cHLDTo-z4TGhvQfPLr6K_2roGMFEqIXxntPqGySjuvmIE5U6476pwdUyJgv6lLS9',
  vinyl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp4HFU-y9HJmvSC1SH_2YKf-BJFBl_IsHYIyBcGeu7tSRd_ItQC6Nm6tFPNYC0VTC7FB7w0eeqNUaU4rr3JZoCPkeIQsQ41sAfx9GlKf9kkWTwxpLrflpXfOAojisgSx0GWlK58jnK3ml31e-sksKa4MAH7pAmskjkgAOCGOAzXfY_mnEY-roHjex6AKdzqqOWDFAgRd5aaZFr_Re_BPYy7cdtvzdgGFjvHVHdxk9R-LyJky5nRgeP',
  comedy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyXS7HhWAudYIb1U0dLpwhrwsBh6651tX8Fgs2Ziwb-bAeK023nqyJcXBmMRKGmmhdUuT4_sbaNEnCFEht-5HSKgp5x8A_zMOg2aFDRArRrI1qqMXMLJQriDR8GJjIoM0gjTaTwo1Eyth7wGgATCaLqLgnpf-HCajKnzXyfocweDJK315lBBZmZtdqc__UGNdyPE858yWqOtsCSyyyCX5hQ1f6d1YRHWc-w0Nl6sCrA2oK0gdGN1C-',
  art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANt8hrVIKBMpfTLpGsYdhCD045mISeuOtnZwtBnC3kO76XR04zTVWC7hftlGGKLH6-KeSY7I4_LzYhGpWgQn15ymyeYiFoaT-dyyBIYD4aL_L6PowpeprRghIvELRLj26ArYj6J5gJTRNfvil1ZareQuJxeIF7RCI9hdYL6QwSr2xMJITEg3MvWHeu4zV9pRUsWzMTrh3nwa-bzmwhnenyBkJSlQSywcGd1-i6E9C8g7zuoFuc2DIQ',
}

const eventImages = [
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85',
]

const definitions = [
  ['MUSIC', image.vinyl, [
    ['Monsoon Frequency Sessions', 'An intimate selector set moving from warm jazz cuts to deep house.', 'Blue Tokai Listening Room', 'Mumbai'],
    ['Analog Dawn: Rare Grooves', 'Collectors trade deep cuts in a room tuned for full-bodied sound.', 'Bandra Sound Room', 'Mumbai'],
    ['Indigo Strings Live', 'An indie ensemble reshapes folk melodies with looping strings and synth.', 'The Humming Tree', 'Bengaluru'],
    ['Rooftop Raag & Rhythm', 'A live fusion quartet pairs classical percussion with electronic textures.', 'Skyline Terrace', 'Jaipur'],
    ['Low-Fi Listening Club', 'A no-phone album listening night hosted by local record selectors.', 'The Dhan Mill Compound', 'Delhi NCR'],
    ['City Side Sessions', 'A rotating crew of selectors makes a shared soundtrack from fresh local finds.', 'The Listening Loft', 'Noida'],
  ]],
  ['RAVE', image.rave, [
    ['Sub-Circuit 011: Warehouse Edition', 'Heavy sub-bass and modular live audio inside an industrial space.', 'The Dhan Mill Compound', 'Delhi NCR'],
    ['Monsoon Signal', 'A night of hypnotic techno, strobes, and deep warehouse energy.', 'Dockyard 04', 'Mumbai'],
    ['Redline Frequencies', 'Local underground selectors take over a converted factory floor.', 'Factory by the Lake', 'Hyderabad'],
    ['Concrete Mirage', 'A late-night open-air dance ritual with immersive light design.', 'Mahalaxmi Mill', 'Pune'],
    ['Desert Pulse Assembly', 'Driving rhythms and sunrise visuals meet on the edge of the city.', 'Aravalli Grounds', 'Gurugram'],
    ['Central India Sound System', 'A weighty low-end session with local crews and raw warehouse energy.', 'Foundry Hall', 'Indore'],
  ]],
  ['CLUBS', image.rave, [
    ['Velvet Room: House Rules', 'A resident-led house night with an all-vinyl warm-up.', 'Velvet Room', 'Bengaluru'],
    ['Coastal Club Frequencies', 'Balearic grooves and club edits by the Arabian Sea.', 'Tide Room', 'Goa'],
    ['Afterglow at 24K', 'A dance-floor focused night with guest selectors from the city.', '24K Club', 'Kolkata'],
    ['Room Service: Disco Special', 'Disco, edits, and a packed floor in an intimate club.', 'The Piano Man', 'Delhi NCR'],
    ['Neon Garden Sessions', 'A club night built around melodic house and vivid projections.', 'Garden Social', 'Chennai'],
    ['Surat Social Club Night', 'An energetic mix of house edits and disco favourites on a close-knit floor.', 'Club Marigold', 'Surat'],
  ]],
  ['COMEDY', image.comedy, [
    ['Oddball Comedy: Late Night Showcase', 'Five sharp comics test new material in a close-up cellar room.', 'Hauz Khas Cellar', 'Delhi NCR'],
    ['Punchlines on the Pier', 'A rotating line-up of stand-up comics brings fresh city stories.', 'The Habitat', 'Mumbai'],
    ['Bengaluru Laugh Lab', 'A high-energy showcase of new jokes and unexpected pairings.', 'Urban Solace', 'Bengaluru'],
    ['Mic Drop: City Edition', 'A lively stand-up set featuring crowd favourites and rising voices.', 'Silly Souls', 'Pune'],
    ['The Unfiltered Hour', 'A late set for clever observations and fearless punchlines.', 'The Comedy Theatre', 'Hyderabad'],
    ['Blue City Comedy Club', 'A hand-picked line-up brings sharp new stand-up to an intimate room.', 'The Courtyard Stage', 'Jodhpur'],
  ]],
  ['FESTIVALS', image.art, [
    ['City Lights Micro Festival', 'Independent music, street food, and installations in one open-air gathering.', 'JLN Stadium Grounds', 'Delhi NCR'],
    ['Sea Change Weekender', 'Two days of coastal sounds, art, and community-led workshops.', 'Vagator Grounds', 'Goa'],
    ['Indie Bloom Festival', 'Emerging bands and independent labels take over a garden venue.', 'Palace Grounds', 'Bengaluru'],
    ['Riverfront Culture Fest', 'Live acts, regional crafts, and local food by the waterfront.', 'Sabarmati Riverfront', 'Ahmedabad'],
    ['Pink City Sound Garden', 'A one-day gathering of live music, visual art, and makers.', 'Jaipur Literature Garden', 'Jaipur'],
    ['Valley Frequency Weekend', 'Independent artists and mountain makers gather for a day of live culture.', 'Pine Grove Grounds', 'Dehradun'],
  ]],
  ['LIVE SHOWS', image.vinyl, [
    ['Modular Synth Odyssey', 'A live performance built from modular synths and field recordings.', 'Chattarpur Farm 04', 'Delhi NCR'],
    ['The Paper Planes Live', 'An indie rock set with new songs and stripped-back favourites.', 'AntiSocial', 'Mumbai'],
    ['Blue Room Jazz Quartet', 'A late-night live jazz set led by a celebrated local pianist.', 'Windmills Craftworks', 'Bengaluru'],
    ['Sitar / Signal', 'A live collaboration between sitar, tabla, and ambient electronics.', 'Rangbhoomi', 'Lucknow'],
    ['Electric Monsoon Live', 'A high-voltage set from a touring electronic duo.', 'Phoenix Arena', 'Chennai'],
    ['River City Sessions', 'A live ensemble brings new folk and electronic arrangements to the stage.', 'Kala Kendra', 'Bhubaneswar'],
  ]],
  ['ART & CULTURE', image.art, [
    ['Neon Ambient: A/V Session', 'Generative visuals and spatial sound fill an immersive black box.', 'Okhla Warehouse 09', 'Delhi NCR'],
    ['Light Prism Installation', 'An interactive light installation responds to movement and sound.', 'Dhan Mill Art Lab', 'Goa'],
    ['Afterimage: New Media Salon', 'Artists share moving-image works followed by an open conversation.', 'Gallery 5', 'Kochi'],
    ['City in Layers', 'A guided evening through projection art and urban storytelling.', 'Lalbagh Glass House', 'Bengaluru'],
    ['Clay, Colour, Conversation', 'A hands-on contemporary craft salon with local artists.', 'The Art Hub', 'Udaipur'],
    ['Brahmaputra Moving Image Night', 'A small-screen showcase pairs regional films with sound and artist talks.', 'Riverbank Art House', 'Guwahati'],
  ]],
  ['EXPERIENCES', image.art, [
    ['Midnight Greenhouse Disco', 'Groove-led disco wrapped around a botanical sensory journey.', 'Glasshouse Social', 'Pune'],
    ['Secret Supper: Coastal Table', 'A chef-led communal dinner celebrating seasonal coastal cooking.', 'The Courtyard', 'Kochi'],
    ['Analog Audiophile Salon', 'An intimate listening session on a hand-built hi-fi sound system.', 'Record Room', 'Gurugram'],
    ['Night Kayak & Sound Bath', 'A guided twilight paddle followed by a restorative sound session.', 'Rishikesh Riverside', 'Rishikesh'],
    ['Scent Stories: The Atelier', 'Explore local botanicals through a guided fragrance-making workshop.', 'Studio Scent', 'Ahmedabad'],
    ['Harbour to Hills Supper', 'A chef and storyteller host a relaxed evening around regional flavours.', 'The Gallery Table', 'Visakhapatnam'],
  ]],
  ['AFTER HOURS', image.rave, [
    ['Vinyl After Dark', 'Deep cuts and low lights at a late-night listening bar.', 'Indy Listening Room', 'Mumbai'],
    ['Last Call: Basement Selectors', 'A no-request underground session carrying on past midnight.', 'The Basement', 'Kolkata'],
    ['Night Shift Radio', 'Live community radio and left-field dance music until late.', 'Radio Bar', 'Bengaluru'],
    ['Midnight Standup Raw', 'A no-frills late-night comedy set for night owls.', 'Connaught Basement', 'Delhi NCR'],
    ['Blue Hour Sound Club', 'A final set of ambient and downtempo music as the city winds down.', 'Blue Note Room', 'Chandigarh'],
    ['Last Light Listening Club', 'Soft-focus records and warm drinks close out the night above the valley.', 'Hillside Listening Room', 'Shimla'],
  ]],
]

const featuredCities = cityOptions.filter((city) => city !== 'All Cities')
const nowInIndia = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const parseDateKey = (key) => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}
const shiftDays = (date, days) => { const shifted = new Date(date); shifted.setDate(shifted.getDate() + days); return shifted }
const today = nowInIndia()
const weekendDaysUntil = (today.getDay() === 0 ? 5 : today.getDay() === 6 ? 6 : 5 - today.getDay())
const weekendStart = shiftDays(today, weekendDaysUntil)
const weekendEnd = shiftDays(weekendStart, 2)
const nextWeekStart = shiftDays(weekendEnd, 2)
export const events = definitions.flatMap(([category, , entries], categoryIndex) => entries.map(([title, description, venue, city], index) => {
  const isTonight = index === 0 && (categoryIndex < 6 || categoryIndex === 8)
  const isFeaturedWeekend = categoryIndex === 7 && index === 0
  const isWeekendEvent = (categoryIndex + index) % 3 === 0
  const eventDate = isTonight ? today : isFeaturedWeekend ? weekendStart : isWeekendEvent ? shiftDays(weekendStart, (categoryIndex + index) % 3) : shiftDays(nextWeekStart, (categoryIndex + index) % 7)
  const categories = [category]
  if (['RAVE', 'CLUBS', 'FESTIVALS', 'LIVE SHOWS', 'AFTER HOURS'].includes(category)) categories.push('MUSIC')
  if (['RAVE', 'CLUBS', 'COMEDY'].includes(category)) categories.push('AFTER HOURS')
  if (['FESTIVALS', 'ART & CULTURE'].includes(category)) categories.push('EXPERIENCES')
  const eventImage = eventImages[(index + categoryIndex) % eventImages.length]
  return {
    id: `${category.toLowerCase().replaceAll(' ', '-')}-${index + 1}`,
    category,
    categories: [...new Set(categories)],
    city: city || featuredCities[(categoryIndex * 5 + index) % featuredCities.length],
    date: dateKey(eventDate),
    time: index % 2 ? '10:30 PM' : '09:00 PM',
    title,
    description,
    venue,
    image: eventImage,
    action: 'Explore Event',
    address: `${venue}, ${city}`,
    latitude: 28.6139 + categoryIndex * 0.012 + index * 0.001,
    longitude: 77.209 + categoryIndex * 0.012 + index * 0.001,
    ageLimit: 18,
    lineup: [
      ['RAVE', 'CLUBS', 'AFTER HOURS'].includes(category) ? 'Local selectors' : 'Featured artists',
      'Special guests',
    ],
    ticketTiers: [
      { name: 'Early Access', price: 799, availableQuantity: 40 },
      { name: 'General Entry', price: 1199, availableQuantity: 120 },
      { name: 'Door Entry', price: 1599, availableQuantity: 30 },
    ],
    goodToKnow: ['Valid photo ID required', 'Re-entry is not permitted', 'Tickets are non-refundable'],
  }
}))

export function eventMatchesDate(event, dateFilter, referenceDate = nowInIndia()) {
  if (dateFilter === 'All Dates') return true
  const eventDate = parseDateKey(event.date)
  const startOfToday = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())
  const daysFromToday = Math.round((eventDate - startOfToday) / 86400000)
  if (dateFilter === 'Tonight') return daysFromToday === 0
  if (dateFilter === 'This Weekend') return eventDate >= parseDateKey(dateKey(weekendStart)) && eventDate <= parseDateKey(dateKey(weekendEnd))
  if (dateFilter === 'Next Week') return daysFromToday >= 7 && daysFromToday <= 13
  return true
}

export const radarEvents = events
export const weekendEvents = events.filter((event) => eventMatchesDate(event, 'This Weekend'))

export const vibeTiles = [
  ['Loud & Late', 'Warehouse Rave', image.rave], ['Deep & Chill', 'Listening Rooms', image.vinyl],
  ['Dance Floor', 'Club Grooves', image.rave], ['Live & Raw', 'Indie Sound', image.vinyl],
  ['Funny After Dark', 'Cellar Comedy', image.comedy], ['Art After Hours', 'A/V Installations', image.art],
]

export const categories = ['ALL', 'TONIGHT', 'MUSIC', 'RAVE', 'CLUBS', 'COMEDY', 'FESTIVALS', 'LIVE SHOWS', 'ART & CULTURE', 'EXPERIENCES', 'AFTER HOURS']
