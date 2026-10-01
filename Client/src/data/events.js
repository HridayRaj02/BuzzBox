export const events = [
  {
    id: "raaga",
    title: "Raaga: An evening of Hindustani",
    category: "Music",
    date: "18 Oct 2026",
    time: "7:00 PM",
    place: "Kamani Auditorium, Delhi",
    city: "Delhi",
    price: 850,
    art: "raaga",
    tag: "LIVE MUSIC",
    description:
      "A close listening evening of khayal and thumri, led by a small ensemble of Hindustani classical musicians.",
  },
  {
    id: "paper",
    title: "The art of handmade paper",
    category: "Workshop",
    date: "24 Oct 2026",
    time: "11:00 AM",
    place: "Kiran Nadar Museum of Art, Noida",
    city: "Noida",
    price: 1200,
    art: "paper",
    tag: "WORKSHOP",
    description:
      "Explore the rhythm of the handmade sheet in a guided, hands-on paper making workshop.",
  },
  {
    id: "shorts",
    title: "Shorts on the big screen",
    category: "Film",
    date: "25 Oct 2026",
    time: "6:30 PM",
    place: "India Habitat Centre, Delhi",
    city: "Delhi",
    price: 450,
    art: "film",
    tag: "SCREENING",
    description:
      "A considered programme of independent short films, followed by a conversation with the filmmakers.",
  },
  {
    id: "courtyard",
    title: "A courtyard supper club",
    category: "Food",
    date: "31 Oct 2026",
    time: "8:00 PM",
    place: "Hauz Khas Village, Delhi",
    city: "Delhi",
    price: 1800,
    art: "supper",
    tag: "FOOD & DRINK",
    description:
      "A seasonal, shared-table menu inspired by the produce and kitchens of North India.",
  },
  {
    id: "print",
    title: "Printmaking, slowly",
    category: "Art",
    date: "7 Nov 2026",
    time: "10:30 AM",
    place: "Triveni Kala Sangam, Delhi",
    city: "Delhi",
    price: 950,
    art: "print",
    tag: "ART & DESIGN",
    description:
      "Make a small edition by hand and learn the fundamentals of relief printing with a local artist.",
  },
  {
    id: "jazz",
    title: "Sunday jazz at the studio",
    category: "Music",
    date: "8 Nov 2026",
    time: "5:00 PM",
    place: "Studio Safdar, Delhi",
    city: "Delhi",
    price: 600,
    art: "jazz",
    tag: "LIVE MUSIC",
    description:
      "An intimate afternoon set exploring standards, improvisation, and new compositions.",
  },
];

export const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

export const readLocal = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeLocal = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));
