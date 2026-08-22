export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    // ต้องเป็นโดเมนเดียวกับ canonical และ sitemap เสมอ — missionearth.co เด้งไป www อยู่แล้ว
    // ถ้าชี้คนละโดเมน Google จะเจอ sitemap ผ่าน redirect ซึ่งบางทีก็ไม่ตาม
    sitemap: "https://www.missionearth.co/sitemap.xml",
  };
}
