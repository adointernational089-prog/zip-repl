import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReactionBar } from "@/components/ReactionBar";
import { useSendMessage, useListApps, useListProjects } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Code2, Wrench, Lightbulb, Mail, Phone, MapPin, ArrowRight,
  Send, Flame, ChevronRight, ExternalLink, Linkedin, Lock, Star,
  GraduationCap, BookOpen, Award
} from "lucide-react";

/* ── Default content ── */
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
    { period: "Upto SEE", title: "School Education", school: "Manakamana English Boarding School, Bhakunde, Lamjung", icon: "🏫" },
    { period: "2021-2023", title: "+2 in Bio-Science", school: "Prerana College, Bharatpur, Chitwan", icon: "🔬" },
    { period: "2023-Present", title: "Bachelor in IT", school: "Phoenix College of Management [Lincoln University], Maitidev, Kathmandu", icon: "💻" },
  ],
  projects: [
    {
      id: "default-1",
      title: "Bishal's Hub — Portfolio & SaaS Portal",
      description: "A full personal portfolio and SaaS hub featuring dark neon design, user authentication, an admin panel, app management, and real-time messaging.",
      images: [] as string[],
      tech_stack: "React, TypeScript, Express.js, PostgreSQL, Tailwind CSS",
      link_url: "",
      status: "in-progress",
      sort_order: 0,
    },
    {
      id: "default-2",
      title: "More Projects Being Documented",
      description: "Additional projects are being prepared and will be showcased here with screenshots, tech details, and live links. Stay tuned!",
      images: [] as string[],
      tech_stack: "",
      link_url: "",
      status: "upcoming",
      sort_order: 1,
    },
  ],
};

/* ── Typewriter name component ── */
const TypewriterName = memo(function TypewriterName() {
  const FIRST = "Bishal";
  const LAST = "Bishwokarma";
  const TYPE_SPEED = 90;
  const ERASE_SPEED = 55;
  const PAUSE_MS = 2400;

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [cursor, setCursor] = useState(true);
  const [phase, setPhase] = useState<"typeFirst" | "typeLast" | "pause" | "eraseLast" | "eraseFirst">("typeFirst");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typeFirst") {
      if (first.length < FIRST.length) {
        t = setTimeout(() => setFirst(FIRST.slice(0, first.length + 1)), TYPE_SPEED);
      } else {
        t = setTimeout(() => setPhase("typeLast"), 280);
      }
    } else if (phase === "typeLast") {
      if (last.length < LAST.length) {
        t = setTimeout(() => setLast(LAST.slice(0, last.length + 1)), TYPE_SPEED);
      } else {
        t = setTimeout(() => setPhase("pause"), 280);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("eraseLast"), PAUSE_MS);
    } else if (phase === "eraseLast") {
      if (last.length > 0) {
        t = setTimeout(() => setLast(last.slice(0, -1)), ERASE_SPEED);
      } else {
        t = setTimeout(() => setPhase("eraseFirst"), 120);
      }
    } else if (phase === "eraseFirst") {
      if (first.length > 0) {
        t = setTimeout(() => setFirst(first.slice(0, -1)), ERASE_SPEED);
      } else {
        t = setTimeout(() => setPhase("typeFirst"), 350);
      }
    }
    return () => clearTimeout(t);
  }, [phase, first, last]);

  useEffect(() => {
    const interval = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  const isTypingFirst = phase === "typeFirst";
  const isTypingLast = phase === "typeLast";
  const isErasing = phase === "eraseLast" || phase === "eraseFirst";

  return (
    <div className="text-center pt-10 pb-6 overflow-hidden">
      <h1
        className="font-black leading-none tracking-tight select-none"
        style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
        aria-label="Bishal Bishwokarma"
      >
        <span
          className="text-foreground inline-block transition-all duration-100"
          style={{
            minWidth: "1ch",
            textShadow: isTypingFirst ? "0 0 30px hsl(var(--foreground) / 0.3)" : undefined,
          }}
        >
          {first}
        </span>
        {first.length > 0 && <span className="text-foreground"> </span>}
        <span
          className="inline-block transition-all duration-100"
          style={{
            color: "hsl(var(--primary))",
            minWidth: "1ch",
            filter: isTypingLast ? `drop-shadow(0 0 20px hsl(var(--primary) / 0.7))` : `drop-shadow(0 0 10px hsl(var(--primary) / 0.4))`,
          }}
        >
          {last}
        </span>
        <span
          style={{
            color: "hsl(var(--primary))",
            opacity: cursor ? 1 : 0,
            transition: "opacity 0.1s",
            fontWeight: 100,
          }}
        >
          |
        </span>
        {isErasing && (
          <span
            className="ml-2 text-xs font-normal align-middle"
            style={{ color: "hsl(var(--primary) / 0.4)", fontSize: "clamp(0.6rem, 1.5vw, 0.9rem)" }}
          >
            &#x2588;
          </span>
        )}
      </h1>
    </div>
  );
});

/* ── Inline SVG Scorpion (top-down, faces right, 8 animated legs) ── */
const _PC  = "hsl(var(--primary) / 0.13)";
const _PS  = "hsl(var(--primary) / 0.88)";
const _LS  = "hsl(var(--primary) / 0.78)";
const _FF  = "hsl(var(--primary))";

const _SCORP_LEGS = [
  { ax: 87, ay: 27, ph: "a", top: true  },
  { ax: 79, ay: 26, ph: "b", top: true  },
  { ax: 71, ay: 26, ph: "a", top: true  },
  { ax: 63, ay: 27, ph: "b", top: true  },
  { ax: 87, ay: 49, ph: "b", top: false },
  { ax: 79, ay: 50, ph: "a", top: false },
  { ax: 71, ay: 50, ph: "b", top: false },
  { ax: 63, ay: 49, ph: "a", top: false },
] as const;

const ScorpionSVG = memo(function ScorpionSVG() {
  return (
    <svg
      viewBox="0 0 135 82"
      width="104"
      height="63"
      aria-hidden
      className="scorpion-body"
      style={{ overflow: "visible" }}
    >
      {/* ── Tail (metasoma, 5 segments + stinger) ── */}
      <circle cx="8"  cy="34" r="5.2" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <circle cx="5"  cy="27" r="4.7" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <circle cx="4"  cy="20" r="4.2" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <circle cx="6"  cy="13" r="3.7" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <circle cx="11" cy="7"  r="3.2" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <path d="M 11 7 Q 17 3 21 0"        stroke={_PS} strokeWidth="2"   fill="none" strokeLinecap="round" />
      <path d="M 21 0 L 24 -2"            stroke={_PS} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* ── Abdomen segments (5, left → right, growing) ── */}
      <ellipse cx="14" cy="38" rx="7"  ry="5.5" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <ellipse cx="24" cy="38" rx="8"  ry="6.5" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <ellipse cx="35" cy="38" rx="9"  ry="7.5" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <ellipse cx="48" cy="38" rx="10" ry="8.5" fill={_PC} stroke={_PS} strokeWidth="1.2" />
      <ellipse cx="63" cy="38" rx="13" ry="10"  fill={_PC} stroke={_PS} strokeWidth="1.2" />

      {/* ── Cephalothorax (carapace) ── */}
      <ellipse cx="85" cy="38" rx="20" ry="13" fill={_PC} stroke={_PS} strokeWidth="1.4" />
      <line x1="73" y1="33" x2="97" y2="33" stroke={_PS} strokeWidth="0.5" opacity="0.38" />
      <line x1="73" y1="43" x2="97" y2="43" stroke={_PS} strokeWidth="0.5" opacity="0.38" />
      {/* Eyes */}
      <circle cx="96" cy="33" r="1.8" fill={_FF} opacity="0.92" />
      <circle cx="96" cy="43" r="1.8" fill={_FF} opacity="0.92" />

      {/* ── Pincers (chelae) ── */}
      <line x1="103" y1="33" x2="115" y2="24" stroke={_PS} strokeWidth="2"   strokeLinecap="round" />
      <line x1="115" y1="24" x2="123" y2="19" stroke={_PS} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 123 19 L 128 16 M 123 19 L 127 23" stroke={_PS} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <line x1="103" y1="43" x2="115" y2="52" stroke={_PS} strokeWidth="2"   strokeLinecap="round" />
      <line x1="115" y1="52" x2="123" y2="57" stroke={_PS} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 123 57 L 128 60 M 123 57 L 126 53" stroke={_PS} strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* ── Legs (8 total — 4 pairs, all rotate around attachment point) ── */}
      {_SCORP_LEGS.map((leg, i) => {
        const uy = leg.top ? -9  : 9;
        const ly = leg.top ? -19 : 19;
        return (
          <g key={i} style={{ transform: `translate(${leg.ax}px, ${leg.ay}px)` }}>
            <g className={`scorp-leg scorp-leg-${leg.ph}`} style={{ transformOrigin: `${leg.ax}px ${leg.ay}px` }}>
              <line x1="0" y1="0"   x2="3"   y2={uy}  stroke={_LS} strokeWidth="1.7" strokeLinecap="round" />
              <line x1="3" y1={uy}  x2="1"   y2={ly}  stroke={_LS} strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="1" cy={ly} r="1.9" fill={_FF} opacity="0.75" />
            </g>
          </g>
        );
      })}
    </svg>
  );
});

const WalkingScorpion = memo(function WalkingScorpion({
  containerRef,
  initialTop,
  flipX,
  opacity,
}: {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  initialTop: number;
  flipX: boolean;
  opacity: number;
}) {
  return (
    <div
      ref={containerRef}
      className="scorpion-container fixed pointer-events-none z-[48]"
      data-state="idle"
      style={{
        top: initialTop,
        [flipX ? "right" : "left"]: "8px",
        opacity,
        willChange: "top",
        transition: "top 0.08s linear",
      }}
    >
      <div className="scorpion-lean">
        <div style={{ transform: flipX ? "scaleX(-1)" : undefined }}>
          <ScorpionSVG />
        </div>
      </div>
    </div>
  );
});

/* ── Scroll Scorpions — follow scroll, direct DOM for perf ── */
const ScrollScorpions = memo(function ScrollScorpions() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftPosRef = useRef(160);
  const rightPosRef = useRef(320);
  const lastScrollRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const setState = (el: HTMLDivElement | null, s: string) => { if (el) el.dataset.state = s; };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollRef.current;
      lastScrollRef.current = y;
      const vh = window.innerHeight;

      const dir = delta > 0 ? "walking-down" : "walking-up";
      setState(leftRef.current, dir);
      setState(rightRef.current, dir);

      leftPosRef.current  = Math.max(50, Math.min(vh - 140, leftPosRef.current  + delta * 0.78));
      rightPosRef.current = Math.max(50, Math.min(vh - 140, rightPosRef.current + delta * 0.69));

      if (leftRef.current)  leftRef.current.style.top  = leftPosRef.current  + "px";
      if (rightRef.current) rightRef.current.style.top = rightPosRef.current + "px";

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setState(leftRef.current,  "idle");
        setState(rightRef.current, "idle");
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <>
      <WalkingScorpion containerRef={leftRef}  initialTop={160} flipX={false} opacity={0.30} />
      <WalkingScorpion containerRef={rightRef} initialTop={320} flipX={true}  opacity={0.24} />
    </>
  );
});

/* ── Visitor tracking (silent — no UI; stats visible in admin panel only) ── */
const _BASE_V = (import.meta.env.BASE_URL ?? "").replace(/\/$/, "");

function useTrackVisit() {
  useEffect(() => {
    const KEY = "bhub_sid";
    let sid = localStorage.getItem(KEY);
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(KEY, sid);
    }
    fetch(`${_BASE_V}/api/visitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid, path: "/" }),
    }).catch(() => {});
  }, []);
}

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  useEffect(() => {
    const CLASSES = ["reveal", "reveal-left", "reveal-right", "reveal-scale", "edu-card-reveal"];
    const SELECTOR = CLASSES.map((c) => `.${c}`).join(", ");

    const revealIfVisible = (el: Element) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 60) el.classList.add("revealed");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0, rootMargin: "0px 0px 60px 0px" }
    );

    const observe = (el: Element) => {
      if (!el.classList.contains("revealed")) observer.observe(el);
    };

    document.querySelectorAll(SELECTOR).forEach(observe);

    const mutation = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as Element;
          if (CLASSES.some((c) => el.classList.contains(c))) {
            revealIfVisible(el);
            if (!el.classList.contains("revealed")) observe(el);
          }
          el.querySelectorAll(SELECTOR).forEach((child) => {
            revealIfVisible(child);
            if (!child.classList.contains("revealed")) observe(child);
          });
        });
      });
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    const safety = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("revealed"));
    }, 2500);

    return () => { observer.disconnect(); mutation.disconnect(); clearTimeout(safety); };
  }, []);
}

/* ── Portal animation hook ── */
function usePortal() {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const trigger = useCallback((e: React.MouseEvent, cb?: () => void) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setActive(true);
    setTimeout(() => {
      setActive(false);
      cb?.();
    }, 750);
  }, []);

  return { active, pos, trigger };
}

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useScrollReveal();
  useTrackVisit();
  const portal = usePortal();

  const { data: apps = [] } = useListApps();
  const { data: rawProjects = [] } = useListProjects();
  const projects = rawProjects.length > 0 ? rawProjects : DEFAULT.projects;

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

  const handlePortalNav = (e: React.MouseEvent, href: string) => {
    portal.trigger(e, () => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
      {/* Portal overlay */}
      {portal.active && (
        <div className="portal-overlay" style={{ pointerEvents: "none" }}>
          <div
            className="portal-ring"
            style={{ left: portal.pos.x - 40, top: portal.pos.y - 40, position: "absolute" }}
          />
          <div
            className="portal-circle"
            style={{ left: portal.pos.x - 40, top: portal.pos.y - 40, position: "absolute" }}
          />
        </div>
      )}

      <Navbar />

      {/* ── Scroll scorpions ── */}
      <ScrollScorpions />

      {/* ── Floating background orbs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="animate-orb absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl" style={{ background: "hsl(var(--primary))", top: "10%", left: "5%" }} />
        <div className="animate-orb-reverse absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-3xl" style={{ background: "hsl(var(--primary))", bottom: "20%", right: "5%" }} />
        <div className="animate-orb absolute w-[300px] h-[300px] rounded-full opacity-[0.025] blur-3xl" style={{ background: "#7c3aed", top: "50%", right: "30%" }} />
      </div>

      {/* ───── HERO ───── */}
      <section id="hero" className="pt-16 pb-20 relative overflow-hidden z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, hsl(var(--primary)) 0%, transparent 70%)" }} />

        {/* Scan line */}
        <div className="scan-line" />

        {/* Animated name — typewriter */}
        <TypewriterName />

        {/* Two-column content */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mt-4 relative z-10">
          {/* Left — text */}
          <div className="animate-slide-left">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-medium animate-border-glow" style={{ borderColor: "rgba(30,64,175,0.5)", background: "rgba(30,64,175,0.12)", color: "#93c5fd" }}>
              <span style={{ color: "#facc15" }}>✦</span>
              <span>{hero.badge}</span>
            </div>

            <h2 className="font-black leading-tight mb-4 animate-fade-in-up delay-100" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
              {hero.title.split("powerful").map((part: string, i: number) =>
                i === 0
                  ? <span key={i}>{part}<span style={{ color: "hsl(var(--primary))" }}>powerful</span></span>
                  : <span key={i}>{part}</span>
              )}
            </h2>

            <p className="mb-8 leading-relaxed animate-fade-in-up delay-200" style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.95rem" }}>
              {hero.bio}
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300">
              <button
                onClick={(e) => handlePortalNav(e, "#projects")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)" }}
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handlePortalNav(e, "#contact")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all hover:border-white/40 hover:scale-105"
                style={{ background: "transparent", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                Contact Me <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right — profile photo with scorpion flame */}
          <div className="flex justify-center animate-slide-right order-first md:order-last">
            <div className="relative w-full" style={{ maxWidth: 380, height: "clamp(280px, 55vw, 500px)" }}>
              {/* Scorpion behind photo — light silhouette */}
              <div className="absolute inset-0 flex items-center justify-center z-0 animate-scorpion-glow" style={{ opacity: 0.08 }}>
                <img
                  src="/scorpion-favicon.svg"
                  alt=""
                  aria-hidden="true"
                  style={{ width: "85%", height: "85%", objectFit: "contain", filter: `drop-shadow(0 0 40px hsl(var(--primary) / 0.8)) drop-shadow(0 0 80px hsl(var(--primary) / 0.4))`, transform: "scale(1.6) translateY(5%)" }}
                />
              </div>

              {/* Rotating ring behind photo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="animate-spin-slow rounded-full" style={{ width: "90%", height: "90%", border: `1px solid hsl(var(--primary) / 0.08)`, boxShadow: `0 0 40px hsl(var(--primary) / 0.05)` }} />
              </div>

              {/* Outer glow */}
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-50 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, hsl(var(--primary) / 0.45) 0%, transparent 70%)`, transform: "scale(0.9) translateY(12px)", zIndex: 0 }} />

              {/* Photo */}
              <img
                src="/bishal-photo-nobg.png"
                alt="Bishal Bishwokarma"
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center bottom", filter: `drop-shadow(0 0 22px hsl(var(--primary) / 0.65)) drop-shadow(0 0 55px hsl(var(--primary) / 0.3))`, position: "relative", zIndex: 2 }}
                className="animate-float-slow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───── ABOUT ───── */}
      <section id="about" className="py-20 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="reveal">
            <PillBadge color="cyan">ABOUT ME</PillBadge>
            <h2 className="text-3xl font-black mt-4 mb-10">Who I Am</h2>
          </div>
          <div className="reveal delay-200 rounded-2xl p-7 text-left relative overflow-hidden neon-card" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
            <div className="animate-shimmer absolute inset-0 pointer-events-none" />
            <p style={{ color: "hsl(var(--foreground) / 0.85)", lineHeight: 1.8, fontSize: "0.92rem" }}>
              {about.text.split("Bishal Bishwokarma").map((part: string, i: number) =>
                i === 0
                  ? <span key={i}>{part}<strong className="text-foreground">Bishal Bishwokarma</strong></span>
                  : <span key={i}>{part.split("IT student").map((p2: string, j: number) =>
                      j === 0 ? <span key={j}>{p2}<span style={{ color: "hsl(var(--primary))" }}>IT student</span></span> : <span key={j}>{p2}</span>
                    )}</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ───── SKILLS ───── */}
      <section id="skills" className="py-20 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--muted))" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="reveal">
            <PillBadge color="cyan">MY ARSENAL</PillBadge>
            <h2 className="text-3xl font-black mt-4 mb-2">Skills &amp; Tools</h2>
            <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }} className="mb-10">Technologies and abilities I use to bring ideas to life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="reveal-left delay-100">
              <SkillCard title="Programming" icon={<Code2 className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  {skills.programming.map((item: any, i: number) => <SkillItem key={i} icon={item.icon} label={item.label} delay={i * 60} />)}
                </div>
              </SkillCard>
            </div>
            <div className="reveal delay-200">
              <SkillCard title="Tools & Platforms" icon={<Wrench className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  {skills.tools.map((item: any, i: number) => <SkillItem key={i} icon={item.icon} label={item.label} delay={i * 60} />)}
                </div>
              </SkillCard>
            </div>
            <div className="reveal-right delay-300">
              <SkillCard title="Other Skills" icon={<Lightbulb className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />}>
                <div className="grid grid-cols-2 gap-2">
                  {skills.other.map((item: any, i: number) => <SkillItem key={i} icon={item.icon} label={item.label} delay={i * 60} />)}
                </div>
              </SkillCard>
            </div>
          </div>
        </div>
      </section>

      {/* ───── MY PROJECTS ───── */}
      <section id="projects" className="py-20 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="reveal">
            <PillBadge color="green">PORTFOLIO</PillBadge>
            <h2 className="text-3xl font-black mt-4 mb-2">My Projects</h2>
            <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }} className="mb-10">Apps and tools I've built. Sign in to open them.</p>
          </div>

          {apps.length === 0 ? (
            <div className="reveal max-w-sm mx-auto rounded-2xl p-10 flex flex-col items-center" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl animate-float" style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>🚀</div>
              <h3 className="text-lg font-bold mb-2">Apps Coming Soon</h3>
              <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.85rem", lineHeight: 1.6 }} className="mb-6">New projects are being prepared. Sign in to explore Bishal's Hub when apps go live.</p>
              <Link href="/login">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)" }}>
                  Get Early Access <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {apps.map((app: any, i: number) => (
                <a key={app.id} href={user ? (app.url || "#") : "#"} target={user ? "_blank" : "_self"} rel="noreferrer" onClick={(e) => handleAppClick(e, app)} className="group reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                  <div className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all cursor-pointer h-full neon-card relative overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
                    <div className="animate-shimmer absolute inset-0 pointer-events-none" />
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary/40 transition-colors">
                      {app.icon_url ? <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" /> : <Flame className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{app.name}</p>
                      {app.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{app.description}</p>}
                    </div>
                    {!user && <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60"><Lock className="w-3 h-3" /> Sign in to open</div>}
                  </div>
                </a>
              ))}
            </div>
          )}
          <div className="mt-6">
            <ReactionBar targetType="section" targetId="my-projects" />
          </div>
        </div>
      </section>

      {/* ───── LATEST WORKING PROJECT ───── */}
      <section id="latest-projects" className="py-20 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--muted))" }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="reveal">
              <PillBadge color="orange">MY WORK</PillBadge>
              <h2 className="text-3xl font-black mt-4 mb-2">Latest Projects</h2>
              <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }} className="mb-12">A look at what I've built and what's coming next.</p>
            </div>
            <div className="space-y-14">
              {projects.map((proj: any, pi: number) => (
                <div key={proj.id} className="reveal" style={{ transitionDelay: `${pi * 0.15}s` }}>
                  {proj.images && proj.images.length > 0 && (
                    <div className="relative rounded-2xl overflow-hidden p-4 sm:p-6 mb-6" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.12)" }}>
                      <div className={`grid gap-3 ${proj.images.length === 1 ? "grid-cols-1" : proj.images.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                        {proj.images.slice(0, 3).map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-xl overflow-hidden neon-card"
                            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                          >
                            <img
                              src={img}
                              alt={`${proj.title} screenshot ${idx + 1}`}
                              className="w-full h-auto block"
                              style={{ display: "block", userSelect: "none", pointerEvents: "none" }}
                            />
                          </div>
                        ))}
                      </div>
                      {proj.images.length > 3 && (
                        <p className="text-center text-xs mt-3" style={{ color: "#475569" }}>+{proj.images.length - 3} more images</p>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-foreground">{proj.title}</h3>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase ${
                          proj.status === "completed" ? "bg-green-500/15 text-green-400 border border-green-500/20" :
                          proj.status === "archived" ? "bg-gray-500/15 text-gray-400 border border-gray-500/20" :
                          proj.status === "upcoming" ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" :
                          "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                        }`}>
                          {proj.status === "in-progress" ? "In Progress" : proj.status === "upcoming" ? "Upcoming" : proj.status}
                        </span>
                      </div>
                      {proj.description && <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem", maxWidth: 480 }}>{proj.description}</p>}
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
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm whitespace-nowrap hover:scale-105 transition-transform" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)" }}>
                          View Project <ExternalLink className="w-4 h-4" />
                        </button>
                      </a>
                    )}
                  </div>
                  <div className="px-2 pt-2">
                    <ReactionBar targetType="project" targetId={proj.id} compact />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* ───── SERVICES & PRICING ───── */}
      <section id="services" className="py-24 scroll-mt-16 relative overflow-hidden z-10" style={{ background: "hsl(var(--background))" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse, #7c3aed 0%, #2563eb 50%, transparent 80%)" }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="reveal">
              <PillBadge color="orange">FREELANCE</PillBadge>
              <h2 className="text-4xl font-black mt-4 mb-3">Services &amp; Pricing</h2>
              <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.95rem" }}>Professional digital solutions designed to elevate your business</p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)" }}>
                <Star className="w-3.5 h-3.5" style={{ color: "#facc15" }} />
                <span className="text-xs font-medium" style={{ color: "#93c5fd" }}>Flexible pricing based on project complexity and requirements</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {services.map((card: any, i: number) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
                <PricingCard
                  icon={card.icon}
                  title={card.title}
                  price={card.price}
                  description={card.description}
                  tag={card.tag || undefined}
                  tagColor={card.tagColor || undefined}
                  index={i}
                  onHireClick={handlePortalNav}
                />
              </div>
            ))}
          </div>
          <p className="text-center text-xs reveal" style={{ color: "#475569" }}>* Final pricing may vary depending on features, complexity and customization level.</p>
        </div>
      </section>

      {/* ───── EDUCATION ───── */}
      <section id="education" className="py-24 scroll-mt-16 relative z-10 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.15) 20%, hsl(var(--primary) / 0.15) 80%, transparent)" }} />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="reveal">
            <PillBadge color="pink">BACKGROUND</PillBadge>
            <h2 className="text-3xl font-black mt-4 mb-4">My Education</h2>
            <p className="mb-14" style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>The academic journey that shaped who I am</p>
          </div>

          <div className="space-y-10 relative">
            {education.map((item: any, i: number) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-6 ${isLeft ? "" : "flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div className={`flex-1 edu-card-reveal ${isLeft ? "reveal-left" : "reveal-right"}`} style={{ transitionDelay: `${i * 0.18}s` }}>
                    <EduCard
                      side={isLeft ? "right" : "left"}
                      period={item.period}
                      title={item.title}
                      school={item.school}
                      icon={item.icon || "🎓"}
                      index={i}
                    />
                  </div>

                  {/* Center dot */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-4 h-4 rounded-full" style={{ background: "hsl(var(--primary))", boxShadow: `0 0 12px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--primary) / 0.4)` }} />
                    <div className="absolute inset-0 w-4 h-4 rounded-full animate-pulse-ring" style={{ background: "hsl(var(--primary) / 0.3)" }} />
                  </div>

                  {/* Opposite spacer */}
                  <div className="flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── CONTACT ───── */}
      <section id="contact" className="py-20 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="reveal">
            <PillBadge color="cyan">GET IN TOUCH</PillBadge>
            <h2 className="text-3xl font-black mt-4 mb-2">Contact</h2>
            <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }} className="mb-10">Have an idea? Let's build it together.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            {/* Left — info */}
            <div className="space-y-3 reveal-left delay-100">
              <ContactInfoRow icon={<Mail className="w-4 h-4 text-white" />} label="EMAIL" value={contact.email} bg="#0d6e5c" />
              <ContactInfoRow icon={<Phone className="w-4 h-4 text-white" />} label="PHONE" value={contact.phone} bg="#166534" />
              <ContactInfoRow icon={<MapPin className="w-4 h-4 text-white" />} label="LOCATION" value={contact.location} bg="#4c1d95" />
              <div className="pt-2">
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>CONNECT</p>
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
            <div className="rounded-2xl p-6 reveal-right delay-200 relative overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
              <div className="animate-shimmer absolute inset-0 pointer-events-none" />
              <form onSubmit={handleSend} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>NAME</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all" style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.15)", color: "hsl(var(--foreground))" }}
                      onFocus={e => (e.target.style.borderColor = "hsl(var(--primary) / 0.5)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>YOUR EMAIL</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all" style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.15)", color: "hsl(var(--foreground))" }}
                      onFocus={e => (e.target.style.borderColor = "hsl(var(--primary) / 0.5)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>MESSAGE</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project or idea..." rows={5} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all resize-none" style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.15)", color: "hsl(var(--foreground))" }}
                    onFocus={e => (e.target.style.borderColor = "hsl(var(--primary) / 0.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendMsgMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60 hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)", boxShadow: "0 4px 20px hsl(var(--primary) / 0.3)" }}
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

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

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
    <div className="rounded-2xl p-5 text-left relative overflow-hidden neon-card h-full" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
      <div className="animate-shimmer absolute inset-0 pointer-events-none" />
      <div className="flex items-center gap-2.5 mb-4 relative z-10">{icon}<span className="font-bold text-sm">{title}</span></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SkillItem({ icon, label, delay }: { icon: string; label: string; delay?: number }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 cursor-default"
      style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.12)", transitionDelay: `${delay || 0}ms` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.3)"; (e.currentTarget as HTMLElement).style.background = "hsl(var(--primary) / 0.08)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(128,128,128,0.12)"; (e.currentTarget as HTMLElement).style.background = "hsl(var(--muted))"; }}
    >
      <span className="text-xs" style={{ color: "hsl(var(--primary))" }}>{icon}</span>
      <span className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{label}</span>
    </div>
  );
}

const PRICING_COLORS = [
  { bg: "linear-gradient(135deg,rgba(251,146,60,.18) 0%,rgba(245,158,11,.10) 100%)", border: "rgba(251,146,60,.45)",  price: "#fcd34d", btn: "linear-gradient(90deg,#f97316,#f59e0b)", top: "rgba(251,146,60,.7),rgba(245,158,11,.6)",  glow: "rgba(251,146,60,.12)" },
  { bg: "linear-gradient(135deg,rgba(30,64,175,.28) 0%,rgba(124,58,237,.18) 100%)",  border: "rgba(99,102,241,.55)", price: "#a5b4fc", btn: "linear-gradient(90deg,#6366f1,#8b5cf6)", top: "rgba(139,92,246,.8),rgba(59,130,246,.8)",  glow: "rgba(99,102,241,.15)" },
  { bg: "linear-gradient(135deg,rgba(6,182,212,.18) 0%,rgba(20,184,166,.10) 100%)",  border: "rgba(6,182,212,.45)",  price: "#67e8f9", btn: "linear-gradient(90deg,#06b6d4,#14b8a6)", top: "rgba(6,182,212,.7),rgba(20,184,166,.6)",   glow: "rgba(6,182,212,.12)"  },
  { bg: "linear-gradient(135deg,rgba(139,92,246,.22) 0%,rgba(167,139,250,.12) 100%)", border: "rgba(139,92,246,.50)", price: "#c4b5fd", btn: "linear-gradient(90deg,#8b5cf6,#a78bfa)", top: "rgba(139,92,246,.8),rgba(167,139,250,.7)", glow: "rgba(139,92,246,.13)" },
  { bg: "linear-gradient(135deg,rgba(16,185,129,.18) 0%,rgba(34,197,94,.10) 100%)",  border: "rgba(34,197,94,.45)",  price: "#6ee7b7", btn: "linear-gradient(90deg,#10b981,#22c55e)", top: "rgba(16,185,129,.7),rgba(34,197,94,.6)",   glow: "rgba(16,185,129,.12)" },
  { bg: "linear-gradient(135deg,rgba(244,63,94,.18) 0%,rgba(236,72,153,.10) 100%)",  border: "rgba(244,63,94,.45)",  price: "#fda4af", btn: "linear-gradient(90deg,#f43f5e,#ec4899)", top: "rgba(244,63,94,.7),rgba(236,72,153,.6)",   glow: "rgba(244,63,94,.12)"  },
  { bg: "linear-gradient(135deg,rgba(56,189,248,.18) 0%,rgba(99,102,241,.10) 100%)", border: "rgba(56,189,248,.45)",  price: "#7dd3fc", btn: "linear-gradient(90deg,#38bdf8,#818cf8)", top: "rgba(56,189,248,.7),rgba(99,102,241,.6)",  glow: "rgba(56,189,248,.12)" },
];

function PricingCard({ icon, title, price, description, tag, tagColor, index, onHireClick }: {
  icon: string; title: string; price: string; description: string;
  tag?: string; tagColor?: "green" | "blue" | "purple"; index: number;
  onHireClick?: (e: React.MouseEvent, href: string) => void;
}) {
  const c = PRICING_COLORS[index % PRICING_COLORS.length];
  const tagStyles = {
    green:  { bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.4)",  text: "#86efac" },
    blue:   { bg: "rgba(59,130,246,0.2)",  border: "rgba(59,130,246,0.6)",  text: "#93c5fd" },
    purple: { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", text: "#c4b5fd" },
  };
  const ts = tag && tagColor && tagStyles[tagColor as keyof typeof tagStyles] ? tagStyles[tagColor as keyof typeof tagStyles] : null;
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col gap-4 neon-card h-full"
      style={{ background: c.bg, border: `1px solid ${c.border}`, backdropFilter: "blur(12px)", boxShadow: `0 0 30px ${c.glow}, inset 0 0 30px ${c.glow.replace(".12", ".03").replace(".15", ".04").replace(".13", ".03")}` }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.top.split(",")[0]}, ${c.top.split(",")[1]}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 animate-float" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${c.border}`, animationDelay: `${index * 0.35}s` }}>{icon}</div>
        {tag && ts && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase" style={{ background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text }}>{tag}</span>}
      </div>
      <div>
        <h3 className="font-bold text-base mb-1">{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{description}</p>
      </div>
      <div className="mt-auto pt-3 border-t" style={{ borderColor: c.border }}>
        <p className="font-black text-lg mb-3" style={{ color: c.price }}>{price}</p>
        <button
          onClick={(e) => {
            if (onHireClick) {
              onHireClick(e, "#contact");
            } else {
              window.open("https://wa.me/9779802485583", "_blank");
            }
          }}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
          style={{ background: c.btn, color: "#fff", border: "none" }}
        >
          Hire Me →
        </button>
      </div>
    </div>
  );
}

function EduCard({ period, title, school, icon, side, index }: { period: string; title: string; school: string; icon: string; side: "left" | "right"; index: number }) {
  const colors = [
    { primary: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.25)" },
    { primary: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)" },
    { primary: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)" },
  ];
  const c = colors[index % colors.length];
  return (
    <div
      className={`rounded-xl p-5 text-left relative overflow-hidden neon-card ${side === "right" ? "text-right" : ""}`}
      style={{ background: "hsl(var(--card))", border: `1px solid ${c.border}`, boxShadow: `0 0 20px ${c.primary}18` }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ background: `radial-gradient(ellipse at ${side === "left" ? "100%" : "0%"} 50%, ${c.primary} 0%, transparent 70%)` }} />
      <div className={`flex items-center gap-3 mb-3 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 animate-float" style={{ background: c.bg, border: `1px solid ${c.border}`, animationDelay: `${index * 0.5}s` }}>{icon}</div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.primary, border: `1px solid ${c.border}` }}>{period}</span>
      </div>
      <p className="font-bold text-sm mb-1.5 relative z-10">{title}</p>
      <p className="text-xs leading-relaxed relative z-10" style={{ color: "hsl(var(--muted-foreground))" }}>{school}</p>
    </div>
  );
}

function ContactInfoRow({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl neon-card" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>{icon}</div>
      <div><p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p><p className="text-sm font-medium text-foreground break-all">{value}</p></div>
    </div>
  );
}

function SocialRow({ icon, name, handle }: { icon: React.ReactNode; name: string; handle: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all neon-card" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "transparent" }}>
      {icon}
      <div><p className="text-xs font-semibold text-foreground">{name}</p><p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{handle}</p></div>
      <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: "hsl(var(--primary))" }} />
    </div>
  );
}
