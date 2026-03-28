import { useProjects } from '@/hooks/useProjects';
import { Github, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl card-gradient border border-border/50 h-80 animate-pulse" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group rounded-xl card-gradient border border-border/50 overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                {project.cover_url && (
                  <div className="h-48 overflow-hidden">
                    {project.cover_type === 'video' ? (
                      <video src={project.cover_url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                    ) : (
                      <img src={project.cover_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>

                  {project.skills && project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs font-mono">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {project.github_link && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" />
                        Source Code
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            Projects coming soon. Stay tuned!
          </p>
        )}
      </div>
    </section>
  );
}
