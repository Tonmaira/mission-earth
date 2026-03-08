// app/api/feed/route.js
// GET /api/feed

export async function GET() {
  const feed = [
    {
      id: 1,
      cat: "ME Update",
      date: "Mar 7, 2025",
      title: "Forest Bathing in City",
      sub: "with 6 senses",
      bg: "#1a3a2a",
      imageUrl: "/image/earthfeed/forestbathingincity.jpg",
    },
    {
      id: 2,
      cat: "Event",
      date: "Mar 7, 2025",
      title: "ROHxME Forest Bathing",
      sub: "14-15 Feb, 2026 at Doi Tung",
      bg: "#1a2a3a",
      imageUrl: "/image/earthfeed/forestbathingdoitung.jpg",
    },
    {
      id: 3,
      cat: "News",
      date: "Mar 7, 2025",
      title: "ROHxME MOU",
      sub: "for Sustainable Tourism",
      bg: "#2a1a1a",
      imageUrl: "/image/earthfeed/rohxmemou.jpg",
    },
    {
      id: 4,
      cat: "Event",
      date: "Mar 7, 2025",
      title: "BKK Design Week 2026",
      sub: "Alive sustainable Planet",
      bg: "#2a2a1a",
      imageUrl: "/image/earthfeed/DSC06796.jpg",
    },
    {
      id: 5,
      cat: "ME Update",
      date: "Mar 7, 2025",
      title: "BMAxAFDxME",
      sub: "Alive sustainable Planet",
      bg: "#1a1a2a",
      imageUrl: "/image/earthfeed/bma.jpg",
    },
  ];

  return Response.json(feed);
}