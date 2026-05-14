export default function sitemap() {
  const base = "https://missionearth.co";
  return [
    { url: base,                                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,                               lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/services`,                            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/portfolio`,                           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,                             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/activities/dek-sang-nan-2`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
  ];
}
