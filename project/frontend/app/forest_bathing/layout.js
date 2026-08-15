export const viewport = {
  themeColor: "#002740",
};

export const metadata = {
  title: "Forest Bathing | Mission Earth",
  description:
    "Forest Bathing by Mission Earth — กิจกรรมอาบป่า เชื่อมโยงร่างกายและจิตใจเข้ากับธรรมชาติ",
  keywords: [
    "Forest Bathing",
    "อาบป่า",
    "Shinrin-yoku",
    "Mission Earth",
    "กิจกรรมธรรมชาติ",
    "wellness",
  ],
  alternates: {
    canonical: "https://www.missionearth.co/forest_bathing",
  },
  openGraph: {
    title: "Forest Bathing | Mission Earth",
    description:
      "Forest Bathing by Mission Earth — กิจกรรมอาบป่า เชื่อมโยงร่างกายและจิตใจเข้ากับธรรมชาติ",
    url: "https://www.missionearth.co/forest_bathing",
    siteName: "Mission Earth",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forest Bathing | Mission Earth",
    description:
      "Forest Bathing by Mission Earth — กิจกรรมอาบป่า เชื่อมโยงร่างกายและจิตใจเข้ากับธรรมชาติ",
  },
};

export default function Layout({ children }) {
  return children;
}
