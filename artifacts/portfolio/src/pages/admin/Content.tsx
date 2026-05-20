import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2, Database, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

type Section = "hero" | "about" | "skills" | "services" | "contact" | "education";

const SECTIONS: { id: Section; label: string; emoji: string }[] = [
  { id: "hero",      label: "Hero",      emoji: "🏠" },
  { id: "about",     label: "About",     emoji: "👤" },
  { id: "skills",    label: "Skills",    emoji: "⚡" },
  { id: "services",  label: "Services",  emoji: "💼" },
  { id: "contact",   label: "Contact",   emoji: "📬" },
  { id: "education", label: "Education", emoji: "🎓" },
];

function apiPut(section: string, data: any) {
  const token = localStorage.getItem("bishals_hub_token");
  return fetch(`/api/content/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export default function AdminContent() {
  const { toast } = useToast();
  const [active, setActive] = useState<Section>("hero");
  const [content, setContent] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {});
  }, []);

  const save = async (sectionKey: string, data: any) => {
    setSaving(true);
    try {
      const r = await apiPut(sectionKey, data);
      if (!r.ok) throw new Error("Failed to save");
      setContent((prev: any) => ({ ...prev, [sectionKey]: data }));
      toast({ title: "Saved!", description: `${sectionKey} section updated on the homepage.` });
    } catch {
      toast({ title: "Save failed", description: "Make sure the site_content table exists in Supabase.", variant: "destructive" });
    }
    setSaving(false);
  };

  const setupTable = async () => {
    setSetupLoading(true);
    const token = localStorage.getItem("bishals_hub_token");
    try {
      const r = await fetch("/api/content/setup-table", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (d.success) {
        toast({ title: "Database setup complete!", description: "site_content table created. You can now save content." });
      } else {
        toast({ title: "Auto-setup failed", description: d.sql ? "Run the SQL shown below manually in Supabase." : d.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Setup error", variant: "destructive" });
    }
    setSetupLoading(false);
  };

  const SQL = `CREATE TABLE IF NOT EXISTS site_content (\n  section TEXT PRIMARY KEY,\n  content JSONB NOT NULL DEFAULT '{}',\n  updated_at TIMESTAMPTZ DEFAULT now()\n);`;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Content Management</h1>
        <p className="text-muted-foreground text-sm">Edit every section of your homepage directly from the admin panel.</p>
      </div>

      {/* DB Setup notice */}
      <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
        <button
          onClick={() => setShowSetup(!showSetup)}
          className="flex items-center gap-2 text-yellow-400 font-semibold text-sm w-full text-left"
        >
          <Database className="w-4 h-4" />
          First time? Setup the database table
          {showSetup ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </button>
        {showSetup && (
          <div className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">Run this SQL in your Supabase SQL editor (or click Auto-Setup):</p>
            <pre className="text-xs bg-black/40 rounded-lg p-3 overflow-x-auto text-green-400 whitespace-pre-wrap">{SQL}</pre>
            <Button size="sm" onClick={setupTable} disabled={setupLoading} className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30">
              {setupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Database className="w-3.5 h-3.5 mr-2" />}
              Try Auto-Setup
            </Button>
          </div>
        )}
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 flex-wrap mb-6">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${active === s.id ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"}`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Section editors */}
      {active === "hero" && (
        <HeroEditor data={content.hero || {}} onSave={(d) => save("hero", d)} saving={saving} />
      )}
      {active === "about" && (
        <AboutEditor data={content.about || {}} onSave={(d) => save("about", d)} saving={saving} />
      )}
      {active === "skills" && (
        <SkillsEditor data={content.skills || {}} onSave={(d) => save("skills", d)} saving={saving} />
      )}
      {active === "services" && (
        <ServicesEditor data={content.services || []} onSave={(d) => save("services", d)} saving={saving} />
      )}
      {active === "contact" && (
        <ContactEditor data={content.contact || {}} onSave={(d) => save("contact", d)} saving={saving} />
      )}
      {active === "education" && (
        <EducationEditor data={content.education || []} onSave={(d) => save("education", d)} saving={saving} />
      )}
    </AdminLayout>
  );
}

/* ────────────────────────────────── Hero Editor ─────────────────────────────────── */
function HeroEditor({ data, onSave, saving }: { data: any; onSave: (d: any) => void; saving: boolean }) {
  const [f, setF] = useState({ title: data.title || "", badge: data.badge || "", bio: data.bio || "" });
  useEffect(() => { setF({ title: data.title || "", badge: data.badge || "", bio: data.bio || "" }); }, [data]);
  return (
    <EditorCard title="Hero Section" desc="The big heading and intro text at the top of your homepage.">
      <Field label="Main Heading">
        <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="I build powerful web apps & digital solutions" className="bg-background border-white/10 focus:border-primary" />
      </Field>
      <Field label="Badge / Tagline">
        <Input value={f.badge} onChange={(e) => setF({ ...f, badge: e.target.value })} placeholder="IT Student · Web App Developer · Designer" className="bg-background border-white/10 focus:border-primary" />
      </Field>
      <Field label="Bio Text">
        <Textarea value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} rows={3} className="bg-background border-white/10 focus:border-primary resize-none" placeholder="Short description about yourself..." />
      </Field>
      <SaveBtn saving={saving} onClick={() => onSave(f)} />
    </EditorCard>
  );
}

/* ────────────────────────────────── About Editor ─────────────────────────────────── */
function AboutEditor({ data, onSave, saving }: { data: any; onSave: (d: any) => void; saving: boolean }) {
  const [text, setText] = useState(data.text || "");
  useEffect(() => { setText(data.text || ""); }, [data]);
  return (
    <EditorCard title="About Section" desc="The paragraph describing who you are.">
      <Field label="About Me Text">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="bg-background border-white/10 focus:border-primary resize-none" placeholder="Write about yourself..." />
      </Field>
      <SaveBtn saving={saving} onClick={() => onSave({ text })} />
    </EditorCard>
  );
}

/* ────────────────────────────────── Skills Editor ─────────────────────────────────── */
function SkillsEditor({ data, onSave, saving }: { data: any; onSave: (d: any) => void; saving: boolean }) {
  const [prog, setProg] = useState<{ icon: string; label: string }[]>(data.programming || []);
  const [tools, setTools] = useState<{ icon: string; label: string }[]>(data.tools || []);
  const [other, setOther] = useState<{ icon: string; label: string }[]>(data.other || []);
  useEffect(() => { setProg(data.programming || []); setTools(data.tools || []); setOther(data.other || []); }, [data]);

  const addItem = (list: any[], setList: any) => setList([...list, { icon: "●", label: "" }]);
  const removeItem = (list: any[], setList: any, i: number) => setList(list.filter((_: any, idx: number) => idx !== i));
  const updateItem = (list: any[], setList: any, i: number, field: string, val: string) =>
    setList(list.map((item: any, idx: number) => idx === i ? { ...item, [field]: val } : item));

  const SkillList = ({ title, items, setItems }: { title: string; items: any[]; setItems: any }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</Label>
        <Button size="sm" variant="outline" onClick={() => addItem(items, setItems)} className="h-7 text-xs border-white/10 bg-transparent">
          <Plus className="w-3 h-3 mr-1" />Add
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={item.icon} onChange={(e) => updateItem(items, setItems, i, "icon", e.target.value)} className="w-14 bg-background border-white/10 text-center text-sm" placeholder="⊞" />
          <Input value={item.label} onChange={(e) => updateItem(items, setItems, i, "label", e.target.value)} className="flex-1 bg-background border-white/10 text-sm" placeholder="Skill name" />
          <Button size="sm" variant="ghost" onClick={() => removeItem(items, setItems, i)} className="w-8 h-8 p-0 text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      ))}
    </div>
  );

  return (
    <EditorCard title="Skills Section" desc="Programming skills, tools, and other abilities.">
      <SkillList title="Programming" items={prog} setItems={setProg} />
      <SkillList title="Tools & Platforms" items={tools} setItems={setTools} />
      <SkillList title="Other Skills" items={other} setItems={setOther} />
      <SaveBtn saving={saving} onClick={() => onSave({ programming: prog, tools, other })} />
    </EditorCard>
  );
}

/* ────────────────────────────────── Services Editor ─────────────────────────────────── */
function ServicesEditor({ data, onSave, saving }: { data: any[]; onSave: (d: any) => void; saving: boolean }) {
  const [cards, setCards] = useState<any[]>(Array.isArray(data) ? data : []);
  useEffect(() => { setCards(Array.isArray(data) ? data : []); }, [data]);

  const add = () => setCards([...cards, { icon: "🔧", title: "", price: "", description: "", tag: "", tagColor: "", featured: false }]);
  const remove = (i: number) => setCards(cards.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: any) => setCards(cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  return (
    <EditorCard title="Services & Pricing" desc="Your freelance service offerings displayed as cards.">
      <div className="space-y-4">
        {cards.map((card, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-background/60 p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card #{i + 1}</span>
              <Button size="sm" variant="ghost" onClick={() => remove(i)} className="h-7 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="w-3 h-3 mr-1" />Remove</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon (emoji)">
                <Input value={card.icon} onChange={(e) => update(i, "icon", e.target.value)} className="bg-background border-white/10" placeholder="🔧" />
              </Field>
              <Field label="Tag (optional)">
                <Input value={card.tag} onChange={(e) => update(i, "tag", e.target.value)} className="bg-background border-white/10" placeholder="Most Popular" />
              </Field>
            </div>
            <Field label="Title">
              <Input value={card.title} onChange={(e) => update(i, "title", e.target.value)} className="bg-background border-white/10" placeholder="Service title" />
            </Field>
            <Field label="Price">
              <Input value={card.price} onChange={(e) => update(i, "price", e.target.value)} className="bg-background border-white/10" placeholder="Rs. 10,000" />
            </Field>
            <Field label="Description">
              <Textarea value={card.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} className="bg-background border-white/10 resize-none text-sm" placeholder="Brief description..." />
            </Field>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Label className="text-xs">Tag Color</Label>
                <select value={card.tagColor} onChange={(e) => update(i, "tagColor", e.target.value)} className="bg-background border border-white/10 rounded px-2 py-1 text-xs text-foreground">
                  <option value="">None</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={card.featured} onChange={(e) => update(i, "featured", e.target.checked)} className="accent-primary" />
                Featured card
              </label>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground">
        <Plus className="w-3.5 h-3.5 mr-1.5" />Add Service Card
      </Button>
      <SaveBtn saving={saving} onClick={() => onSave(cards)} />
    </EditorCard>
  );
}

/* ────────────────────────────────── Contact Editor ─────────────────────────────────── */
function ContactEditor({ data, onSave, saving }: { data: any; onSave: (d: any) => void; saving: boolean }) {
  const [f, setF] = useState({ email: "", phone: "", location: "", facebook: "", linkedin: "", whatsapp: "", ...data });
  useEffect(() => { setF({ email: "", phone: "", location: "", facebook: "", linkedin: "", whatsapp: "", ...data }); }, [data]);
  const upd = (k: string, v: string) => setF({ ...f, [k]: v });
  return (
    <EditorCard title="Contact Info" desc="Your email, phone, location and social links shown in the Contact section.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email"><Input value={f.email} onChange={(e) => upd("email", e.target.value)} className="bg-background border-white/10" placeholder="you@email.com" /></Field>
        <Field label="Phone"><Input value={f.phone} onChange={(e) => upd("phone", e.target.value)} className="bg-background border-white/10" placeholder="9800000000" /></Field>
        <Field label="Location"><Input value={f.location} onChange={(e) => upd("location", e.target.value)} className="bg-background border-white/10" placeholder="Kathmandu, Nepal" /></Field>
        <Field label="WhatsApp Number"><Input value={f.whatsapp} onChange={(e) => upd("whatsapp", e.target.value)} className="bg-background border-white/10" placeholder="9800000000" /></Field>
        <Field label="Facebook URL"><Input value={f.facebook} onChange={(e) => upd("facebook", e.target.value)} className="bg-background border-white/10" placeholder="https://facebook.com/..." /></Field>
        <Field label="LinkedIn URL"><Input value={f.linkedin} onChange={(e) => upd("linkedin", e.target.value)} className="bg-background border-white/10" placeholder="https://linkedin.com/in/..." /></Field>
      </div>
      <SaveBtn saving={saving} onClick={() => onSave(f)} />
    </EditorCard>
  );
}

/* ────────────────────────────────── Education Editor ─────────────────────────────────── */
function EducationEditor({ data, onSave, saving }: { data: any[]; onSave: (d: any) => void; saving: boolean }) {
  const [items, setItems] = useState<{ period: string; title: string; school: string }[]>(Array.isArray(data) ? data : []);
  useEffect(() => { setItems(Array.isArray(data) ? data : []); }, [data]);
  const add = () => setItems([...items, { period: "", title: "", school: "" }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: string, val: string) => setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  return (
    <EditorCard title="Education" desc="Your academic background displayed in the timeline.">
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-background/60 p-4 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground font-medium">Entry #{i + 1}</span>
              <Button size="sm" variant="ghost" onClick={() => remove(i)} className="h-7 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="w-3 h-3 mr-1" />Remove</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <Field label="Period">
                <Input value={item.period} onChange={(e) => update(i, "period", e.target.value)} className="bg-background border-white/10 text-sm" placeholder="2021-2023" />
              </Field>
              <Field label="Degree / Level">
                <Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} className="bg-background border-white/10 text-sm" placeholder="Bachelor in IT" />
              </Field>
            </div>
            <Field label="School / College">
              <Input value={item.school} onChange={(e) => update(i, "school", e.target.value)} className="bg-background border-white/10 text-sm" placeholder="College name, City" />
            </Field>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={add} className="border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground">
        <Plus className="w-3.5 h-3.5 mr-1.5" />Add Entry
      </Button>
      <SaveBtn saving={saving} onClick={() => onSave(items)} />
    </EditorCard>
  );
}

/* ────────────────────────────────── Shared UI ─────────────────────────────────── */
function EditorCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card className="bg-card border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</Label>
      {children}
    </div>
  );
}

function SaveBtn({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <div className="pt-2 border-t border-white/10">
      <Button onClick={onClick} disabled={saving} className="bg-primary hover:bg-primary/90 text-black font-bold">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Save Changes
      </Button>
    </div>
  );
}
