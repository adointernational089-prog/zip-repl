import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSendMessage, useListApps, useListProjects } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Code2, Wrench, Lightbulb, Monitor, Smartphone, Palette,
  Mail, Phone, MapPin, ArrowRight, Facebook, Send,
  Globe, GitBranch, Figma, Server, CheckSquare, MessageSquare,
  Briefcase, Star, Rocket, Flame, ChevronRight, ExternalLink,
  Linkedin, Lock
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const { data: apps = [] } = useListApps();
  const { data: projects = [] } = useListProjects();

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

  const handleAppClick = (e: React.MouseEvent, app: any) => {
    if (!user) {
      e.preventDefault();
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#06060f", color: "#ffffff" }}>
      <Navbar />

      {/* ───── HERO ───── */}
      <section id="hero" className="pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)" }} />

        {/* Large centered name */}
        <div className="text-center pt-8 pb-6 animate-fade-in">
          <h1 className="font-black leading-none tracking-tight select-none animate-glow-pulse" style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)" }}>
            <span className="text-white">Bishal </span>
            <span style={{ color: "#00d4ff" }}>Bishwokarma</span>
          </h1>
        </div>

        {/* Two-column below */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mt-4">
          {/* Left */}
          <div className="animate-slide-left">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-medium" style={{ borderColor: "#1e40af", background: "rgba(30,64,175,0.15)", color: "#93c5fd" }}>
              <span style={{ color: "#facc15" }}>✦</span>
              <span>IT Student · Web App Developer · Designer</span>
            </div>

            <h2 className="font-black leading-tight mb-4 animate-fade-in-up delay-100" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              I build{" "}
              <span style={{ color: "#00d4ff" }}>powerful</span>
              {" "}web apps &amp; digital solutions
            </h2>

            <p className="mb-8 leading-relaxed animate-fade-in-up delay-200" style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              IT student creating practical, real-world applications that solve real problems. Based in{" "}
              <span style={{ color: "#38bdf8" }}>Kathmandu</span>,{" "}
              <span style={{ color: "#38bdf8" }}>Nepal</span>.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300">
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

          {/* Right — profile photo with glow */}
          <div className="flex justify-center animate-slide-right">
            <div className="relative" style={{ width: 320, height: 420 }}>
              {/* Glow backdrop */}
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,212,255,0.5) 0%, transparent 70%)", transform: "scale(0.9) translateY(10px)" }} />
              <img
                src="/bishal-photo-nobg.png"
                alt="Bishal Bishwokarma"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  filter: "drop-shadow(0 0 18px rgba(0,212,255,0.55)) drop-shadow(0 0 40px rgba(0,212,255,0.25))",
                  position: "relative",
                  zIndex: 1,
                }}
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
          <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">Skills &amp; Tools</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10 animate-fade-in-up delay-100">Technologies and abilities I use to bring ideas to life.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="animate-fade-in-up delay-100">
              <SkillCard title="Programming" icon={<Code2 className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  <SkillItem icon="⊞" label="HTML / CSS" />
                  <SkillItem icon=">_" label="Python" />
                  <SkillItem icon="</>" label="C" />
                  <SkillItem icon="▦" label="SQL" />
                </div>
              </SkillCard>
            </div>
            <div className="animate-fade-in-up delay-200">
              <SkillCard title="Tools & Platforms" icon={<Wrench className="w-5 h-5" style={{ color: "#38bdf8" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  <SkillItem icon="⬡" label="Supabase" />
                  <SkillItem icon="⊕" label="Git / GitHub" />
                  <SkillItem icon="◈" label="Figma" />
                  <SkillItem icon="▣" label="Canva" />
                  <SkillItem icon="△" label="Vercel" />
                </div>
              </SkillCard>
            </div>
            <div className="animate-fade-in-up delay-300">
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {apps.map((app: any, i: number) => (
                <a
                  key={app.id}
                  href={user ? (app.url || "#") : "#"}
                  target={user ? "_blank" : "_self"}
                  rel="noreferrer"
                  onClick={(e) => handleAppClick(e, app)}
                  className="group"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all cursor-pointer h-full animate-fade-in-up"
                    style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => (e.currentTarget.style.border = "1px solid rgba(0,212,255,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                      ) : (
                        <Flame className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{app.name}</p>
                      {app.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: "#64748b" }}>{app.description}</p>}
                    </div>
                    {!user && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Lock className="w-3 h-3" /> Sign in to open
                      </div>
                    )}
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
                  {/* Screenshots row — like reference image */}
                  {proj.images && proj.images.length > 0 && (
                    <div className="relative rounded-2xl overflow-hidden p-6 mb-6" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className={`grid gap-3 ${proj.images.length === 1 ? "grid-cols-1 max-w-lg mx-auto" : proj.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                        {proj.images.slice(0, 3).map((img: string, idx: number) => (
                          <div key={idx} className="rounded-xl overflow-hidden relative group" style={{
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                            aspectRatio: "4/3"
                          }}>
                            <img
                              src={img}
                              alt={`${proj.title} screenshot ${idx + 1}`}
                              className="w-full h-full object-cover object-top"
                            />
                            {/* Screen glare overlay */}
                            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-white">{proj.title}</h3>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase ${
                          proj.status === "completed" ? "bg-green-500/15 text-green-400 border border-green-500/20" :
                          proj.status === "archived"  ? "bg-gray-500/15 text-gray-400 border border-gray-500/20" :
                          "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                        }`}>{proj.status === "in-progress" ? "In Progress" : proj.status}</span>
                      </div>
                      {proj.description && (
                        <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: 480 }}>{proj.description}</p>
                      )}
                      {proj.tech_stack && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {proj.tech_stack.split(",").map((t: string) => (
                            <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}>
                              {t.trim()}
                            </span>
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

      {/* ───── SERVICES ───── */}
      <section id="services" className="py-20 scroll-mt-16" style={{ background: projects.length > 0 ? "#06060f" : "#08081a" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <PillBadge color="orange">FREELANCE</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">What I Can Do For You</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10 animate-fade-in-up delay-100">Services tailored to your needs, delivered with quality.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <div className="animate-fade-in-up delay-100">
              <ServiceCard
                icon={<Monitor className="w-6 h-6" style={{ color: "#38bdf8" }} />}
                title="Web App Development"
                desc="Full-stack web applications built with modern frameworks. From idea to deployment."
                items={["Responsive Design", "Database Integration", "Authentication", "API Development"]}
              />
            </div>
            <div className="animate-fade-in-up delay-200">
              <ServiceCard
                icon={<Smartphone className="w-6 h-6" style={{ color: "#38bdf8" }} />}
                title="Simple Software Solutions"
                desc="Custom software tools and utilities tailored to solve specific real-world problems."
                items={["Desktop Tools", "Automation Scripts", "Data Processing", "Utility Apps"]}
              />
            </div>
            <div className="animate-fade-in-up delay-300">
              <ServiceCard
                icon={<Palette className="w-6 h-6" style={{ color: "#38bdf8" }} />}
                title="Designing"
                desc="Creative UI/UX design, graphics, and visual content that brings ideas to life beautifully."
                items={["UI/UX Design", "Graphic Design", "Logo & Branding", "Social Media Content"]}
              />
            </div>
          </div>

          <a href="#contact">
            <button className="flex items-center gap-2 mx-auto px-8 py-3 rounded-lg font-semibold text-white animate-fade-in-up delay-400" style={{ background: "linear-gradient(90deg, #0ea5e9, #2563eb)" }}>
              Let's Work Together <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </div>
      </section>

      {/* ───── EDUCATION ───── */}
      <section id="education" className="py-20 scroll-mt-16" style={{ background: "#06060f" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <PillBadge color="pink">BACKGROUND</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-14 animate-fade-in-up">My Education</h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />

            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="flex-1 animate-slide-left">
                  <EduCard side="left" period="Upto SEE" title="School Education" school="Manakamana English Boarding School, Bhakunde, Lamjung" />
                </div>
                <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                <div className="flex-1" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1" />
                <div className="w-3 h-3 rounded-full flex-shrink-0 z-10" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
                <div className="flex-1 animate-slide-right">
                  <EduCard side="right" period="2021-2023" title="+2 in Bio-Science" school="Prerana College, Bharatpur, Chitwan" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 animate-slide-left">
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
          <h2 className="text-3xl font-black mt-4 mb-2 animate-fade-in-up">Contact</h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }} className="mb-10 animate-fade-in-up delay-100">Have an idea? Let's build it together.</p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Left — info */}
            <div className="space-y-3 animate-slide-left">
              <ContactInfoRow icon={<Mail className="w-4 h-4 text-white" />} label="EMAIL" value="bishalbishwokarma089@gmail.com" bg="#0d6e5c" />
              <ContactInfoRow icon={<Phone className="w-4 h-4 text-white" />} label="PHONE" value="9802485583" bg="#166534" />
              <ContactInfoRow icon={<MapPin className="w-4 h-4 text-white" />} label="LOCATION" value="Kathmandu, Nepal" bg="#4c1d95" />

              <div className="pt-2">
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#64748b" }}>CONNECT</p>
                <div className="space-y-2">
                  <a href="https://www.facebook.com/bishal.bishwokarma.359" target="_blank" rel="noreferrer" className="block">
                    <SocialRow
                      icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: "#1877f2" }}>f</div>}
                      name="Facebook"
                      handle="bishal.bishwokarma"
                    />
                  </a>
                  <SocialRow
                    icon={<div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm" style={{ background: "#25d366" }}>✆</div>}
                    name="WhatsApp"
                    handle="9802485583"
                  />
                  <a href="https://www.linkedin.com/in/bishal-bishwokarma-453608277" target="_blank" rel="noreferrer" className="block">
                    <SocialRow
                      icon={
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: "#0a66c2" }}>
                          <Linkedin className="w-4 h-4" />
                        </div>
                      }
                      name="LinkedIn"
                      handle="bishal-bishwokarma"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="rounded-2xl p-6 animate-slide-right" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
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
    <div className="rounded-2xl p-6 text-left h-full" style={{ background: "#0d0d1f", border: "1px solid rgba(255,255,255,0.08)" }}>
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
    <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      {icon}
      <div>
        <p className="text-xs font-semibold text-white">{name}</p>
        <p className="text-[10px]" style={{ color: "#64748b" }}>{handle}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: "#38bdf8" }} />
    </div>
  );
}
