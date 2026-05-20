import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSendMessage, useListApps, useListProjects } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Code2, Wrench, Lightbulb, Mail, Phone, MapPin, ArrowRight,
  Send, Flame, ChevronRight, ExternalLink, Linkedin, Lock, Star
} from "lucide-react";

/* ── Default content (shown if DB table not yet set up) ── */
const DEFAULT = {
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

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const { data: apps = [] } = useListApps();
  const { data: projects = [] } = useListProjects();

  const { data: siteData = {} as any } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const r = await fetch("/api/content");
      if (!r.ok) return {};
      return r.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const sd = siteData as any;
  const hero     = { ...DEFAULT.hero,    ...(sd.hero    || {}) };
  const about    = { ...DEFAULT.about,   ...(sd.about   || {}) };
  const skills   = {
    programming: sd.skills?.programming?.length ? sd.skills.programming : DEFAULT.skills.programming,
    tools:       sd.skills?.tools?.length       ? sd.skills.tools       : DEFAULT.skills.tools,
    other:       sd.skills?.other?.length       ? sd.skills.other       : DEFAULT.skills.other,
  };
  const services  = sd.services?.length  ? sd.services  : DEFAULT.services;
  const contact   = { ...DEFAULT.contact, ...(sd.contact  || {}) };
  const education = sd.education?.length ? sd.education : DEFAULT.education;

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

  const handleAppClick = (e: React.MouseEvent, _app: any) => {
    if (!user) { e.preventDefault(); setLocation("/login"); }
  };

  return (
    <div className="min-h-screen" style={{ background: "#06060f", color: "#ffffff" }}>
      <Navbar />

      {/* ───── HERO ───── */}
      <section id="hero" className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)" }} />

        {/* Animated name */}
        <div className="text-center pt-8 pb-6 overflow-hidden animate-fade-in">
          <h1 className="font-black leading-none tracking-tight select-none" style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)" }}>
            <span className="text-white hero-name-first">Bishal</span>
            {" "}
            <span className="hero-name-last" style={{ color: "#00d4ff" }}>Bishwokarma</span>
          </h1>
        </div>

        {/* Two-column content */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mt-4">
          {/* Left — text */}
          <div className="animate-slide-left">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-medium" style={{ borderColor: "#1e40af", background: "rgba(30,64,175,0.15)", color: "#93c5fd" }}>
              <span style={{ color: "#facc15" }}>✦</span>
              <span>{hero.badge}</span>
            </div>

            <h2 className="font-black leading-tight mb-4 animate-fade-in-up delay-100" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              {hero.title.split("powerful").map((part: string, i: number) =>
                i === 0
                  ? <span key={i}>{part}<span style={{ color: "#00d4ff" }}>powerful</span></span>
                  : <span key={i}>{part}</span>
              )}
            </h2>

            <p className="mb-8 leading-relaxed animate-fade-in-up delay-200" style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              {hero.bio}
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300">
              <a href="#projects">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
                  View Projects <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="#contact">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all hover:border-white/40" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#cbd5e1" }}>
                  Contact Me <Send className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>

          {/* Right — profile photo */}
          <div className="flex justify-center animate-slide-right order-first md:order-last">
            <div className="relative w-full" style={{ maxWidth: 380, height: "clamp(280px, 55vw, 500px)" }}>
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,212,255,0.55) 0%, transparent 70%)", transform: "scale(0.9) translateY(12px)" }} />
              <img
                src="/bishal-photo-nobg.png"
                alt="Bishal Bishwokarma"
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center bottom", filter: "drop-shadow(0 0 22px rgba(0,212,255,0.65)) drop-shadow(0 0 55px rgba(0,212,255,0.3))", position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── ABOUT ───── */}
      <section id="about" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <PillBadge color="cyan">ABOUT ME</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-10 animate-fade-in-up">Who I Am</h2>
          <div className="rounded-2xl p-7 text-left animate-fade-in-up delay-200" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ color: "#cbd5e1", lineHeight: 1.8, fontSize: "0.92rem" }}>
              {about.text.split("Bishal Bishwokarma").map((part: string, i: number) =>
                i === 0
                  ? <span key={i}>{part}<strong className="text-white">Bishal Bishwokarma</strong></span>
                  : <span key={i}>{part.split("IT student").map((p2: string, j: number) =>
                      j === 0 ? <span key={j}>{p2}<span style={{ color: "#38bdf8" }}>IT student</span></span> : <span key={j}>{p2}</span>
                    )}</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ───── SKILLS ───── */}
      <section id="skills" className="py-20 scroll-mt-16" style={{ background: "#08081a" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <PillBadge color="cyan">MY ARSENAL</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">Skills &amp; Tools</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10 animate-fade-in-up delay-100">Technologies and abilities I use to bring ideas to life.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="animate-fade-in-up delay-100">
              <SkillCard title="Programming" icon={<Code2 className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  {skills.programming.map((item: any, i: number) => <SkillItem key={i} icon={item.icon} label={item.label} />)}
                </div>
              </SkillCard>
            </div>
            <div className="animate-fade-in-up delay-200">
              <SkillCard title="Tools & Platforms" icon={<Wrench className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  {skills.tools.map((item: any, i: number) => <SkillItem key={i} icon={item.icon} label={item.label} />)}
                </div>
              </SkillCard>
            </div>
            <div className="animate-fade-in-up delay-300">
              <SkillCard title="Other Skills" icon={<Lightbulb className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  {skills.other.map((item: any, i: number) => <SkillItem key={i} icon={item.icon} label={item.label} />)}
                </div>
              </SkillCard>
            </div>
          </div>
        </div>
      </section>

      {/* ───── MY PROJECTS (apps from admin) ───── */}
      <section id="projects" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <PillBadge color="green">PORTFOLIO</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">My Projects</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10 animate-fade-in-up delay-100">Apps and tools I've built. Sign in to open them.</p>

          {apps.length === 0 ? (
            <div className="max-w-sm mx-auto rounded-2xl p-10 flex flex-col items-center animate-fade-in" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>🚀</div>
              <h3 className="text-lg font-bold mb-2">Apps Coming Soon</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }} className="mb-6">New projects are being prepared. Sign in to explore Bishal's Hub when apps go live.</p>
              <Link href="/login">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
                  Get Early Access <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {apps.map((app: any, i: number) => (
                <a key={app.id} href={user ? (app.url || "#") : "#"} target={user ? "_blank" : "_self"} rel="noreferrer" onClick={(e) => handleAppClick(e, app)} className="group" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all cursor-pointer h-full animate-fade-in-up" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => (e.currentTarget.style.border = "1px solid rgba(0,212,255,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                      {app.icon_url ? <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" /> : <Flame className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{app.name}</p>
                      {app.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: "#64748b" }}>{app.description}</p>}
                    </div>
                    {!user && <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><Lock className="w-3 h-3" /> Sign in to open</div>}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───── LATEST WORKING PROJECT ───── */}
      {projects.length > 0 && (
        <section id="latest-projects" className="py-20 scroll-mt-16" style={{ background: "#08081a" }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <PillBadge color="orange">WORK IN PROGRESS</PillBadge>
            <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">Latest Working Project</h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-12 animate-fade-in-up delay-100">A glimpse into what I'm currently building.</p>
            <div className="space-y-14">
              {projects.map((proj: any, pi: number) => (
                <div key={proj.id} className="animate-fade-in-up" style={{ animationDelay: `${pi * 0.15}s` }}>
                  {proj.images && proj.images.length > 0 && (
                    <div className="relative rounded-2xl overflow-hidden p-6 mb-6" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className={`grid gap-3 ${proj.images.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : proj.images.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
                        {proj.images.slice(0, 3).map((img: string, idx: number) => (
                          <div key={idx} className="rounded-xl overflow-hidden relative group" style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", aspectRatio: "4/3" }}>
                            <img src={img} alt={`${proj.title} screenshot ${idx + 1}`} className="w-full h-full object-cover object-top" />
                            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-white">{proj.title}</h3>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase ${proj.status === "completed" ? "bg-green-500/15 text-green-400 border border-green-500/20" : proj.status === "archived" ? "bg-gray-500/15 text-gray-400 border border-gray-500/20" : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>
                          {proj.status === "in-progress" ? "In Progress" : proj.status}
                        </span>
                      </div>
                      {proj.description && <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 480 }}>{proj.description}</p>}
                      {proj.tech_stack && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {proj.tech_stack.split(",").map((t: string) => (
                            <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}>{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {proj.link_url && (
                      <a href={proj.link_url} target="_blank" rel="noreferrer">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm whitespace-nowrap" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
                          View Project <ExternalLink className="w-4 h-4" />
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── SERVICES & PRICING ───── */}
      <section id="services" className="py-24 scroll-mt-16 relative overflow-hidden" style={{ background: projects.length > 0 ? "#06060f" : "#08081a" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, #7c3aed 0%, #2563eb 50%, transparent 80%)" }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <PillBadge color="orange">FREELANCE</PillBadge>
            <h2 className="text-4xl font-black mt-4 mb-3 animate-fade-in-up">Services &amp; Pricing</h2>
            <p className="animate-fade-in-up delay-100" style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Professional digital solutions designed to elevate your business</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full animate-fade-in-up delay-200" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)" }}>
              <Star className="w-3.5 h-3.5" style={{ color: "#facc15" }} />
              <span className="text-xs font-medium" style={{ color: "#93c5fd" }}>Flexible pricing based on project complexity and requirements</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {services.map((card: any, i: number) => (
              <PricingCard
                key={i}
                icon={card.icon}
                title={card.title}
                price={card.price}
                description={card.description}
                tag={card.tag || undefined}
                tagColor={card.tagColor || undefined}
                featured={card.featured}
                delay={`delay-${(i + 1) * 50}`}
              />
            ))}
          </div>
          <p className="text-center text-xs animate-fade-in-up" style={{ color: "#475569" }}>* Final pricing may vary depending on features, complexity and customization level.</p>
        </div>
      </section>

      {/* ───── EDUCATION ───── */}
      <section id="education" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <PillBadge color="pink">BACKGROUND</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-10 sm:mb-14 animate-fade-in-up">My Education</h2>

          {/* Mobile: simple vertical list */}
          <div className="flex flex-col gap-4 sm:hidden">
            {education.map((item: any, i: number) => (
              <div key={i} className="flex gap-3 text-left">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                  {i < education.length - 1 && <div className="flex-1 w-px mt-1" style={{ background: "rgba(255,255,255,0.1)" }} />}
                </div>
                <div className="pb-4 flex-1">
                  <div className="rounded-xl p-4" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-xs font-semibold" style={{ color: "#38bdf8" }}>{item.period}</span>
                    <p className="font-bold text-sm mt-1 mb-1">{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{item.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: alternating timeline */}
          <div className="relative hidden sm:block">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="space-y-10">
              {education.map((item: any, i: number) => (
                <div key={i} className={`flex items-center gap-6 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? "animate-slide-right" : "animate-slide-left"}`}>
                    <EduCard side={i % 2 === 0 ? "left" : "right"} period={item.period} title={item.title} school={item.school} />
                  </div>
                  <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── CONTACT ───── */}
      <section id="contact" className="py-20 scroll-mt-16" style={{ background: "#08081a" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <PillBadge color="cyan">GET IN TOUCH</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">Contact</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10 animate-fade-in-up delay-100">Have an idea? Let's build it together.</p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Left — info */}
            <div className="space-y-3 animate-slide-left">
              <ContactInfoRow icon={<Mail className="w-4 h-4 text-white" />} label="EMAIL" value={contact.email} bg="#0d6e5c" />
              <ContactInfoRow icon={<Phone className="w-4 h-4 text-white" />} label="PHONE" value={contact.phone} bg="#166534" />
              <ContactInfoRow icon={<MapPin className="w-4 h-4 text-white" />} label="LOCATION" value={contact.location} bg="#4c1d95" />
              <div className="pt-2">
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#64748b" }}>CONNECT</p>
                <div className="space-y-2">
                  {contact.facebook && (
                    <a href={contact.facebook} target="_blank" rel="noreferrer" className="block">
                      <SocialRow icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "#1877f2" }}>f</div>} name="Facebook" handle={contact.facebook.split("facebook.com/")[1] || "Facebook"} />
                    </a>
                  )}
                  {contact.whatsapp && (
                    <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="block">
                      <SocialRow icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: "#25d366" }}>✆</div>} name="WhatsApp" handle={contact.whatsapp} />
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noreferrer" className="block">
                      <SocialRow icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: "#0a66c2" }}><Linkedin className="w-4 h-4" /></div>} name="LinkedIn" handle={contact.linkedin.split("linkedin.com/in/")[1] || "LinkedIn"} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="rounded-2xl p-6 animate-slide-right" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>NAME</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors" style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>YOUR EMAIL</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors" style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#94a3b8" }}>MESSAGE</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project or idea..." rows={5} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors resize-none" style={{ background: "#131329", border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                </div>
                <button type="submit" disabled={sendMsgMutation.isPending} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-60" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
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
      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ border: `1px solid ${styles.border}`, background: styles.bg, color: styles.text }}>{children}</span>
    </div>
  );
}

function SkillCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 text-left" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2.5 mb-4">{icon}<span className="font-bold text-sm">{title}</span></div>
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

function PricingCard({ icon, title, price, description, tag, tagColor, featured, delay }: {
  icon: string; title: string; price: string; description: string;
  tag?: string; tagColor?: "green" | "blue" | "purple"; featured?: boolean; delay?: string;
}) {
  const tagStyles = {
    green:  { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.4)",  text: "#86efac" },
    blue:   { bg: "rgba(59,130,246,0.2)",  border: "rgba(59,130,246,0.6)",  text: "#93c5fd" },
    purple: { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", text: "#c4b5fd" },
  };
  const ts = tag && tagColor && tagStyles[tagColor as keyof typeof tagStyles] ? tagStyles[tagColor as keyof typeof tagStyles] : null;
  return (
    <div className={`relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 group animate-fade-in-up ${delay || ""}`}
      style={{ background: featured ? "linear-gradient(135deg, rgba(30,64,175,0.25) 0%, rgba(124,58,237,0.15) 100%)" : "rgba(13,13,31,0.8)", border: featured ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", boxShadow: featured ? "0 0 30px rgba(99,102,241,0.15), inset 0 0 30px rgba(99,102,241,0.03)" : "none" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.border = featured ? "1px solid rgba(99,102,241,0.8)" : "1px solid rgba(56,189,248,0.25)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.border = featured ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)"; }}
    >
      {featured && <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(59,130,246,0.8), transparent)" }} />}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>{icon}</div>
        {tag && ts && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase" style={{ background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text }}>{tag}</span>}
      </div>
      <div>
        <h3 className="font-bold text-base mb-1 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{description}</p>
      </div>
      <div className="mt-auto pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="font-black text-lg mb-3" style={{ color: featured ? "#a5b4fc" : "#38bdf8" }}>{price}</p>
        <a href="https://wa.me/9779802485583" target="_blank" rel="noreferrer" className="block">
          <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: featured ? "linear-gradient(90deg, #6366f1, #8b5cf6)" : "rgba(56,189,248,0.1)", color: featured ? "#fff" : "#38bdf8", border: featured ? "none" : "1px solid rgba(56,189,248,0.25)" }}>
            Hire Me →
          </button>
        </a>
      </div>
    </div>
  );
}

function EduCard({ period, title, school, side }: { period: string; title: string; school: string; side: "left" | "right" }) {
  return (
    <div className={`rounded-xl p-4 text-left ${side === "right" ? "ml-0" : ""}`} style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 mb-1"><span className="text-xs" style={{ color: "#64748b" }}>⊞</span><span className="text-xs font-semibold" style={{ color: "#38bdf8" }}>{period}</span></div>
      <p className="font-bold text-sm mb-1">{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{school}</p>
    </div>
  );
}

function ContactInfoRow({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>{icon}</div>
      <div><p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "#64748b" }}>{label}</p><p className="text-sm font-medium text-white break-all">{value}</p></div>
    </div>
  );
}

function SocialRow({ icon, name, handle }: { icon: React.ReactNode; name: string; handle: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      {icon}
      <div><p className="text-xs font-semibold text-white">{name}</p><p className="text-[10px]" style={{ color: "#64748b" }}>{handle}</p></div>
      <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: "#38bdf8" }} />
    </div>
  );
}
