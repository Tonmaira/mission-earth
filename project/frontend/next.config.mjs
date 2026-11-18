import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpdcfsmqmeyarneakmiz.supabase.co",
      },
    ],
    // Next 16 ต้อง whitelist ค่า quality ที่ใช้ได้ — 70 ใช้กับรูปพื้นหลังที่อยู่ใต้ gradient
    qualities: [70, 75],
    // รูปที่ optimize แล้วเก็บแคชไว้ 30 วัน (default 60 วิ) ลดการดึงซ้ำจาก Supabase
    minimumCacheTTL: 2592000,
  },
  // หน้าร้านค้า ททท. ย้ายไปอยู่ใต้ /black_ivory — QR ชุดแรกชี้ /TATxBITT ไว้ ให้ยังเปิดได้
  async redirects() {
    return [
      { source: "/TATxBITT", destination: "/th/black_ivory/TATxBITT", permanent: true },
      { source: "/:locale(th|en)/TATxBITT", destination: "/:locale/black_ivory/TATxBITT", permanent: true },
    ];
  },
}

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

export default withNextIntl(nextConfig)