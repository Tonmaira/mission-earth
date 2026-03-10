import NavbarSimple from "@/components/NavbarSimple";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";

const portfolioItems = [
  {
    id: 1,
    image: "/project/20260214rohxmeforest bathing/IMG_7238-2.jpg",
    title: "Awaken all six senses with Nature",
    subtitle: "Forest Bathing at Doi Tung, Chiangrai",
    description: "Immersive forest bathing in collaboration with ROH, designed to awaken all six senses and reconnect with nature.",
    meta: [
      { label: "Partner", logo: "/partner/ROH.png" },
      { label: "Date", value: "14-15 February, 2026" },
      { label: "Type", value: "Sustainable Tourism" },
    ],
  },
  {
    id: 2,
    image: "/project/20260130bkkdw/2026-1-21-ASP-BKKDW2026_3.jpg",
    title: "Alive Sustainable Board Game Workshop",
    subtitle: "Bangkok Design Week 2026",
    description: "An interactive learning experience using a board game, designing an ideal city that balances quality of life, environment, and economy.",
    meta: [
      { label: "Partner", logo: "/project/20260130bkkdw/BKKDW.jpg" },
      { label: "Date", value: "30-31 January, 2026\n6-7 February, 2026" },
      { label: "Type", value: "Event" },
    ],
  },
  {
    id: 3,
    image: "/project/20260116cmutalk/DSC05737 copy.jpg",
    title: "Designing the Future We Want to Live In",
    subtitle: "Guest Lecture at the Faculty of Architecture, Chiang Mai University",
    description: "A guest lecture on sustainable design and biodiversity, inspiring the next generation of architects.",
    meta: [
      { label: "Host", logo: "/project/20260116cmutalk/ARCH2024-A4-vio.png" },
      { label: "Date", value: "15 January, 2026" },
      { label: "Type", value: "Event / Talk" },
    ],
  },
  {
    id: 4,
    image: "/project/20260115bmaxmexafd/DSC05603.jpg",
    title: "Designing the Future We Want to Live In",
    subtitle: "Workshop with Bangkok Metropolitan Administration",
    description: "Collaborative workshop on biodiversity and quality of life in partnership with BMA and AFD.",
    meta: [
      { label: "To", logo: "/project/20260115bmaxmexafd/BMA.png" },
      { label: "Collab", logo: "/project/20260115bmaxmexafd/AFD.png" },
      { label: "Date", value: "16 January, 2026" },
      { label: "Type", value: "Event" },
    ],
  },
  {
    id: 5,
    image: "/project/20260114ent/ENT2026.jpg",
    title: "ENT 2026: Community Engagement Through Student Development Activities & Social Enterprise",
    subtitle: "Guest Speaker at ENT 2026 by Chulalongkorn University",
    description: "A talk on community engagement and social enterprise in the context of sustainability.",
    meta: [
      { label: "To", logo: "/project/20260114ent/CU@3x.png" },
      { label: "Date", value: "14 January, 2026" },
      { label: "Type", value: "Event" },
    ],
  },
  {
    id: 6,
    image: "/project/20251117cpatutor2025/2025 CPA Tutor.png",
    title: "15th CPA Tutor 2025",
    subtitle: "Empowering youth in Rayong — ACCELERATE TO THE NEXT STEP!",
    description: "Educational event for Smakom Puen Chumchon, helping high school students in Rayong prepare for university entrance exams.",
    meta: [
      { label: "To", logo: "/project/20251117cpatutor2025/CPA@3x.png" },
      { label: "Date", value: "18-21 November, 2025" },
      { label: "Type", value: "Event" },
    ],
  },
  {
    id: 7,
    image: "/project/20250912tattripforearth/กระเป๋าผ้า-Trip-for-EARTH_print.png",
    title: "TRIP for EARTH",
    subtitle: "TAT Academy Boot Camp 2025",
    description: "Sustainable tourism boot camp promoting responsible tourism marketing and environmental awareness.",
    meta: [
      { label: "To", logo: "/project/20250912tattripforearth/TAT@3x.png" },
      { label: "Date", value: "12-14 September, 2025" },
      { label: "Type", value: "Course" },
    ],
  },
  {
    id: 8,
    image: "/project/20250927bkkcaw/CAW-poster-3.jpg",
    title: "Designing a Planet Full of Life",
    subtitle: "Bangkok Climate Action Week 2025",
    description: "Alive Sustainable Planet board game experience at Bangkok Climate Action Week, fostering climate action through play.",
    meta: [
      { label: "Sponsor", logo: "/project/20250927bkkcaw/ASP@3x.png" },
      { label: "Collab", logo: "/project/20250927bkkcaw/ARCH cu@3x.png" },
      { label: "Date", value: "27-28 September, 2025" },
      { label: "Type", value: "Event / ESG Tools" },
    ],
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#002740] text-white">
      <NavbarSimple />

      {/* Header */}
      <section className="flex flex-col justify-center px-6 md:px-12 lg:px-[144px] py-24 pt-32 md:pt-40">
        <h1 className="font-semibold italic text-[#CEA870] text-[28px] md:text-[36px] lg:text-[48px] tracking-[0.48px] mb-4">
          Portfolio
        </h1>
        <p className="text-white text-[14px] md:text-[16px] tracking-[0.16px] leading-relaxed max-w-[793px]">
          From ESG training and nature camps to creative events and sustainable travel — we design
          experiences that make people care, learn, and take action. Backed by experts and trusted
          by leading organizations across Thailand.
        </p>
      </section>

      {/* Portfolio List */}
      <section className="px-6 md:px-12 lg:px-[144px] pb-[80px]">
        <div className="flex flex-col">
          {portfolioItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row gap-6 md:gap-[36px] py-6 md:py-[24px] ${
                index < portfolioItems.length - 1 ? "border-b border-white/30" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full md:w-[320px] h-[240px] md:h-[400px] shrink-0 rounded-[10px] overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 gap-6 md:pb-6">
                {/* Title + Description */}
                <div className="flex flex-col gap-3 md:gap-4">
                  <div>
                    <p className="font-semibold text-[#CEA870] text-[20px] md:text-[32px] tracking-[0.32px] leading-snug mb-1">
                      {item.title}
                    </p>
                    <p className="text-white text-[13px] md:text-[16px] tracking-[0.16px]">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className="text-[#afafaf] text-[13px] md:text-[16px] tracking-[0.16px] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex gap-2 md:gap-[8px]">
                  {item.meta.map((m) => (
                    <div key={m.label} className="flex flex-col gap-2 flex-1 px-1 md:px-2">
                      <div className="border-b border-[#adadad] pb-1">
                        <p className="text-[#afafaf] text-[12px] md:text-[20px] tracking-[0.2px]">
                          {m.label}
                        </p>
                      </div>
                      {m.logo ? (
                        <div className="relative bg-white rounded-[8px] w-[50px] h-[50px] md:w-[80px] md:h-[80px] overflow-hidden">
                          <Image src={m.logo} alt={m.label} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <p className="text-white text-[12px] md:text-[16px] tracking-[0.16px] whitespace-pre-line">
                          {m.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
