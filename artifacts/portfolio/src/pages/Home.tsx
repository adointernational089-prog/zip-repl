import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSendMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Code2, Wrench, Lightbulb, Monitor, Smartphone, Palette,
  Mail, Phone, MapPin, ArrowRight, Facebook, Send,
  Globe, GitBranch, Figma, Server, CheckSquare, MessageSquare,
  Briefcase, Star, Rocket, Flame, ChevronRight
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const sendMsgMutation = useSendMessage({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message sent!", description: "I'll get back to you shortly." });
        setForm({ name: "", email: "", message: "" });
      },
      onError: () => toast({ title: "Error", description: "Failed to send message. Try again.", variant: "destructive" }),
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    sendMsgMutation.mutate({ data: form });
  };

  return (
    <div className="min-h-screen" style={{ background: "#06060f", color: "#ffffff" }}>
      <Navbar />

      {/* ───── HERO ───── */}
      <section id="hero" className="pt-16 pb-20 relative overflow-hidden">
        {/* subtle radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)" }} />

        {/* Large centered name */}
        <div className="text-center pt-8 pb-6">
          <h1 className="font-black leading-none tracking-tight select-none" style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)" }}>
            <span className="text-white">Bishal </span>
            <span style={{
              color: "#00d4ff",
              textShadow: "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4), 0 0 120px rgba(0,212,255,0.2)"
            }}>Bishwokarma</span>
          </h1>
        </div>

        {/* Two-column below */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mt-4">
          {/* Left */}
          <div>
            {/* Role badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-medium" style={{ borderColor: "#1e40af", background: "rgba(30,64,175,0.15)", color: "#93c5fd" }}>
              <span style={{ color: "#facc15" }}>✦</span>
              <span>IT Student · Web App Developer · Designer</span>
            </div>

            <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              I build{" "}
              <span style={{ color: "#00d4ff" }}>powerful</span>
              {" "}web apps &amp; digital solutions
            </h2>

            <p className="mb-8 leading-relaxed" style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              IT student creating practical, real-world applications that solve real problems. Based in{" "}
              <span style={{ color: "#38bdf8" }}>Kathmandu</span>,{" "}
              <span style={{ color: "#38bdf8" }}>Nepal</span>.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#projects">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
                  View Projects <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="#contact">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all hover:border-white/40" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#cbd5e1" }}>
                  Contact Me <MessageSquare className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>

          {/* Right — photo placeholder card */}
          <div className="flex justify-center">
            <div className="rounded-3xl flex items-center justify-center" style={{
              width: 280,
              height: 360,
              background: "linear-gradient(145deg, #1a1a3e 0%, #0f172a 40%, #1e1b4b 70%, #312e81 100%)",
              border: "1px solid rgba(99,102,241,0.3)",
              boxShadow: "0 0 60px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
            }}>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>Your Photo Here</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── ABOUT ───── */}
      <section id="about" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <PillBadge color="cyan">ABOUT ME</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-10">Who I Am</h2>

          <div className="rounded-2xl p-7 text-left" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ color: "#cbd5e1", lineHeight: 1.8, fontSize: "0.92rem" }}>
              I'm <strong className="text-white">Bishal Bishwokarma</strong>, an{" "}
              <span style={{ color: "#38bdf8" }}>IT student</span>{" "}
              from Kathmandu, Nepal and passionate about modern technology. I build apps, software, and designs that solve real problems. I bring both technical skills and communication ability to every project. My goal is to be a good and successful person by delivering value through technology.
            </p>
          </div>
        </div>
      </section>

      {/* ───── SKILLS ───── */}
      <section id="skills" className="py-20 scroll-mt-16" style={{ background: "#08081a" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <PillBadge color="cyan">MY ARSENAL</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2">Skills &amp; Tools</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10">Technologies and abilities I use to bring ideas to life.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Programming */}
            <SkillCard title="Programming" icon={<Code2 className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
              <div className="grid grid-cols-2 gap-2">
                <SkillItem icon="⊞" label="HTML / CSS" />
                <SkillItem icon=">_" label="Python" />
                <SkillItem icon="</>" label="C" />
                <SkillItem icon="▦" label="SQL" />
              </div>
            </SkillCard>

            {/* Tools & Platforms */}
            <SkillCard title="Tools & Platforms" icon={<Wrench className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
              <div className="grid grid-cols-2 gap-2">
                <SkillItem icon="⬡" label="Supabase" />
                <SkillItem icon="⊕" label="Git / GitHub" />
                <SkillItem icon="◈" label="Figma" />
                <SkillItem icon="▣" label="Canva" />
                <SkillItem icon="△" label="Vercel" />
              </div>
            </SkillCard>

            {/* Other Skills */}
            <SkillCard title="Other Skills" icon={<Lightbulb className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
              <div className="grid grid-cols-2 gap-2">
                <SkillItem icon="💡" label="Problem Solving" />
                <SkillItem icon="□" label="Communication" />
                <SkillItem icon="⊞" label="Project Management" />
                <SkillItem icon="★" label="Fast Learner" />
              </div>
            </SkillCard>
          </div>
        </div>
      </section>

      {/* ───── PROJECTS ───── */}
      <section id="projects" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <PillBadge color="green">PORTFOLIO</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2">Featured Projects</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10">Apps and tools from Bishal's Hub.</p>

          <div className="max-w-sm mx-auto rounded-2xl p-10 flex flex-col items-center" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
              🚀
            </div>
            <h3 className="text-lg font-bold mb-2">Apps Coming Soon</h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }} className="mb-6">
              New projects are being prepared. Sign in to explore Bishal's Hub when apps go live.
            </p>
            <Link href="/login">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
                Get Early Access <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── ECOSYSTEM BANNER ───── */}
      <section className="py-8" style={{ background: "#08081a" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4" style={{ color: "#fb923c" }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#94a3b8" }}>MY ECOSYSTEM</span>
              </div>
              <h3 className="text-2xl font-black mb-2">Bishal's Hub</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", maxWidth: 360 }}>
                A curated collection of my apps, tools, and digital creations. Sign in to explore the full ecosystem.
              </p>
            </div>
            <Link href="/login">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white whitespace-nowrap" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
                Enter the Hub <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── SERVICES ───── */}
      <section id="services" className="py-20 scroll-mt-16" style={{ background: "#08081a" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <PillBadge color="orange">FREELANCE</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2">What I Can Do For You</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10">Services tailored to your needs, delivered with quality.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <ServiceCard
              icon={<Monitor className="w-6 h-6" style={{ color: "#38bdf8" }} />}
              title="Web App Development"
              desc="Full-stack web applications built with modern frameworks. From idea to deployment."
              items={["Responsive Design", "Database Integration", "Authentication", "API Development"]}
            />
            <ServiceCard
              icon={<Smartphone className="w-6 h-6" style={{ color: "#38bdf8" }} />}
              title="Simple Software Solutions"
              desc="Custom software tools and utilities tailored to solve specific real-world problems."
              items={["Desktop Tools", "Automation Scripts", "Data Processing", "Utility Apps"]}
            />
            <ServiceCard
              icon={<Palette className="w-6 h-6" style={{ color: "#38bdf8" }} />}
              title="Designing"
              desc="Creative UI/UX design, graphics, and visual content that brings ideas to life beautifully."
              items={["UI/UX Design", "Graphic Design", "Logo & Branding", "Social Media Content"]}
            />
          </div>

          <a href="#contact">
            <button className="flex items-center gap-2 mx-auto px-8 py-3 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
              Let's Work Together <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </section>

      {/* ───── EDUCATION ───── */}
      <section id="education" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <PillBadge color="pink">BACKGROUND</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-14">My Education</h2>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />

            <div className="space-y-10">
              {/* Item 1 — Left */}
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <EduCard side="left" period="Upto SEE" title="School Education" school="Manakamana English Boarding School, Bhakunde, Lamjung" />
                </div>
                <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                <div className="flex-1" />
              </div>

              {/* Item 2 — Right */}
              <div className="flex items-center gap-6">
                <div className="flex-1" />
                <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                <div className="flex-1">
                  <EduCard side="right" period="2021-2023" title="+2 in Bio-Science" school="Prerana College, Bharatpur, Chitwan" />
                </div>
              </div>

              {/* Item 3 — Left */}
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <EduCard side="left" period="2023-Present" title="Bachelor in IT" school="Phoenix College of Management [Lincoln University], Maitidev, Kathmandu" />
                </div>
                <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                <div className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CONTACT ───── */}
      <section id="contact" className="py-20 scroll-mt-16" style={{ background: "#08081a" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <PillBadge color="cyan">GET IN TOUCH</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2">Contact</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10">Have an idea? Let's build it together.</p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Left — info */}
            <div className="space-y-3">
              <ContactInfoRow icon={<Mail className="w-4 h-4 text-white" />} label="EMAIL" value="bishalbishwokarma089@gmail.com" bg="#0d6e5c" />
              <ContactInfoRow icon={<Phone className="w-4 h-4 text-white" />} label="PHONE" value="9802485583" bg="#166534" />
              <ContactInfoRow icon={<MapPin className="w-4 h-4 text-white" />} label="LOCATION" value="Kathmandu, Nepal" bg="#4c1d95" />

              <div className="pt-2">
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#64748b" }}>CONNECT</p>
                <div className="space-y-2">
                  <SocialRow
                    icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "#1877f2" }}>f</div>}
                    name="Facebook"
                    handle="bishal.bishwokarma"
                  />
                  <SocialRow
                    icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: "#25d366" }}>✆</div>}
                    name="WhatsApp"
                    handle="9802485583"
                  />
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="rounded-2xl p-6" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>NAME</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                      style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>YOUR EMAIL</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                      style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>MESSAGE</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or idea..."
                    rows={5}
                    className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors resize-none"
                    style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendMsgMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}
                >
                  <Send className="w-4 h-4" />
                  {sendMsgMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Sub-components ── */

function PillBadge({ children, color }: { children: React.ReactNode; color: "cyan" | "green" | "orange" | "pink" }) {
  const styles = {
    cyan:   { border: "rgba(6,182,212,0.5)",  bg: "rgba(6,182,212,0.08)",  text: "#67e8f9" },
    green:  { border: "rgba(34,197,94,0.5)",  bg: "rgba(34,197,94,0.08)",  text: "#86efac" },
    orange: { border: "rgba(249,115,22,0.5)", bg: "rgba(249,115,22,0.08)", text: "#fdba74" },
    pink:   { border: "rgba(236,72,153,0.5)", bg: "rgba(236,72,153,0.08)", text: "#f9a8d4" },
  }[color];

  return (
    <div className="inline-flex">
      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ border: `1px solid ${styles.border}`, background: styles.bg, color: styles.text }}>
        {children}
      </span>
    </div>
  );
}

function SkillCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 text-left" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2.5 mb-4">
        {icon}
        <span className="font-bold text-sm">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SkillItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.05)" }}>
      <span className="text-xs" style={{ color: "#38bdf8" }}>{icon}</span>
      <span className="text-xs font-medium" style={{ color: "#cbd5e1" }}>{label}</span>
    </div>
  );
}

function ServiceCard({ icon, title, desc, items }: { icon: React.ReactNode; title: string; desc: string; items: string[] }) {
  return (
    <div className="rounded-2xl p-6 text-left" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "#131e3a", border: "1px solid rgba(56,189,248,0.2)" }}>
        {icon}
      </div>
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "#94a3b8" }}>
            <ChevronRight className="w-3 h-3" style={{ color: "#38bdf8" }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EduCard({ period, title, school, side }: { period: string; title: string; school: string; side: "left" | "right" }) {
  return (
    <div className={`rounded-xl p-4 text-left ${side === "right" ? "ml-0" : ""}`} style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs" style={{ color: "#64748b" }}>⊞</span>
        <span className="text-xs font-semibold" style={{ color: "#38bdf8" }}>{period}</span>
      </div>
      <p className="font-bold text-sm mb-1">{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{school}</p>
    </div>
  );
}

function ContactInfoRow({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "#64748b" }}>{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function SocialRow({ icon, name, handle }: { icon: React.ReactNode; name: string; handle: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      {icon}
      <div>
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs" style={{ color: "#64748b" }}>{handle}</p>
      </div>
    </div>
  );
}
