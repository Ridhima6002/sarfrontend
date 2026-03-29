import { useState } from "react";
import { AlertTriangle, LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";

// Mock Indian User Credentials Database
const MOCK_USERS = [
  {
    email: "junior@barclays.in",
    password: "JuniorPass@123",
    name: "Rajesh Kumar",
    role: "Junior Analyst" as const,
    department: "AML Compliance",
  },
  {
    email: "senior@barclays.in",
    password: "SeniorPass@123",
    name: "Priya Sharma",
    role: "Senior Analyst" as const,
    department: "Financial Crimes",
  },
  {
    email: "analyst@barclays.in",
    password: "AnalystPass@123",
    name: "Arjun Patel",
    role: "Junior Analyst" as const,
    department: "Risk Management",
  },
];

export default function Login({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { toast } = useToast();
  const { saveProfile } = useProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

    if (!user) {
      setLoading(false);
      toast({
        title: "Authentication failed",
        description: "Invalid email or password. Check the mock credentials below.",
        variant: "destructive",
      });
      return;
    }

    // Successful login - save profile with authenticated user info
    const authenticatedProfile = {
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: "+91 XXXX-XXXX",
      photoUrl: "",
      isVerified: true,
      department: user.department,
    };

    saveProfile(authenticatedProfile);
    setLoading(false);
    
    toast({
      title: "Login successful",
      description: `Welcome, ${user.name}! Logged in as ${user.role}.`,
    });

    onLoginSuccess();
  };

  const handleTestLogin = (email: string) => {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      setEmail(email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md space-y-6 animate-slide-in">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">SAR Guardian</h1>
          <p className="text-sm text-muted-foreground">
            Role-Based Access Control System
          </p>
          <Badge className="mx-auto gap-1.5 mt-2 bg-blue-500/10 border-blue-500/20 text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Mock Authentication (India)
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>
              Authenticate as Junior or Senior Analyst using mock credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="user@barclays.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-9 bg-slate-900/50 border-slate-700 focus:border-primary"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-9 bg-slate-900/50 border-slate-700 focus:border-primary"
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Mock Credentials Section */}
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <CardTitle className="text-sm text-yellow-600">Mock Credentials</CardTitle>
            </div>
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-xs text-yellow-600 hover:text-yellow-500 underline ml-auto"
            >
              {showCredentials ? "Hide" : "Show"}
            </button>
          </CardHeader>
          {showCredentials && (
            <CardContent className="space-y-3">
              {MOCK_USERS.map((user) => (
                <div
                  key={user.email}
                  onClick={() => handleTestLogin(user.email)}
                  className="p-3 rounded-lg bg-slate-900/40 border border-yellow-500/20 hover:border-yellow-500/40 cursor-pointer transition-all hover:bg-yellow-500/5 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-xs font-semibold text-white group-hover:text-yellow-400">
                      {user.name}
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    {user.password}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{user.department}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full text-xs h-7 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/40"
                  >
                    Use this account
                  </Button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Info Footer */}
        <div className="text-center space-y-1 text-xs text-muted-foreground px-4 py-3 rounded-lg bg-slate-700/20">
          <p>🇮🇳 Indian User Authentication Demo</p>
          <p>Testing role-based access control in Review Queue</p>
        </div>
      </div>
    </div>
  );
}
