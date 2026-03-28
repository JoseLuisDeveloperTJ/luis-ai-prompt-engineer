import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Terminal, LogIn, LayoutDashboard } from 'lucide-react';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function PortfolioHeader() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="#" className="flex items-center gap-2 text-primary font-bold text-lg">
          <Terminal className="h-5 w-5" />
          <span className="font-mono text-sm">AI.engineer</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div>
          {user ? (
            <Button asChild variant="hero" size="sm">
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="hero-outline" size="sm">
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
