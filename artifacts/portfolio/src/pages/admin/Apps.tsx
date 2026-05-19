import { useState, useRef } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useListApps, useCreateApp, useUpdateApp, useDeleteApp, getListAppsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, X, Check, Flame, ExternalLink, Upload, ImageIcon } from "lucide-react";

interface AppForm {
  name: string;
  url: string;
  icon_url: string;
  description: string;
}

const emptyForm: AppForm = { name: "", url: "", icon_url: "", description: "" };

export default function AdminApps() {
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<AppForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: apps = [], isLoading: appsLoading, refetch } = useListApps({
    query: { queryKey: getListAppsQueryKey(), enabled: !!isAdmin }
  });

  const createMutation = useCreateApp({
    mutation: {
      onSuccess: () => { toast({ title: "App created!" }); closeForm(); refetch(); },
      onError: () => toast({ title: "Error", description: "Failed to create app.", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateApp({
    mutation: {
      onSuccess: () => { toast({ title: "App updated!" }); closeForm(); refetch(); },
      onError: () => toast({ title: "Error", description: "Failed to update app.", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteApp({
    mutation: {
      onSuccess: () => { toast({ title: "App deleted." }); setDeleteConfirm(null); refetch(); },
      onError: () => toast({ title: "Error", description: "Failed to delete app.", variant: "destructive" }),
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
    setIconPreview("");
    setUploadMode("url");
  };

  const startEdit = (app: any) => {
    setEditId(app.id);
    setForm({ name: app.name, url: app.url || "", icon_url: app.icon_url || "", description: app.description || "" });
    setIconPreview(app.icon_url || "");
    setUploadMode("url");
    setShowForm(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please choose an image under 2MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setIconPreview(dataUrl);
      setForm((f) => ({ ...f, icon_url: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setForm((f) => ({ ...f, icon_url: url }));
    setIconPreview(url);
  };

  const handleSubmit = () => {
    if (!form.name) {
      toast({ title: "App name is required.", variant: "destructive" });
      return;
    }
    if (editId) {
      updateMutation.mutate({ id: editId, data: form });
    } else {
      createMutation.mutate({ data: form });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Apps</h1>
          <p className="text-muted-foreground text-sm">Manage the apps displayed in the user dashboard.</p>
        </div>
        <Button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setIconPreview(""); }}
          className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add App
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-card border-primary/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editId ? "Edit App" : "Add New App"}</h3>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>App Name <span className="text-destructive">*</span></Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My App"
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>
              <div>
                <Label>App URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://myapp.com"
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>

              {/* Icon — full width with upload/URL toggle */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>App Icon <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
                    <button
                      onClick={() => setUploadMode("url")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${uploadMode === "url" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => setUploadMode("upload")}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${uploadMode === "upload" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" />Upload
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Preview */}
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {iconPreview ? (
                      <img src={iconPreview} alt="icon preview" className="w-full h-full object-cover" onError={() => setIconPreview("")} />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="flex-1">
                    {uploadMode === "url" ? (
                      <Input
                        value={form.icon_url.startsWith("data:") ? "" : form.icon_url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://example.com/icon.png"
                        className="bg-background border-white/10 focus:border-primary"
                      />
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-white/10 hover:border-primary w-full justify-start gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {form.icon_url.startsWith("data:") ? "Image selected — click to change" : "Choose image file (max 2MB)"}
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Leave blank to use default icon</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label>Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description..."
                  className="mt-1 bg-background border-white/10 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Button onClick={handleSubmit} disabled={isPending} className="bg-primary hover:bg-primary/90 text-black font-bold">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                {editId ? "Update App" : "Create App"}
              </Button>
              <Button variant="outline" onClick={closeForm} className="border-white/10">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apps List */}
      {appsLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Flame className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No apps yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Add your first app to display it in the user dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app: any) => (
            <Card key={app.id} className="bg-card border-white/10 hover:border-white/20 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {app.icon_url ? (
                      <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <Flame className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{app.name}</h3>
                    {app.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>}
                    {app.url && (
                      <a href={app.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                        <ExternalLink className="w-3 h-3" />
                        {app.url.replace("https://", "").substring(0, 30)}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Button size="sm" variant="ghost" onClick={() => startEdit(app)} className="text-muted-foreground hover:text-primary h-7 px-2">
                    <Pencil className="w-3.5 h-3.5 mr-1" />Edit
                  </Button>
                  {deleteConfirm === app.id ? (
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-xs text-muted-foreground">Sure?</span>
                      <Button size="sm" onClick={() => deleteMutation.mutate({ id: deleteConfirm! })} disabled={deleteMutation.isPending} className="bg-destructive/20 text-destructive hover:bg-destructive/30 h-7 px-2 text-xs">
                        {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(null)} className="h-7 px-2 text-xs">Cancel</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(app.id)} className="ml-auto text-muted-foreground hover:text-destructive h-7 px-2">
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
