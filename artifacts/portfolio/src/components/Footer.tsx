import { Link } from "wouter";
import { Flame, Github, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-card/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">Bishal's Hub</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Building digital solutions that matter. Student, developer, and future entrepreneur from Kathmandu, Nepal.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-primary transition-colors">Skills</a></li>
              <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:bishalbishwokarma089@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:9802485583" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
            <a href="mailto:bishalbishwokarma089@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              bishalbishwokarma089@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 BishalBishwokarma. All rights reserved.</p>
          <p>Built with React + Tailwind ❤</p>
        </div>
      </div>
    </footer>
  );
}
