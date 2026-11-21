// Static presentation data only. Real event records always come from the API.
export const eventCategories = [
  'ALL', 'TONIGHT', 'MUSIC', 'RAVE', 'CLUBS', 'COMEDY',
  'FESTIVALS', 'LIVE SHOWS', 'ART & CULTURE', 'EXPERIENCES', 'AFTER HOURS',
]

const images = {
  rave: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeCxKYEognTTfug19Dr8YqkiCOFtKaI6Fz_9HX8DK9G_XJ4VI_w28DF_tlvRCcn4DLJaCzcDcxPZ2VQLpV8-r8NJu7MCAwRb7xpAUAtgK3a2cPfNxtf3nrd9ytaFkIFEkYyvrRV8y9KTOfc_Gvr46o6EepleMnLP8z20s19ijY-p7ilqJircE3cHLDTo-z4TGhvQfPLr6K_2roGMFEqIXxntPqGySjuvmIE5U6476pwdUyJgv6lLS9',
  vinyl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp4HFU-y9HJmvSC1SH_2YKf-BJFBl_IsHYIyBcGeu7tSRd_ItQC6Nm6tFPNYC0VTC7FB7w0eeqNUaU4rr3JZoCPkeIQsQ41sAfx9GlKf9kkWTwxpLrflpXfOAojisgSx0GWlK58jnK3ml31e-sksKa4MAH7pAmskjkgAOCGOAzXfY_mnEY-roHjex6AKdzqqOWDFAgRd5aaZFr_Re_BPYy7cdtvzdgGFjvHVHdxk9R-LyJky5nRgeP',
  comedy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyXS7HhWAudYIb1U0dLpwhrwsBh6651tX8Fgs2Ziwb-bAeK023nqyJcXBmMRKGmmhdUuT4_sbaNEnCFEht-5HSKgp5x8A_zMOg2aFDRArRrI1qqMXMLJQriDR8GJjIoM0gjTaTwo1Eyth7wGgATCaLqLgnpf-HCajKnzXyfocweDJK315lBBZmZtdqc__UGNdyPE858yWqOtsCSyyyCX5hQ1f6d1YRHWc-w0Nl6sCrA2oK0gdGN1C-',
  art: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANt8hrVIKBMpfTLpGsYdhCD045mISeuOtnZwtBnC3kO76XR04zTVWC7hftlGGKLH6-KeSY7I4_LzYhGpWgQn15ymyeYiFoaT-dyyBIYD4aL_L6PowpeprRghIvELRLj26ArYj6J5gJTRNfvil1ZareQuJxeIF7RCI9hdYL6QwSr2xMJITEg3MvWHeu4zV9pRUsWzMTrh3nwa-bzmwhnenyBkJSlQSywcGd1-i6E9C8g7zuoFuc2DIQ',
}

// Each tile maps an editorial vibe to the API category label used by HomePage.
export const vibeTiles = [
  { title: 'Loud & Late', subtitle: 'Warehouse Rave', category: 'RAVE', image: images.rave },
  { title: 'Deep & Chill', subtitle: 'Listening Rooms', category: 'MUSIC', image: images.vinyl },
  { title: 'Dance Floor', subtitle: 'Club Grooves', category: 'CLUBS', image: images.rave },
  { title: 'Live & Raw', subtitle: 'Indie Sound', category: 'MUSIC', image: images.vinyl },
  { title: 'Funny After Dark', subtitle: 'Cellar Comedy', category: 'COMEDY', image: images.comedy },
  { title: 'Art After Hours', subtitle: 'A/V Installations', category: 'ART & CULTURE', image: images.art },
]

// Tests whether a normalized API event belongs to a user-facing date filter.
export function eventMatchesDate(event, dateFilter, now = new Date()) {
  if (dateFilter === 'All Dates') return true
  const eventDate = new Date(`${event.date}T00:00:00+05:30`)
  const today = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const daysFromToday = Math.round((eventDate - startOfToday) / 86400000)
  if (dateFilter === 'Tonight') return daysFromToday === 0
  if (dateFilter === 'Next Week') return daysFromToday >= 7 && daysFromToday <= 13
  if (dateFilter === 'This Weekend') {
    const daysUntilFriday = (5 - today.getDay() + 7) % 7
    return daysFromToday >= daysUntilFriday && daysFromToday <= daysUntilFriday + 2
  }
  return true
}
