import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, ArrowLeft, LogIn, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ALLOWED_EMAIL = 'joseluisarteagamx@gmail.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (email.trim().toLowerCase() !== ALLOWED_EMAIL) {
      toast({ title: 'Access Denied', description: 'This dashboard is restricted.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ALLOWED_EMAIL) {
      toast({ title: 'Access Denied', description: 'Password reset is restricted to the authorized user.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Email sent!', description: 'Check your inbox for the password reset link.' });
      setForgotMode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: 'var(--gradient-hero)' }}>
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(hsl(160,84%,39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160,84%,39%) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="w-full max-w-md mx-4 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to portfolio</span>
        </Link>

        <div className="p-8 rounded-2xl card-gradient border border-border/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              {forgotMode ? <KeyRound className="h-6 w-6 text-primary" /> : <Terminal className="h-6 w-6 text-primary" />}
            </div>
            <div>
              <h1 className="text-xl font-bold">{forgotMode ? 'Reset Password' : 'Welcome Back'}</h1>
              <p className="text-sm text-muted-foreground">
                {forgotMode ? 'Enter your email to receive a reset link' : 'Sign in to your dashboard'}
              </p>
            </div>
          </div>

          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-mono">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                <KeyRound className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <button type="button" onClick={() => setForgotMode(false)} className="text-primary hover:underline">
                  Back to Sign In
                </button>
              </p>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block font-mono">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block font-mono">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={128}
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {loading ? 'Please wait...' : 'Sign In'}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                <button onClick={() => setForgotMode(true)} className="text-primary hover:underline">
                  Forgot Password?
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
