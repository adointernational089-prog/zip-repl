import { useState, useRef } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { uploadProjectImage } from "@/lib/supabase";
import {
  Loader2, Plus, Pencil, Trash2, X, Check, FolderOpen,
  Upload, ImageIcon, Globe, CloudUpload
} from "lucide-react";

interface ProjectForm {
  title: string;
  description: string;
  images: string[];
  tech_stack: string;
  link_url: string;
  status: string;
  sort_order: number;
}

const emptyForm: ProjectForm = {
  title: "", description: "", images: [], tech_stack: "", link_url: "", status: "in-progress", sort_order: 0
};

export default function AdminProjects() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: projects = [], isLoading: projLoading, refetch } = useListProjects({
    query: { enabled: !!isAdmin }
  });

  const createMutation = useCreateProject({
    mutation: {
      onSuccess: () => { toast({ title: "Project created!" }); closeForm(); refetch(); },
      onError: (err: any) => toast({
        title: "Failed to create project",
        description: err?.response?.data?.error || "Please try again.",
        variant: "destructive"
      }),
    },
  });

  const updateMutation = useUpdateProject(editId || "", {
    mutation: {
      onSuccess: () => { toast({ title: "Project updated!" }); closeForm(); refetch(); },
      onError: (err: any) => toast({
        title: "Failed to update project",
        description: err?.response?.data?.error || "Please try again.",
        variant: "destructive"
      }),
    },
  });

  const deleteMutation = useDeleteProject(deleteConfirm || "", {
    mutation: {
      onSuccess: () => { toast({ title: "Project deleted." }); setDeleteConfirm(null); refetch(); },
      onError: () => toast({ title: "Error", description: "Failed to delete.", variant: "destructive" }),
    },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!user || !isAdmin) { setLocation("/dashboard"); return null; }

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setUrlInput("");
  };

  const startEdit = (proj: any) => {
    setEditId(proj.id);
    setForm({
      title: proj.title || "",
      description: proj.description || "",
      images: proj.images || [],
      tech_stack: proj.tech_stack || "",
      link_url: proj.link_url || "",
      status: proj.status || "in-progress",
      sort_order: proj.sort_order ?? 0,
    });
    setUrlInput("");
    setShowForm(true);
  };

  const addImageUrl = () => {
    if (!urlInput.trim()) return;
    setForm(f => ({ ...f, images: [...f.images, urlInput.trim()] }));
    setUrlInput("");
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 10MB.`, variant: "destructive" });
        continue;
      }
      try {
        const url = await uploadProjectImage(file);
        uploaded.push(url);
      } catch (err: any) {
        toast({
          title: "Upload failed",
          description: err.message || "Could not upload image to Supabase Storage.",
          variant: "destructive"
        });
      }
    }

    if (uploaded.length > 0) {
      setForm(f => ({ ...f, images: [...f.images, ...uploaded] }));
      toast({ title: `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded!` });
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast({ title: "Project title is required.", variant: "destructive" });
      return;
    }
    const data = { ...form, sort_order: Number(form.sort_order) || 0 };
    if (editId) {
      updateMutation.mutate({ data });
    } else {
      createMutation.mutate({ data });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Latest Projects</h1>
          <p className="text-muted-foreground text-sm">Manage projects shown on the homepage. Images are stored in Supabase Storage.</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setUrlInput(""); }}
          className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-card border-primary/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editId ? "Edit Project" : "Add New Project"}</h3>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Title <span className="text-destructive">*</span></Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="My Awesome Project"
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>
              <div>
                <Label>Live URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  placeholder="https://myproject.com"
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the project..."
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>

              <div>
                <Label>Tech Stack <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
                <Input
                  value={form.tech_stack}
                  onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL"
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>

              <div>
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm bg-background border border-white/10 text-foreground focus:border-primary outline-none"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Screenshots — Supabase Upload */}
              <div className="md:col-span-2">
                <Label className="mb-2 block">
                  Screenshots / Photos
                  <span className="ml-2 text-[10px] text-primary/60 font-normal">Uploaded to Supabase Storage</span>
                </Label>

                {/* Upload area */}
                <div
                  className="flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed border-white/15 hover:border-primary/40 transition-colors cursor-pointer mb-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Uploading to Supabase...</span>
                    </div>
                  ) : (
                    <>
                      <CloudUpload className="w-8 h-8 mb-2 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">Click to upload images</p>
                      <p className="text-xs text-muted-foreground/50 mt-1">PNG, JPG, WebP up to 10MB each</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>

                {/* Or paste URL */}
                <div className="flex gap-2 mb-3">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste an image URL..."
                    className="bg-background border-white/10 focus:border-primary flex-1 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                  />
                  <Button type="button" onClick={addImageUrl} variant="outline" className="border-white/10 hover:border-primary shrink-0 text-sm">
                    Add URL
                  </Button>
                </div>

                {/* Preview grid */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: "16/9" }}>
                        <img src={img} alt={`screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSubmit} disabled={isPending || uploading} className="bg-primary hover:bg-primary/90 text-black font-bold">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                {editId ? "Update Project" : "Create Project"}
              </Button>
              <Button variant="outline" onClick={closeForm} disabled={isPending} className="border-white/10">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      {projLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first project to showcase it on the homepage.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj: any) => (
            <Card key={proj.id} className="bg-card border-white/10 hover:border-white/20 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                    {proj.images?.[0] ? (
                      <img src={proj.images[0]} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{proj.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        proj.status === "completed" ? "bg-green-500/10 text-green-400" :
                        proj.status === "archived" ? "bg-gray-500/10 text-gray-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>{proj.status}</span>
                    </div>
                    {proj.description && <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{proj.description}</p>}
                    {proj.tech_stack && <p className="text-xs text-primary/70">{proj.tech_stack}</p>}
                    <p className="text-[10px] text-muted-foreground/50 mt-1">{proj.images?.length || 0} image{proj.images?.length !== 1 ? "s" : ""}</p>
                  </div>

                  {proj.link_url && (
                    <a href={proj.link_url} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(proj)} className="text-muted-foreground hover:text-primary h-7 px-2">
                    <Pencil className="w-3.5 h-3.5 mr-1" />Edit
                  </Button>
                  {deleteConfirm === proj.id ? (
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-xs text-muted-foreground">Delete?</span>
                      <Button size="sm" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="bg-destructive/20 text-destructive hover:bg-destructive/30 h-7 px-2 text-xs">
                        {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)} className="h-7 px-2 text-xs">Cancel</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(proj.id)} className="ml-auto text-muted-foreground hover:text-destructive h-7 px-2">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
