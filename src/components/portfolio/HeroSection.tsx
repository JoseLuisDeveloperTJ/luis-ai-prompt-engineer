import { Brain, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleSphere from './ParticleSphere';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleSphere />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-fade-in">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-mono">Full-Stack AI Engineer | Data & Automation Architect</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Building the Future
          <br />
          <span className="text-gradient">with Intelligence</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
Architecting and deploying Full-Stack AI systems, LLMs, and automated data pipelines that solve real-world problems through intelligent engineering.
        </p>

        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button variant="hero" size="lg" asChild>
            <a href="#projects">View Projects</a>
          </Button>
          <Button variant="hero-outline" size="lg" asChild>
            <a href="#contact">Get in Touch</a>
          </Button>
        </div>
      </div>

      <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce">
        <ArrowDown className="h-6 w-6" />
      </a>
    </section>
  );
}
