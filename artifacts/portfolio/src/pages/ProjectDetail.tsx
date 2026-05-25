import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useListProjects } from "@workspace/api-client-react";
import { ArrowLeft, ExternalLink, Github, Star, Clock, CheckCircle2, Layers, Code2 } from "lucide-react";

const FALLBACK_PROJECTS = [
  {
    id: "bishal-hub",
    title: "Bishal's Hub — Portfolio & SaaS Portal",
    description: "A full personal portfolio and SaaS hub featuring dark neon design, user authentication, admin panel, app management, and real-time messaging system. Built to showcase work and serve as a client portal.",
    images: [] as string[],
    tech_stack: "React, TypeScript, Express.js, PostgreSQL, Tailwind CSS, JWT Auth",
    link_url: "",
    status: "in-progress",
    sort_order: 0,
    long_description: "This project serves as both a personal portfolio and a SaaS hub. It features a dark neon aesthetic with animated components, a full JWT authentication system, an admin panel for managing content, projects, apps, and messages, plus a user dashboard with messaging and app hub.",
    challenges: "Building a fully custom auth system from scratch, designing an admin panel with real-time data, and creating the neon animated UI without any external animation libraries.",
    results: "A production-ready portfolio that gets real traffic and serves as a live demonstration of full-stack skills to potential clients across Nepal.",
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  completed:   { label: "Completed",   color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  icon: Clock },
  upcoming:    { label: "Upcoming",    color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", icon: Layers },
  archived:    { label: "Archived",    color: "#6b7280", bg: "rgba(107,114,128,0.12)", icon: Layers },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: apiProjects = [] } = useListProjects();

  const allProjects = apiProjects.length > 0
    ? apiProjects
    : FALLBACK_PROJECTS;

  const project = allProjects.find((p: any) => p.id === id || p.slug === id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (project) {
      document.title = `${project.title} | Bishal Bishwokarma — Web Developer Nepal`;
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-black">Project not found</h1>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>This project might have been removed or the link is incorrect.</p>
          <Link href="/#latest-projects">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(90deg, #06b6d4, #2563eb)" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const sc = STATUS_CONFIG[project.status] ?? STATUS_CONFIG["in-progress"];
  const StatusIcon = sc.icon;
  const techList = project.tech_stack ? project.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden z-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10">

          {/* Back link */}
          <Link href="/#latest-projects">
            <button className="inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all hover:gap-3" style={{ color: "hsl(var(--muted-foreground))" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </button>
          </Link>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40` }}>
            <StatusIcon className="w-3.5 h-3.5" />
            {sc.label}
          </div>

          <h1 className="font-black mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15 }}>
            {project.title}
          </h1>

          {project.description && (
            <p className="text-lg leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))", maxWidth: 680 }}>
              {project.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {project.link_url && (
              <a href={project.link_url} target="_blank" rel="noreferrer">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(90deg, #06b6d4, #2563eb)" }}>
                  <ExternalLink className="w-4 h-4" /> View Live Project
                </button>
              </a>
            )}
            <a href={`https://wa.me/9779802485583?text=${encodeURIComponent(`Hi Bishal! I saw your project "${project.title}" and I'd like something similar built for me.`)}`} target="_blank" rel="noreferrer">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", color: "#25D366" }}>
                <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2C8.268 2 2 8.268 2 16c0 2.444.655 4.738 1.796 6.718L2 30l7.55-1.773A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.29 18.883c-.344-.172-2.04-1.006-2.355-1.12-.315-.114-.544-.172-.773.172-.229.344-.886 1.12-1.086 1.35-.2.229-.4.258-.744.086-.344-.172-1.452-.535-2.765-1.706-1.022-.912-1.713-2.04-1.913-2.384-.2-.344-.021-.53.15-.702.155-.154.344-.4.516-.601.172-.201.229-.344.344-.573.115-.23.057-.43-.028-.602-.086-.172-.773-1.864-1.058-2.553-.279-.672-.562-.58-.773-.591l-.659-.011a1.264 1.264 0 0 0-.916.43c-.315.344-1.2 1.173-1.2 2.86 0 1.688 1.229 3.318 1.4 3.547.172.229 2.42 3.697 5.863 5.185.82.354 1.46.566 1.958.724.823.26 1.572.223 2.163.135.66-.099 2.04-.834 2.327-1.638.286-.803.286-1.49.2-1.638-.086-.143-.315-.229-.659-.4z"/></svg>
                Build Something Similar
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      {project.images && project.images.length > 0 && (
        <section className="py-10 z-10" style={{ background: "hsl(var(--muted))" }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className={`grid gap-4 ${project.images.length === 1 ? "grid-cols-1" : project.images.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
              {project.images.map((img: string, idx: number) => (
                <div key={idx} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto block" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Details */}
      <section className="py-16 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Long description */}
            <div className="md:col-span-2 space-y-8">
              {(project as any).long_description && (
                <div>
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5" style={{ color: "#06b6d4" }} /> About this Project
                  </h2>
                  <p className="leading-relaxed text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {(project as any).long_description}
                  </p>
                </div>
              )}
              {!(project as any).long_description && project.description && (
                <div>
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5" style={{ color: "#06b6d4" }} /> About this Project
                  </h2>
                  <p className="leading-relaxed text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {project.description}
                  </p>
                </div>
              )}

              {(project as any).challenges && (
                <div>
                  <h2 className="text-xl font-black mb-4">Challenges Solved</h2>
                  <p className="leading-relaxed text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {(project as any).challenges}
                  </p>
                </div>
              )}

              {(project as any).results && (
                <div className="p-5 rounded-2xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <h2 className="text-lg font-black mb-3 flex items-center gap-2" style={{ color: "#10b981" }}>
                    <Star className="w-4 h-4 fill-current" /> Results & Impact
                  </h2>
                  <p className="leading-relaxed text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {(project as any).results}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {techList.length > 0 && (
                <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
                  <h3 className="text-sm font-black mb-4 tracking-widest uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {techList.map((tech: string) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8" }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid rgba(128,128,128,0.15)" }}>
                <h3 className="text-sm font-black mb-4 tracking-widest uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>Want something similar?</h3>
                <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>I build custom projects like this for businesses across Nepal. Fast delivery, affordable pricing.</p>
                <a href="/#contact">
                  <button className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(90deg, #06b6d4, #2563eb)" }}>
                    Hire Me
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
