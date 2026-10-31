import { pageMetadata } from "@/lib/seo";

/* viewport-fit=cover ให้วิดีโอพื้นหลังลอดใต้แถบ Safari ได้เต็มจอ
   ส่วนเนื้อหากัน safe-area เองใน page.js */
export const viewport = {
  themeColor: "#0b2540",
  viewportFit: "cover",
};

const COPY = {
  th: {
    title: "Black Ivory Trail Thailand 2026",
    description:
      "Mission Earth Black Ivory Trail Thailand วิ่งเทรล 5K / 8K / 12K 20-21 พฤศจิกายน 2026 อำเภอแม่จริม จังหวัดน่าน",
  },
  en: {
    title: "Black Ivory Trail Thailand 2026",
    description:
      "Mission Earth Black Ivory Trail Thailand — 5K / 8K / 12K trail run, 20-21 Nov 2026, Mae Charim, Nan.",
  },
};

const KEYWORDS = ["Black Ivory Trail", "วิ่งเทรล น่าน", "แม่จริม", "trail run", "Mission Earth"];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: "/black_ivory",
    keywords: KEYWORDS,
    image: "https://www.missionearth.co/blackIvory/bg-landscape.jpg",
    ...(COPY[locale] ?? COPY.th),
  });
}

export default function Layout({ children }) {
  return children;
}
