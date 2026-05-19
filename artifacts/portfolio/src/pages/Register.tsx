import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useRegister } from "@workspace/api-client-react";
import { Flame, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Uppercase letter (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a-z)", ok: /[a-z]/.test(password) },
    { label: "Digit (0-9)", ok: /[0-9]/.test(password) },
    { label: "Symbol (!@#$...)", ok: /[^A-Za-z0-9]/.test(password) },
    { label: "At least 8 characters", ok: password.length >= 8 },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-2 text-xs">
          {c.ok
            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            : <XCircle className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />}
          <span className={c.ok ? "text-green-400" : "text-muted-foreground"}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Welcome to Bishal's Hub!", description: "Your account has been created." });
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({ 
          title: "Registration failed", 
          description: error?.data?.message || "Could not create account. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    registerMutation.mutate({ data: { name, email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-white/10 shadow-2xl relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>Join the ecosystem to access exclusive apps</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background/50 border-white/10 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-white/10 focus-visible:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50 border-white/10 focus-visible:ring-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Strong password: Uppercase · Lowercase · Digits · Symbols
              </p>
              <PasswordStrength password={password} />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(0,191,255,0.3)]"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
