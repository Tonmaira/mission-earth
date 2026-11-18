import { pageMetadata } from "@/lib/seo";

export const viewport = { themeColor: "#0b2540" };

const COPY = {
  th: {
    title: "ร้านค้าที่เข้าร่วม ททท. x Black Ivory Trail",
    description: "รายชื่อร้านค้าที่เข้าร่วมโครงการ ททท. x Black Ivory Trail Thailand 2026 อำเภอแม่จริม จังหวัดน่าน",
  },
  en: {
    title: "TAT x Black Ivory Trail participating shops",
    description: "Shops taking part in TAT x Black Ivory Trail Thailand 2026, Mae Charim, Nan.",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/black_ivory/TATxBITT",
    image: "https://www.missionearth.co/blackIvory/bg-landscape.jpg",
    ...(COPY[locale] ?? COPY.th),
  });
}

export default function Layout({ children }) {
  return children;
}
