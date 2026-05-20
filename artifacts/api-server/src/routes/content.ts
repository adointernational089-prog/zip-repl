import { Router } from "express";
import { getSupabase } from "../lib/db.js";
import { requireAdmin, type AuthRequest } from "../middlewares/requireAuth.js";

const router = Router();

const DEFAULT_CONTENT = {
  hero: {
    title: "I build powerful web apps & digital solutions",
    badge: "IT Student · Web App Developer · Designer",
    bio: "IT student creating practical, real-world applications that solve real problems. Based in Kathmandu, Nepal.",
  },
  about: {
    text: "I'm Bishal Bishwokarma, an IT student from Kathmandu, Nepal and passionate about modern technology. I build apps, software, and designs that solve real problems. I bring both technical skills and communication ability to every project. My goal is to be a good and successful person by delivering value through technology.",
  },
  skills: {
    programming: [
      { icon: "⊞", label: "HTML / CSS" },
      { icon: ">_", label: "Python" },
      { icon: "</>", label: "C" },
      { icon: "▦", label: "SQL" },
    ],
    tools: [
      { icon: "⬡", label: "Supabase" },
      { icon: "⊕", label: "Git / GitHub" },
      { icon: "◈", label: "Figma" },
      { icon: "▣", label: "Canva" },
      { icon: "△", label: "Vercel" },
    ],
    other: [
      { icon: "💡", label: "Problem Solving" },
      { icon: "□", label: "Communication" },
      { icon: "⊞", label: "Project Management" },
      { icon: "★", label: "Fast Learner" },
    ],
  },
  services: [
    { icon: "🎨", title: "Thumbnail & Post Design", price: "Starting from Rs. 500", description: "Eye-catching thumbnails and social media post designs that increase engagement and attract audience attention.", tag: "Quick Service", tagColor: "green", featured: false },
    { icon: "🌐", title: "Personal Website Development", price: "Rs. 8,000 – Rs. 15,000", description: "Modern, responsive and fully customized personal websites with clean UI, fast performance and essential features.", tag: "Most Popular", tagColor: "blue", featured: true },
    { icon: "🏢", title: "Company Website Development", price: "Rs. 20,000 – Rs. 30,000", description: "Professional business websites with branding, scalability and user-focused design to grow your online presence.", tag: "", tagColor: "", featured: false },
    { icon: "📱", title: "Mobile App Development", price: "Rs. 25,000 – Rs. 40,000", description: "High-quality mobile apps with smooth UI/UX, performance optimization and essential features.", tag: "", tagColor: "", featured: false },
    { icon: "🖥️", title: "Office Management Software", price: "Rs. 30,000 – Rs. 50,000", description: "Custom-built systems to manage office operations, automate workflows and improve efficiency.", tag: "", tagColor: "", featured: false },
    { icon: "🚚", title: "Logistics Software", price: "Rs. 50,000 – Rs. 1,00,000", description: "Powerful logistics systems with tracking, analytics, automation and scalable architecture.", tag: "Advanced", tagColor: "purple", featured: false },
    { icon: "🔧", title: "Maintenance & Monthly Support", price: "Rs. 2,000 – Rs. 8,000 / month", description: "Ongoing support, updates, bug fixes and performance improvements to keep your product running smoothly.", tag: "", tagColor: "", featured: false },
  ],
  contact: {
    email: "bishalbishwokarma089@gmail.com",
    phone: "9802485583",
    location: "Kathmandu, Nepal",
    facebook: "https://www.facebook.com/bishal.bishwokarma.359",
    linkedin: "https://www.linkedin.com/in/bishal-bishwokarma-453608277",
    whatsapp: "9802485583",
  },
  education: [
    { period: "Upto SEE", title: "School Education", school: "Manakamana English Boarding School, Bhakunde, Lamjung" },
    { period: "2021-2023", title: "+2 in Bio-Science", school: "Prerana College, Bharatpur, Chitwan" },
    { period: "2023-Present", title: "Bachelor in IT", school: "Phoenix College of Management [Lincoln University], Maitidev, Kathmandu" },
  ],
};

async function getAllContent() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from("site_content").select("section, content");
    if (error) return DEFAULT_CONTENT;
    const result: any = { ...DEFAULT_CONTENT };
    for (const row of data || []) {
      const def = (DEFAULT_CONTENT as any)[row.section];
      if (def && typeof def === "object" && !Array.isArray(def)) {
        result[row.section] = { ...def, ...row.content };
      } else {
        result[row.section] = row.content ?? def;
      }
    }
    return result;
  } catch {
    return DEFAULT_CONTENT;
  }
}

router.get("/", async (_req, res) => {
  res.json(await getAllContent());
});

router.get("/:section", async (req, res) => {
  const { section } = req.params;
  try {
    const sb = getSupabase();
    const { data } = await sb.from("site_content").select("content").eq("section", section).single();
    const def = (DEFAULT_CONTENT as any)[section] ?? {};
    if (data?.content) {
      const merged = Array.isArray(def) ? data.content : { ...def, ...data.content };
      res.json(merged);
    } else {
      res.json(def);
    }
  } catch {
    res.json((DEFAULT_CONTENT as any)[req.params.section] ?? {});
  }
});

router.put("/:section", requireAdmin, async (req: AuthRequest, res) => {
  const { section } = req.params;
  const content = req.body;
  try {
    const sb = getSupabase();
    const { error } = await sb
      .from("site_content")
      .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: "section" });
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/setup-table", requireAdmin, async (req: AuthRequest, res) => {
  const sql = `CREATE TABLE IF NOT EXISTS site_content (
  section TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);`;
  try {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: process.env.SUPABASE_DATABASE_URL });
    await pool.query(sql);
    await pool.end();
    res.json({ success: true, message: "site_content table created successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message, sql });
  }
});

export default router;
