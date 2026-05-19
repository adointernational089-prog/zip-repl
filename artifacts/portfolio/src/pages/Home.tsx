import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSendMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Code2, Globe, Server, Database, Brain, Zap, Shield, Star,
  Github, ExternalLink, Mail, Phone, MapPin, GraduationCap,
  Briefcase, Terminal, Cpu, Layers, Smartphone, ChevronRight,
  ArrowRight, Sparkles, Flame
} from "lucide-react";

const skills = [
  { category: "Frontend", icon: Globe, items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"] },
  { category: "Backend", icon: Server, items: ["Node.js", "Express", "Python", "REST APIs", "GraphQL"] },
  { category: "Database", icon: Database, items: ["PostgreSQL", "MongoDB", "Supabase", "Redis", "Drizzle ORM"] },
  { category: "DevOps", icon: Terminal, items: ["Docker", "Linux", "Git", "CI/CD", "Nginx"] },
  { category: "AI/ML", icon: Brain, items: ["TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Scikit-learn"] },
  { category: "Mobile", icon: Smartphone, items: ["React Native", "Expo", "iOS", "Android"] },
];

const projects = [
  {
    title: "Bishal's Hub",
    description: "A full-stack SaaS portfolio platform with user authentication, admin panel, and messaging system.",
    tech: ["React", "TypeScript", "Express", "PostgreSQL"],
    live: "#",
    github: "#",
    featured: true,
  },
  {
    title: "AI Chat Assistant",
    description: "An intelligent chat assistant powered by OpenAI with context-aware responses and conversation history.",
    tech: ["Next.js", "OpenAI", "Supabase", "Tailwind"],
    live: "#",
    github: "#",
    featured: true,
  },
  {
    title: "E-Commerce Platform",
    description: "Full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    live: "#",
    github: "#",
    featured: false,
  },
  {
    title: "Task Manager Pro",
    description: "A productivity app with real-time collaboration, Kanban boards, and smart notifications.",
    tech: ["React", "WebSockets", "PostgreSQL", "Redis"],
    live: "#",
    github: "#",
    featured: false,
  },
];

const services = [
  { icon: Globe, title: "Web Development", desc: "Crafting fast, responsive, and beautiful web apps using modern stacks." },
  { icon: Smartphone, title: "Mobile Development", desc: "Cross-platform mobile apps with React Native and Expo." },
  { icon: Server, title: "API Development", desc: "Scalable RESTful and GraphQL APIs for your product's backend." },
  { icon: Brain, title: "AI Integration", desc: "Integrating LLMs and ML models into real-world applications." },
  { icon: Shield, title: "Security & Auth", desc: "Secure authentication systems, JWT, OAuth, and data protection." },
  { icon: Cpu, title: "System Design", desc: "Architecting scalable, maintainable software systems from the ground up." },
];

const education = [
  {
    degree: "Secondary Education (SEE)",
    school: "Shree Janajyoti Secondary School",
    year: "2024",
    location: "Kathmandu, Nepal",
    gpa: "3.6 GPA",
  },
];

export default function Home() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const sendMsgMutation = useSendMessage({
    mutation: {
      onSuccess: () => {
        toast({ title: "Message sent!", description: "I'll get back to you shortly." });
        setContactForm({ name: "", email: "", message: "" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send message. Try again.", variant: "destructive" });
      },
    },
  });

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    sendMsgMutation.mutate({ data: contactForm });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,191,255,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(0,191,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-mono text-sm tracking-widest uppercase">Full Stack Developer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
              Hi, I'm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-purple-400 drop-shadow-[0_0_30px_rgba(0,191,255,0.5)]">
                Bishal
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              Building digital products that <span className="text-primary">make a difference</span>
            </p>
            <p className="text-muted-foreground max-w-2xl mb-10 text-lg leading-relaxed">
              Student developer & future entrepreneur from Kathmandu, Nepal. Passionate about
              creating scalable web applications, AI integrations, and SaaS products.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_25px_rgba(0,191,255,0.4)] hover:shadow-[0_0_40px_rgba(0,191,255,0.6)] transition-all px-8">
                  View Projects <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="border-white/20 hover:border-primary hover:text-primary font-semibold px-8 transition-all">
                  Get In Touch
                </Button>
              </a>
              <Link href="/login">
                <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-primary font-semibold px-8 transition-all">
                  <Flame className="mr-2 w-4 h-4" />
                  My Apps Hub
                </Button>
              </Link>
            </div>
            <div className="flex gap-8 mt-16">
              {[["5+", "Projects"], ["2+", "Years Coding"], ["∞", "Curiosity"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-black text-primary">{num}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeader label="Who I Am" title="About Me" />
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <div className="relative">
                <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-[120px] select-none">👨‍💻</div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-primary/10 border border-primary/30 rounded-xl p-4 backdrop-blur">
                  <p className="text-xs text-primary font-mono">Available for projects</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-semibold">Open to work</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Bishal Bishwokarma</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                I'm a passionate full-stack developer and aspiring entrepreneur based in Kathmandu, Nepal.
                I specialize in building modern web applications, APIs, and SaaS products using cutting-edge technologies.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                When I'm not coding, I'm exploring AI/ML concepts, learning new frameworks,
                or working on side projects that solve real-world problems.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, text: "Kathmandu, Nepal" },
                  { icon: Mail, text: "bishalbishwokarma089@gmail.com" },
                  { icon: Phone, text: "+977 9802485583" },
                  { icon: GraduationCap, text: "Student Developer" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <a href="https://github.com" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="border-white/20 hover:border-primary hover:text-primary">
                    <Github className="w-4 h-4 mr-2" />GitHub
                  </Button>
                </a>
                <a href="mailto:bishalbishwokarma089@gmail.com">
                  <Button variant="outline" size="sm" className="border-white/20 hover:border-primary hover:text-primary">
                    <Mail className="w-4 h-4 mr-2" />Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 scroll-mt-16 bg-card/30">
        <div className="container mx-auto px-4">
          <SectionHeader label="What I Know" title="Skills & Technologies" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {skills.map(({ category, icon: Icon, items }) => (
              <Card key={category} className="bg-card border-white/10 hover:border-primary/50 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Badge key={item} variant="secondary" className="bg-white/5 text-foreground/80 hover:bg-primary/20 hover:text-primary transition-colors text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeader label="What I've Built" title="Featured Projects" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {projects.map((project) => (
              <Card key={project.title} className={`bg-card border-white/10 hover:border-primary/50 transition-all group overflow-hidden ${project.featured ? "ring-1 ring-primary/30" : ""}`}>
                {project.featured && (
                  <div className="px-6 pt-4 flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-400 font-mono uppercase tracking-widest">Featured</span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                    {project.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <Badge key={t} className="bg-primary/10 text-primary border-primary/20 text-xs">{t}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={project.github} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Github className="w-3.5 h-3.5" /> Code
                    </a>
                    <a href={project.live} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 scroll-mt-16 bg-card/30">
        <div className="container mx-auto px-4">
          <SectionHeader label="What I Offer" title="Services" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="bg-background border-white/10 hover:border-primary/50 transition-all group p-6">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <SectionHeader label="Academic Background" title="Education" />
          <div className="max-w-2xl mx-auto">
            {education.map((edu) => (
              <Card key={edu.degree} className="bg-card border-white/10 hover:border-primary/50 transition-all p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-primary font-medium">{edu.school}</p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{edu.location}</span>
                      <span>{edu.year}</span>
                      <span className="text-green-400">{edu.gpa}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 scroll-mt-16 bg-card/30">
        <div className="container mx-auto px-4">
          <SectionHeader label="Let's Talk" title="Get In Touch" />
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Have a project in mind or want to collaborate? I'd love to hear from you.
                Fill out the form and I'll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "bishalbishwokarma089@gmail.com" },
                  { icon: Phone, label: "Phone", value: "+977 9802485583" },
                  { icon: MapPin, label: "Location", value: "Kathmandu, Nepal" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                      <p className="font-medium text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-card border-white/10">
              <CardContent className="p-6">
                <form onSubmit={handleContact} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-1 bg-background border-white/10 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="mt-1 bg-background border-white/10 focus:border-primary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      rows={4}
                      className="mt-1 bg-background border-white/10 focus:border-primary resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold shadow-[0_0_15px_rgba(0,191,255,0.3)]"
                    disabled={sendMsgMutation.isPending}
                  >
                    {sendMsgMutation.isPending ? "Sending..." : "Send Message"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px w-8 bg-primary/50" />
        <span className="text-primary font-mono text-xs tracking-widest uppercase">{label}</span>
        <div className="h-px w-8 bg-primary/50" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black">{title}</h2>
    </div>
  );
}
