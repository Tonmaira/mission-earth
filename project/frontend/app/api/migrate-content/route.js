import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MOCK_CONTENT = {
  "Forest Bathing in City": {
    blocks: [
      { type: "paragraph", text: "In the heart of Bangkok, Mission Earth brought the healing power of the forest into the city. The Forest Bathing in City experience invited participants to awaken all six senses — sight, sound, smell, taste, touch, and a sixth sense of presence — through guided nature immersion." },
      { type: "image", src: "/image/earthfeed/forestbathingincity.jpg", caption: "Participants experiencing mindful forest bathing in an urban setting" },
      { type: "paragraph", text: "Rooted in the Japanese practice of Shinrin-yoku, this urban adaptation was designed for city dwellers who rarely have access to deep nature. The session guided participants through breath awareness, sensory walks, and silent reflection — all within a green urban space." },
      { type: "quote", text: "Nature doesn't need to be far away. It lives in every leaf, every breath, every moment of stillness we allow ourselves." },
      { type: "paragraph", text: "The event was part of Mission Earth's ongoing effort to make sustainability and wellbeing accessible to everyone — regardless of where they live. By bringing the forest to the city, we hope to inspire a deeper connection between people and the natural world." },
    ],
    tags: ["Forest Bathing", "Wellbeing", "Urban Nature", "Shinrin-yoku"],
  },
  "ROHxME Forest Bathing": {
    blocks: [
      { type: "paragraph", text: "Mission Earth partnered with Royal Orchid Holidays (ROH) to create a two-day immersive forest bathing experience at the pristine forests of Doi Tung, Chiangrai. The retreat brought together 30 participants for a transformative journey into nature." },
      { type: "image", src: "/image/earthfeed/forestbathingdoitung.jpg", caption: "Participants at Doi Tung forest, 14-15 February 2026" },
      { type: "paragraph", text: "Guided by certified Shinrin-yoku practitioners, participants spent two days awakening all six senses through mindful walks, sensory exercises, and reflective journaling. The towering pine forests of Doi Tung provided the perfect backdrop for deep reconnection with nature." },
      { type: "quote", text: "This is what sustainability feels like — not just a policy or a goal, but a lived experience of belonging to this Earth." },
      { type: "paragraph", text: "The collaboration with ROH marks a milestone in sustainable tourism, blending premium travel experiences with genuine environmental education and personal wellbeing." },
    ],
    tags: ["Forest Bathing", "ROH", "Sustainable Travel", "Doi Tung", "Chiangrai"],
  },
  "ROHxME MOU": {
    blocks: [
      { type: "paragraph", text: "Mission Earth and Royal Orchid Holidays (ROH) have signed a Memorandum of Understanding (MOU) to jointly develop and promote sustainable tourism experiences across Thailand. The partnership aims to integrate ESG principles into premium travel offerings." },
      { type: "image", src: "/image/earthfeed/rohxmemou.jpg", caption: "MOU signing ceremony between Mission Earth and Royal Orchid Holidays" },
      { type: "paragraph", text: "Under this agreement, both organizations will co-design nature-based experiences, responsible travel itineraries, and environmental education programs for ROH's clients — from corporate groups to individual travelers seeking meaningful journeys." },
      { type: "quote", text: "Sustainable tourism is not just about reducing impact — it's about creating experiences that inspire lasting change." },
      { type: "paragraph", text: "This MOU represents a shared commitment to demonstrating that luxury and sustainability are not opposites — they are complementary values that create richer, more meaningful travel experiences." },
    ],
    tags: ["MOU", "ROH", "Sustainable Tourism", "Partnership"],
  },
  "BKK Design Week 2026": {
    blocks: [
      { type: "paragraph", text: "Mission Earth brought the Alive Sustainable Planet (ASP) board game to Bangkok Design Week 2026 at TCDC, inviting the public to step into the role of a city planner and design a sustainable urban future." },
      { type: "image", src: "/image/earthfeed/DSC06796.jpg", caption: "Bangkok Design Week 2026 — Alive Sustainable Planet workshop at TCDC" },
      { type: "paragraph", text: "Over five sessions across two weekends (January 30–31 and February 6–8), hundreds of participants engaged with the interactive game — balancing quality of life, environmental health, and economic vitality to build their ideal city." },
      { type: "quote", text: "Design is a tool for imagining better futures. And sustainability is the most important design challenge of our time." },
      { type: "paragraph", text: "The event was a resounding success, demonstrating that sustainability education can be engaging, creative, and accessible to people of all ages and backgrounds." },
    ],
    tags: ["Bangkok Design Week", "Board Game", "ESG Tools", "TCDC"],
  },
  "BMAxAFDxME": {
    blocks: [
      { type: "paragraph", text: "Mission Earth collaborated with Bangkok Metropolitan Administration (BMA) and Agence Française de Développement (AFD) to deliver a workshop on biodiversity and urban quality of life for architecture students and urban planners." },
      { type: "image", src: "/image/earthfeed/bma.jpg", caption: "BMA x AFD x Mission Earth workshop on sustainable urban planning" },
      { type: "paragraph", text: "The workshop used the Alive Sustainable Planet board game as a facilitation tool, helping participants explore the complex relationships between urban development, biodiversity, and human wellbeing. Teams competed to design the most sustainable and livable city." },
      { type: "quote", text: "Cities are ecosystems too. The decisions we make about urban space affect every living thing — human and non-human alike." },
      { type: "paragraph", text: "This three-way collaboration represents a growing recognition that sustainability challenges require cross-sector partnership — between government, international development agencies, and civil society organizations like Mission Earth." },
    ],
    tags: ["BMA", "AFD", "Urban Planning", "Biodiversity"],
  },
};

export async function GET() {
  const { data: articles, error } = await supabase.from("articles").select("id, title");
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = [];
  for (const article of articles) {
    const mock = MOCK_CONTENT[article.title];
    if (!mock) {
      results.push({ title: article.title, status: "no match" });
      continue;
    }
    const { error: updateError } = await supabase
      .from("articles")
      .update({ blocks: mock.blocks, tags: mock.tags })
      .eq("id", article.id);
    results.push({ title: article.title, status: updateError ? updateError.message : "updated" });
  }

  return Response.json({ results });
}
