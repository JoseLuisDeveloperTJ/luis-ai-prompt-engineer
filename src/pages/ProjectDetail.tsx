import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProjectImages } from '@/hooks/useSiteContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import Footer from '@/components/portfolio/Footer';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: gallery } = useProjectImages(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-mono">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/" className="text-primary hover:underline">Back to portfolio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PortfolioHeader />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/#projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to projects</span>
          </Link>

          {/* Cover */}
          {project.cover_url && (
            <div className="rounded-2xl overflow-hidden mb-8 border border-border/50">
              {project.cover_type === 'video' ? (
                <video src={project.cover_url} className="w-full max-h-[500px] object-cover" controls muted autoPlay loop playsInline />
              ) : (
                <img src={project.cover_url} alt={project.name} className="w-full max-h-[500px] object-cover" />
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.name}</h1>

          {/* Description */}
          {project.description && (
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-sm font-mono px-3 py-1.5">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* GitHub */}
          {project.github_link && (
            <div className="mb-8">
              <Button variant="hero-outline" asChild>
                <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          )}

          {/* Gallery */}
          {gallery && gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gallery.map((img) => (
                  <div key={img.id} className="rounded-xl overflow-hidden border border-border/50">
                    <img src={img.image_url} alt="Project gallery" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
