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
  GraduationCap, BookOpen, Award, ChevronDown, MapPinIcon, CalendarDays, Briefcase, Globe
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

/* ── Typing role badge ── */
const ROLES = [
  "IT Student",
  "Web App Developer",
  "Software Developer",
  "Designer",
];

const TypingRoleBadge = memo(function TypingRoleBadge() {
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let phase: "typing" | "pause" | "erasing" = "typing";
    let roleIdx = 0;
    let chars = 0;
    let t: ReturnType<typeof setTimeout>;

    const tick = () => {
      const role = ROLES[roleIdx];
      if (phase === "typing") {
        if (chars < role.length) {
          chars++;
          setText(role.slice(0, chars));
          t = setTimeout(tick, 80);
        } else {
          phase = "pause";
          t = setTimeout(tick, 1800);
        }
      } else if (phase === "pause") {
        phase = "erasing";
        t = setTimeout(tick, 300);
      } else {
        if (chars > 0) {
          chars--;
          setText(role.slice(0, chars));
          t = setTimeout(tick, 45);
        } else {
          roleIdx = (roleIdx + 1) % ROLES.length;
          phase = "typing";
          t = setTimeout(tick, 200);
        }
      }
    };

    t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium animate-border-glow"
      style={{ borderColor: "rgba(30,64,175,0.5)", background: "rgba(30,64,175,0.12)", color: "#93c5fd", minWidth: 200 }}
    >
      <span style={{ color: "#facc15" }}>✦</span>
      <span style={{ minWidth: 155, display: "inline-block" }}>
        {text}
        <span style={{ opacity: cursor ? 1 : 0, fontWeight: 100 }}>|</span>
      </span>
    </div>
  );
});

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

/* ── Real photo scorpion with neon glow (background removed) ── */
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
        [flipX ? "right" : "left"]: "4px",
        opacity,
        willChange: "top",
        transition: "top 0.08s linear",
      }}
    >
      <div className="scorpion-lean">
        <div style={{ transform: flipX ? "scaleX(-1)" : undefined }}>
          <img
            src="/scorpion-real.png"
            alt=""
            aria-hidden
            className="scorpion-body"
            style={{ width: 38, display: "block" }}
          />
        </div>
      </div>
    </div>
  );
});

/* ── Scroll Scorpions — autonomous patrol + scroll override ── */
const ScrollScorpions = memo(function ScrollScorpions() {
  const leftRef        = useRef<HTMLDivElement>(null);
  const rightRef       = useRef<HTMLDivElement>(null);
  const leftPosRef     = useRef(160);
  const rightPosRef    = useRef(320);
  const lastScrollRef  = useRef(0);
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef         = useRef<number>(0);
  const patrolDirRef   = useRef<1 | -1>(1);
  const scrollActiveRef = useRef(false);
  const pauseUntilRef  = useRef(0);

  useEffect(() => {
    const setS = (el: HTMLDivElement | null, s: string) => { if (el) el.dataset.state = s; };

    /* Scroll — highest priority, temporarily overrides patrol */
    const onScroll = () => {
      const y     = window.scrollY;
      const delta = y - lastScrollRef.current;
      lastScrollRef.current = y;
      const vh = window.innerHeight;

      scrollActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const dir = delta > 0 ? "walking-down" : "walking-up";
      setS(leftRef.current,  dir);
      setS(rightRef.current, dir);

      leftPosRef.current  = Math.max(60, Math.min(vh - 110, leftPosRef.current  + delta * 0.78));
      rightPosRef.current = Math.max(60, Math.min(vh - 110, rightPosRef.current + delta * 0.69));
      if (leftRef.current)  leftRef.current.style.top  = leftPosRef.current  + "px";
      if (rightRef.current) rightRef.current.style.top = rightPosRef.current + "px";

      idleTimerRef.current = setTimeout(() => { scrollActiveRef.current = false; }, 260);
    };

    /* Autonomous patrol loop — runs every frame when not scrolling */
    const SPEED_L = 0.30; // px / frame  (~18px/s at 60fps)
    const SPEED_R = 0.23;

    const patrol = () => {
      if (!scrollActiveRef.current && performance.now() >= pauseUntilRef.current) {
        const vh  = window.innerHeight;
        const dir = patrolDirRef.current;

        leftPosRef.current  += SPEED_L * dir;
        rightPosRef.current += SPEED_R * dir;

        const hitBottom = dir >  0 && (leftPosRef.current > vh - 110 || rightPosRef.current > vh - 110);
        const hitTop    = dir < 0  && (leftPosRef.current < 60       || rightPosRef.current < 60);

        if (hitBottom || hitTop) {
          patrolDirRef.current = (dir > 0 ? -1 : 1) as 1 | -1;
          pauseUntilRef.current = performance.now() + 700; // brief idle pause at each end
          setS(leftRef.current,  "idle");
          setS(rightRef.current, "idle");
        } else {
          const s = dir > 0 ? "walking-down" : "walking-up";
          setS(leftRef.current,  s);
          setS(rightRef.current, s);
        }

        if (leftRef.current)  leftRef.current.style.top  = leftPosRef.current  + "px";
        if (rightRef.current) rightRef.current.style.top = rightPosRef.current + "px";
      }
      rafRef.current = requestAnimationFrame(patrol);
    };

    rafRef.current = requestAnimationFrame(patrol);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <>
      <WalkingScorpion containerRef={leftRef}  initialTop={160} flipX={false} opacity={0.52} />
      <WalkingScorpion containerRef={rightRef} initialTop={320} flipX={true}  opacity={0.42} />
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
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <TypingRoleBadge />
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", color: "#10b981" }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Available for Hire
              </div>
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

      {/* ───── STATS ───── */}
      <StatsSection />

      {/* ───── ABOUT ───── */}
      <section id="about" className="py-20 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="reveal text-center mb-12">
            <PillBadge color="cyan">ABOUT ME</PillBadge>
            <h2 className="text-3xl font-black mt-4">Who I Am</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>The person behind the code</p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left — identity card */}
            <div className="md:col-span-2 reveal-left delay-100">
              <div className="rounded-2xl p-6 relative overflow-hidden neon-card" style={{ background: "hsl(var(--card))", border: "1px solid rgba(6,182,212,0.2)", boxShadow: "0 0 30px rgba(6,182,212,0.06)" }}>
                <div className="animate-shimmer absolute inset-0 pointer-events-none" />
                {/* Avatar ring */}
                <div className="flex justify-center mb-5 relative z-10">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: "2px solid hsl(var(--primary) / 0.5)", boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}>
                      <img src="/bishal-photo-nobg.png" alt="Bishal" className="w-full h-full object-cover object-center" style={{ objectPosition: "50% 15%" }} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: "#10b981", border: "2px solid hsl(var(--background))" }}>✓</div>
                  </div>
                </div>
                <div className="text-center mb-5 relative z-10">
                  <h3 className="font-black text-lg text-foreground">Bishal Bishwokarma</h3>
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--primary))" }}>IT Student & Full-Stack Developer</p>
                </div>
                {/* Quick facts */}
                <div className="space-y-2.5 relative z-10">
                  {[
                    { icon: <MapPinIcon className="w-3.5 h-3.5" />, label: "Kathmandu, Nepal" },
                    { icon: <GraduationCap className="w-3.5 h-3.5" />, label: "Phoenix College of Mgmt" },
                    { icon: <Briefcase className="w-3.5 h-3.5" />, label: "Freelance · Available Now" },
                    { icon: <Globe className="w-3.5 h-3.5" />, label: "Nepali · English" },
                    { icon: <CalendarDays className="w-3.5 h-3.5" />, label: "2+ Years Experience" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.1)" }}>
                      <span style={{ color: "hsl(var(--primary))" }}>{item.icon}</span>
                      <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — story + highlights */}
            <div className="md:col-span-3 space-y-5 reveal-right delay-200">
              {/* Bio card */}
              <div className="rounded-2xl p-6 relative overflow-hidden neon-card" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
                <div className="animate-shimmer absolute inset-0 pointer-events-none" />
                <p className="relative z-10 leading-[1.85] text-[0.9rem]" style={{ color: "hsl(var(--foreground) / 0.82)" }}>
                  {about.text.split("Bishal Bishwokarma").map((part: string, i: number) =>
                    i === 0
                      ? <span key={i}>{part}<strong className="text-foreground">Bishal Bishwokarma</strong></span>
                      : <span key={i}>{part.split("IT student").map((p2: string, j: number) =>
                          j === 0 ? <span key={j}>{p2}<span style={{ color: "hsl(var(--primary))" }}>IT student</span></span> : <span key={j}>{p2}</span>
                        )}</span>
                  )}
                </p>
              </div>

              {/* Highlight chips */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🎯", title: "Goal-Driven", desc: "Building real products that solve real problems" },
                  { icon: "⚡", title: "Fast Learner", desc: "Adapts quickly to new tech and client needs" },
                  { icon: "🤝", title: "Collaborative", desc: "Clear communication from kickoff to delivery" },
                  { icon: "🛡️", title: "Quality-First", desc: "Clean, secure and maintainable code always" },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-4 relative overflow-hidden neon-card" style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.12)" }}>
                    <div className="text-xl mb-2">{item.icon}</div>
                    <p className="font-bold text-sm text-foreground mb-0.5">{item.title}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Tech tags */}
              <div className="rounded-xl px-5 py-4 relative overflow-hidden" style={{ background: "hsl(var(--muted))", border: "1px solid rgba(128,128,128,0.12)" }}>
                <p className="text-[10px] font-semibold tracking-widest uppercase mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Core Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Python", "Figma"].map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", color: "#67e8f9" }}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── MY PROCESS ───── */}
      {(() => {
        const steps = [
          {
            step: "01", icon: "🎯", title: "Discover & Consult",
            subtitle: "Understanding your vision",
            color: "#00BFFF",
            duration: "1–2 Days",
            desc: "Every great project starts with a real conversation. I take time to deeply understand your goals, target audience, brand identity, and what success means to you. No assumptions — just clear, honest communication that sets the foundation for everything that follows.",
            deliverables: ["Requirements document", "Project scope definition", "Timeline estimate", "Budget alignment"],
            tools: ["Google Meet", "Notion", "Miro"],
          },
          {
            step: "02", icon: "📐", title: "Plan & Architect",
            subtitle: "Building the blueprint",
            color: "#a78bfa",
            duration: "2–4 Days",
            desc: "Before writing a single line of code, I map out the complete system. Tech stack selection, database schema, API architecture, feature prioritization — everything is planned with scalability and maintainability in mind so there are no surprises later.",
            deliverables: ["System architecture diagram", "Tech stack selection", "Feature roadmap", "Sprint breakdown"],
            tools: ["Figma", "Notion", "draw.io"],
          },
          {
            step: "03", icon: "🎨", title: "Design & Prototype",
            subtitle: "Crafting the visual experience",
            color: "#34d399",
            duration: "3–7 Days",
            desc: "From rough wireframes to high-fidelity interactive prototypes, every pixel is intentional. I build a consistent design system — colors, typography, spacing — and create interactive mockups you can click through before development begins.",
            deliverables: ["Wireframes", "Hi-fidelity UI mockups", "Design system", "Interactive prototype"],
            tools: ["Figma", "Adobe XD", "Tailwind CSS"],
          },
          {
            step: "04", icon: "⚡", title: "Build & Develop",
            subtitle: "Turning designs into reality",
            color: "#f59e0b",
            duration: "1–4 Weeks",
            desc: "Clean, well-documented, scalable code is non-negotiable. I follow best practices — component architecture, proper error handling, security measures — with daily progress updates and regular check-ins. You always know exactly where your project stands.",
            deliverables: ["Production-ready source code", "API documentation", "Staging environment", "Progress reports"],
            tools: ["React", "Node.js", "PostgreSQL", "GitHub"],
          },
          {
            step: "05", icon: "🧪", title: "Test & Refine",
            subtitle: "Polishing to perfection",
            color: "#fb7185",
            duration: "2–5 Days",
            desc: "Thorough testing across all devices, browsers, and screen sizes. Performance audits, accessibility checks, SEO validation, and security scans. Every piece of feedback is addressed before anything goes live.",
            deliverables: ["Cross-device test reports", "Performance audit", "Bug fixes", "Optimized production build"],
            tools: ["Lighthouse", "BrowserStack", "Postman"],
          },
          {
            step: "06", icon: "🚀", title: "Launch & Support",
            subtitle: "Go live with confidence",
            color: "#f43f5e",
            duration: "1–2 Days + Ongoing",
            desc: "Deployment is handled end-to-end — domain setup, SSL, CI/CD pipelines, monitoring. After launch you receive full documentation and 30 days of free bug fixes. Your success after delivery matters as much as the work itself.",
            deliverables: ["Live production deployment", "Full documentation", "Deployment guide", "30-day free support"],
            tools: ["Vercel", "GitHub Actions", "Analytics"],
          },
        ];
        return (
          <section id="process" className="py-20 scroll-mt-16 relative z-10 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
            {/* Ambient blobs */}
            <div className="absolute top-10 left-0 w-[500px] h-[500px] rounded-full opacity-[0.035] blur-3xl pointer-events-none" style={{ background: "hsl(var(--primary))" }} />
            <div className="absolute bottom-10 right-0 w-[400px] h-[400px] rounded-full opacity-[0.025] blur-3xl pointer-events-none" style={{ background: "#8b5cf6" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.02] blur-3xl pointer-events-none" style={{ background: "#34d399" }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              {/* Header */}
              <div className="reveal text-center mb-16 sm:mb-20">
                <PillBadge color="cyan">HOW I WORK</PillBadge>
                <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-3">My Process</h2>
                <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                  A transparent, structured workflow that keeps you informed at every stage — from the very first conversation to long after your product launches.
                </p>
                {/* Stats row */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8">
                  {[
                    { value: "6", label: "Clear Stages" },
                    { value: "100%", label: "Transparency" },
                    { value: "30 Days", label: "Free Support" },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl sm:text-3xl font-black" style={{ color: "hsl(var(--primary))" }}>{s.value}</div>
                      <div className="text-[11px] sm:text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── UNIFIED TIMELINE (zigzag on desktop, vertical on mobile) ── */}
              <div className="relative">
                {/* Center vertical line — desktop only */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.35) 8%, hsl(var(--primary) / 0.35) 92%, transparent 100%)" }} />

                {/* Mobile vertical line */}
                <div className="lg:hidden absolute left-5 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.4) 5%, hsl(var(--primary) / 0.4) 95%, transparent 100%)" }} />

                <div className="space-y-8 sm:space-y-10 lg:space-y-0">
                  {steps.map((p, i) => {
                    const isLeft = i % 2 === 0;
                    return (
                      <div key={i} className={`reveal relative flex items-start lg:items-center gap-0 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`} style={{ transitionDelay: `${i * 0.1}s`, marginBottom: i < steps.length - 1 ? "clamp(24px, 4vw, 48px)" : 0 }}>

                        {/* ── Card ── */}
                        <div className={`flex-1 pl-14 lg:pl-0 ${isLeft ? "lg:pr-12" : "lg:pl-12"}`}>
                          <div
                            className="group rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${p.color}10 0%, hsl(var(--card)) 50%)`,
                              border: `1px solid ${p.color}35`,
                              boxShadow: `0 4px 32px ${p.color}0D`,
                            }}
                          >
                            {/* shimmer overlay */}
                            <div className="animate-shimmer absolute inset-0 pointer-events-none" />

                            {/* Top row: number + duration badge */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0" style={{ background: `${p.color}18`, border: `1px solid ${p.color}40` }}>
                                  {p.icon}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest" style={{ color: p.color }}>STEP {p.step}</span>
                                  </div>
                                  <h3 className="font-black text-base sm:text-lg leading-tight text-foreground">{p.title}</h3>
                                  <p className="text-[11px] sm:text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{p.subtitle}</p>
                                </div>
                              </div>
                              <span
                                className="flex-shrink-0 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                                style={{ background: `${p.color}18`, border: `1px solid ${p.color}40`, color: p.color }}
                              >
                                ⏱ {p.duration}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-[13px] leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>{p.desc}</p>

                            {/* Divider */}
                            <div className="h-px mb-4" style={{ background: `${p.color}20` }} />

                            {/* Deliverables + Tools */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Deliverables */}
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: p.color }}>What You Get</p>
                                <ul className="space-y-1.5">
                                  {p.deliverables.map((d, di) => (
                                    <li key={di} className="flex items-start gap-2 text-[11px] sm:text-xs" style={{ color: "hsl(var(--foreground) / 0.8)" }}>
                                      <span className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded-full flex items-center justify-center text-[8px] font-black" style={{ background: `${p.color}25`, color: p.color }}>✓</span>
                                      {d}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Tools */}
                              <div>
                                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: p.color }}>Tools Used</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.tools.map((t, ti) => (
                                    <span key={ti} className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-semibold" style={{ background: `${p.color}12`, border: `1px solid ${p.color}30`, color: "hsl(var(--foreground) / 0.75)" }}>
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── Center node (desktop) / Left node (mobile) ── */}
                        {/* Mobile dot */}
                        <div
                          className="lg:hidden absolute left-[12px] top-[22px] w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0 z-10"
                          style={{ background: p.color, color: "#000", boxShadow: `0 0 14px ${p.color}80` }}
                        >
                          {i + 1}
                        </div>

                        {/* Desktop center dot */}
                        <div className="hidden lg:flex flex-shrink-0 relative z-10 items-center justify-center" style={{ width: 64 }}>
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform duration-300 hover:scale-110"
                            style={{
                              background: `radial-gradient(circle, ${p.color}22 0%, ${p.color}10 60%, transparent 100%)`,
                              border: `2px solid ${p.color}60`,
                              boxShadow: `0 0 20px ${p.color}40, 0 0 40px ${p.color}15`,
                            }}
                          >
                            {p.icon}
                          </div>
                        </div>

                        {/* ── Spacer for opposite side (desktop zigzag) ── */}
                        <div className="hidden lg:block flex-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="reveal text-center mt-16 sm:mt-20">
                <div className="inline-block rounded-2xl px-6 sm:px-10 py-6 sm:py-8" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                  <p className="text-base sm:text-lg font-black mb-1 text-foreground">Ready to start your project?</p>
                  <p className="text-xs sm:text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>The first consultation is completely free — let's talk about your idea.</p>
                  <button
                    onClick={() => { const el = document.querySelector("#contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #7c3aed)", boxShadow: "0 0 24px hsl(var(--primary) / 0.4)" }}
                  >
                    🎯 Let's Build Together →
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

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

      {/* ───── WHY CHOOSE ME ───── */}
      <WhyChooseMe />

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
                    <div className="flex flex-wrap gap-3">
                      {proj.link_url && (
                        <a href={proj.link_url} target="_blank" rel="noreferrer">
                          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm whitespace-nowrap hover:scale-105 transition-transform" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #2563eb)" }}>
                            View Live <ExternalLink className="w-4 h-4" />
                          </button>
                        </a>
                      )}
                    </div>
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

      {/* ───── TESTIMONIALS ───── */}
      <TestimonialsSection />

      {/* ───── FAQ ───── */}
      <FaqSection />

      {/* ───── BLOG ───── */}
      <BlogSection />

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

function PillBadge({ children, color }: { children: React.ReactNode; color: "cyan" | "green" | "orange" | "pink" | "purple" }) {
  const styles = {
    cyan:   { border: "rgba(6,182,212,0.5)",  bg: "rgba(6,182,212,0.08)",  text: "#67e8f9" },
    green:  { border: "rgba(34,197,94,0.5)",  bg: "rgba(34,197,94,0.08)",  text: "#86efac" },
    orange: { border: "rgba(249,115,22,0.5)", bg: "rgba(249,115,22,0.08)", text: "#fdba74" },
    pink:   { border: "rgba(236,72,153,0.5)", bg: "rgba(236,72,153,0.08)", text: "#f9a8d4" },
    purple: { border: "rgba(139,92,246,0.5)", bg: "rgba(139,92,246,0.08)", text: "#c4b5fd" },
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

/* ══════════════════════════════════════════
   STATS SECTION
══════════════════════════════════════════ */

const STATS_DATA = [
  { value: 200, suffix: "+", label: "Client Reviews",      icon: "⭐", color: "#f59e0b" },
  { value: 100, suffix: "+", label: "Happy Clients",       icon: "😊", color: "#10b981" },
  { value: 90,  suffix: "%", label: "Satisfaction Rate",   icon: "🎯", color: "#06b6d4" },
  { value: 50,  suffix: "+", label: "Projects Completed",  icon: "🚀", color: "#8b5cf6" },
];

function StatCard({ value, suffix, label, icon, color }: {
  value: number; suffix: string; label: string; icon: string; color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const duration = 1800;
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
        else setCount(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="reveal text-center p-7 rounded-2xl neon-card relative overflow-hidden group"
      style={{ background: "hsl(var(--card))", border: `1px solid ${color}40` }}>
      <div className="animate-shimmer absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}12 0%, transparent 70%)` }} />
      <div className="text-4xl mb-3 relative z-10">{icon}</div>
      <div className="font-black relative z-10 mb-1.5"
        style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color, textShadow: `0 0 20px ${color}80, 0 0 40px ${color}40` }}>
        {count}{suffix}
      </div>
      <div className="text-sm font-semibold relative z-10" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</div>
    </div>
  );
}

const StatsSection = memo(function StatsSection() {
  return (
    <section className="py-16 relative z-10" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal text-center mb-10">
          <PillBadge color="cyan">BY THE NUMBERS</PillBadge>
          <h2 className="text-3xl font-black mt-4">Results That Speak</h2>
          <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Numbers that reflect real client satisfaction across Nepal</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS_DATA.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </div>
    </section>
  );
});

/* ══════════════════════════════════════════
   WHY CHOOSE ME
══════════════════════════════════════════ */

const WHY_ME_DATA = [
  { icon: "⚡", title: "Fast Delivery",      desc: "Projects delivered on time, every time. I respect deadlines and communicate proactively throughout the build.", color: "#f59e0b" },
  { icon: "💰", title: "Affordable Pricing", desc: "Best quality-to-price ratio in Nepal. Transparent, honest pricing with absolutely no hidden charges.", color: "#10b981" },
  { icon: "🎯", title: "Custom Solutions",   desc: "Every project is built from scratch to match your exact requirements — no cookie-cutter templates.", color: "#06b6d4" },
  { icon: "🛡️", title: "Clean & Secure Code", desc: "Modern, maintainable and secure code following industry best practices — built to scale with your growth.", color: "#8b5cf6" },
  { icon: "📞", title: "24/7 Support",       desc: "Always reachable via WhatsApp or email. Quick responses and ongoing support even after project delivery.", color: "#f43f5e" },
  { icon: "📈", title: "Proven Results",     desc: "50+ completed projects, 100+ happy clients, and a 90% satisfaction rate with businesses across Nepal.", color: "#3b82f6" },
];

const WhyChooseMe = memo(function WhyChooseMe() {
  return (
    <section id="why-me" className="py-24 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal text-center mb-12">
          <PillBadge color="orange">WHY CHOOSE ME</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-3">Why Clients Trust Me</h2>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem" }}>
            Here's what sets me apart as a web developer, mobile app developer, and designer in Nepal.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {WHY_ME_DATA.map((item, i) => (
            <div key={i} className="reveal rounded-2xl p-6 neon-card relative overflow-hidden group"
              style={{ background: "hsl(var(--card))", border: `1px solid ${item.color}30`, transitionDelay: `${i * 0.08}s` }}>
              <div className="animate-shimmer absolute inset-0 pointer-events-none" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 20% 20%, ${item.color}12 0%, transparent 60%)` }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 relative z-10"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}>
                {item.icon}
              </div>
              <h3 className="font-bold text-base mb-2 relative z-10" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════ */

const TESTIMONIALS_DATA = [
  { name: "Rajesh Sharma",    role: "Business Owner, Kathmandu",      rating: 5, text: "Bishal built our company website in record time. Very professional, responsive, and the quality of work exceeded our expectations. Highly recommended!", color: "#06b6d4" },
  { name: "Priya Shrestha",   role: "Content Creator, Nepal",         rating: 5, text: "Amazing thumbnail and social media designs! My YouTube engagement increased significantly after working with Bishal. Quick delivery and great communication.", color: "#8b5cf6" },
  { name: "Sita Gurung",      role: "Operations Director, Pokhara",   rating: 5, text: "Our logistics software was built exactly as we envisioned. Bishal understood our requirements perfectly and delivered a robust, scalable system on time.", color: "#10b981" },
  { name: "Deepak Karki",     role: "Entrepreneur, Lalitpur",         rating: 5, text: "Clean, fast, and mobile-friendly website. Bishal's attention to detail is impressive. He is definitely the best web developer I've worked with in Nepal.", color: "#f59e0b" },
  { name: "Aarav Thapa",      role: "Startup Founder, Kathmandu",     rating: 5, text: "Bishal developed our mobile app and it was a great experience from start to finish. Always available whenever we needed and made the whole process smooth.", color: "#f43f5e" },
  { name: "Meera Adhikari",   role: "NGO Manager, Bhaktapur",         rating: 5, text: "Very affordable pricing for outstanding quality. Our office management system has saved us hours every week. Professional, reliable, and talented!", color: "#3b82f6" },
];

const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section id="reviews" className="py-24 scroll-mt-16 relative z-10 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: "#8b5cf6" }} />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-12">
          <PillBadge color="pink">CLIENT REVIEWS</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-3">What Clients Say</h2>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem" }}>
            Real feedback from 100+ happy clients across Nepal and beyond.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS_DATA.map((t, i) => (
            <div key={i} className="reveal rounded-2xl p-6 neon-card relative overflow-hidden flex flex-col"
              style={{ background: "hsl(var(--card))", border: `1px solid ${t.color}30`, transitionDelay: `${i * 0.09}s` }}>
              <div className="animate-shimmer absolute inset-0 pointer-events-none" />
              <div className="flex gap-0.5 mb-4 relative z-10">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-current" style={{ color: "#facc15" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1 relative z-10 mb-5 italic" style={{ color: "hsl(var(--foreground) / 0.82)" }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 relative z-10 border-t pt-4" style={{ borderColor: "rgba(128,128,128,0.15)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: `${t.color}20`, border: `1px solid ${t.color}50`, color: t.color }}>
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ══════════════════════════════════════════
   FAQ SECTION
══════════════════════════════════════════ */

const FAQS_DATA = [
  { q: "How long does it take to build a website?",     a: "A personal or small business website typically takes 3–7 days. Company websites take 1–2 weeks. Complex systems like logistics software or mobile apps take 3–6 weeks depending on requirements." },
  { q: "What is your pricing?",                         a: "Pricing depends on the project. Thumbnail designs start from Rs. 500, personal websites from Rs. 8,000, company websites from Rs. 20,000, and mobile apps from Rs. 25,000. Contact for a custom quote." },
  { q: "Do you provide website maintenance?",           a: "Yes! Monthly maintenance packages are available from Rs. 2,000–8,000/month, including bug fixes, updates, performance monitoring, and content updates." },
  { q: "What technologies do you use?",                 a: "React, Node.js, TypeScript, PostgreSQL, and Tailwind CSS for web apps. React Native/Expo for mobile apps. Figma and Canva for UI/graphic designs." },
  { q: "Can you redesign my existing website?",         a: "Absolutely! I can redesign and modernize your existing website or migrate it to a new tech stack while keeping your content and SEO intact." },
  { q: "Do you work with clients outside Kathmandu?",   a: "Yes, I work with clients all across Nepal and internationally. All communication and delivery can be handled remotely via email, WhatsApp, or video call." },
  { q: "How do I get started?",                         a: "Send a message via the contact form below, WhatsApp at 9802485583, or email at bishalbishwokarma089@gmail.com. I'll reply within a few hours to discuss your project." },
  { q: "Can I see examples of your previous work?",     a: "Yes! Check the Projects section of this website. Sign in to access the full portfolio and app hub with live previews of completed projects." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden neon-card" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
      <button className="w-full flex items-center justify-between gap-4 p-5 text-left" onClick={() => setOpen(o => !o)}>
        <span className="font-semibold text-sm flex-1" style={{ color: "hsl(var(--foreground))" }}>{q}</span>
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{ background: "hsl(var(--primary) / 0.15)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <ChevronDown className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="h-px mb-4" style={{ background: "rgba(128,128,128,0.15)" }} />
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

const FaqSection = memo(function FaqSection() {
  return (
    <section id="faq" className="py-24 scroll-mt-16 relative z-10" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="reveal text-center mb-12">
          <PillBadge color="green">FAQ</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-3">Frequently Asked Questions</h2>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem" }}>
            Everything you need to know before we work together.
          </p>
        </div>
        <div className="space-y-3">
          {FAQS_DATA.map((item, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
              <FaqItem q={item.q} a={item.a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ══════════════════════════════════════════
   BLOG / ARTICLES SECTION
══════════════════════════════════════════ */

const BLOG_POSTS = [
  {
    slug: "why-your-nepal-business-needs-a-website",
    tag: "Business Tips",
    tagColor: "#06b6d4",
    date: "May 2026",
    readTime: "4 min read",
    title: "5 Reasons Why Your Nepal Business Needs a Website in 2026",
    excerpt: "In 2026, not having a website means losing customers every day. Here's exactly why a professional website is no longer optional for businesses in Nepal — and what it costs to get one built.",
    icon: "🌐",
  },
  {
    slug: "website-vs-mobile-app-nepal",
    tag: "Web vs App",
    tagColor: "#8b5cf6",
    date: "April 2026",
    readTime: "5 min read",
    title: "Website vs Mobile App: Which is Right for Your Nepal Business?",
    excerpt: "Confused about whether to build a website or a mobile app first? This guide compares cost, reach, and ROI for Nepal-based businesses to help you make the right decision.",
    icon: "📱",
  },
  {
    slug: "website-cost-nepal-2026",
    tag: "Pricing Guide",
    tagColor: "#10b981",
    date: "March 2026",
    readTime: "6 min read",
    title: "How Much Does a Website Cost in Nepal? Complete 2026 Pricing Guide",
    excerpt: "From simple personal websites (Rs. 8,000) to complex SaaS platforms (Rs. 1,00,000+), here's a transparent breakdown of website development costs in Nepal with no hidden charges.",
    icon: "💰",
  },
  {
    slug: "seo-nepal-tips",
    tag: "SEO Nepal",
    tagColor: "#f59e0b",
    date: "February 2026",
    readTime: "7 min read",
    title: "How to Get Your Nepal Business on Google Page 1: SEO Guide for 2026",
    excerpt: "Learn the exact SEO strategies that work for businesses in Nepal — from local keyword targeting and Google My Business optimization to technical SEO that drives real traffic.",
    icon: "🔍",
  },
];

const BlogSection = memo(function BlogSection() {
  return (
    <section id="blog" className="py-24 scroll-mt-16 relative z-10 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04] blur-3xl" style={{ background: "#7c3aed" }} />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="reveal text-center mb-12">
          <PillBadge color="purple">ARTICLES & TIPS</PillBadge>
          <h2 className="text-3xl font-black mt-4 mb-3">Helpful Resources</h2>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.9rem" }}>
            Insights on web development, digital growth, and technology for businesses in Nepal.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BLOG_POSTS.map((post, i) => (
            <article key={i} className="reveal rounded-2xl p-5 neon-card flex flex-col group cursor-pointer"
              style={{ background: "hsl(var(--card))", border: `1px solid ${post.tagColor}22`, transitionDelay: `${i * 0.08}s` }}
              onClick={() => window.location.hash = "#contact"}>
              <div className="animate-shimmer absolute inset-0 rounded-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="text-3xl mb-4">{post.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${post.tagColor}18`, color: post.tagColor, border: `1px solid ${post.tagColor}40` }}>
                    {post.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm leading-snug mb-3 group-hover:text-cyan-400 transition-colors">{post.title}</h3>
                <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "hsl(var(--muted-foreground))" }}>{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
                  <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{post.date}</span>
                  <span className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="reveal text-center mt-10">
          <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
            Have a question about your project? I'm happy to advise — no charge.
          </p>
          <a href="#contact">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb)" }}>
              Ask Me Anything <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
});
