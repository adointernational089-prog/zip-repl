import { useCallback, useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ProjectDetail from "@/pages/ProjectDetail";
import AdminOverview from "@/pages/admin/Overview";
import AdminMessages from "@/pages/admin/Messages";
import AdminApps from "@/pages/admin/Apps";
import AdminUsers from "@/pages/admin/Users";
import AdminProjects from "@/pages/admin/Projects";
import AdminContent from "@/pages/admin/Content";
import AdminThemes from "@/pages/admin/Themes";
import AdminSettings from "@/pages/admin/Settings";
import AdminBroadcast from "@/pages/admin/Broadcast";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/admin" component={AdminOverview} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/apps" component={AdminApps} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/themes" component={AdminThemes} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/broadcast" component={AdminBroadcast} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const [showLoader, setShowLoader] = useState(() => {
    try {
      return !sessionStorage.getItem("bb_loader_seen");
    } catch {
      return false;
    }
  });

  const handleLoaderDone = useCallback(() => {
    try { sessionStorage.setItem("bb_loader_seen", "1"); } catch {}
    setShowLoader(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <ScrollProgress />
            {showLoader && <LoadingScreen onDone={handleLoaderDone} />}
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <WhatsAppWidget />
            <ScrollToTop />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
