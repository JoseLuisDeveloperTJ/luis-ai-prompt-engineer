import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 border-t border-border/50">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono">AI.engineer</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
