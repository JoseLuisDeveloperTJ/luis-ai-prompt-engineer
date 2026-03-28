import { Code, Cpu, Sparkles } from 'lucide-react';
import { useAboutMe } from '@/hooks/useSiteContent';

const defaultHighlights = [
  { icon: 'Cpu', title: 'Machine Learning', desc: 'Deep learning, NLP, computer vision' },
  { icon: 'Code', title: 'Full Stack AI', desc: 'End-to-end ML system design' },
  { icon: 'Sparkles', title: 'LLM Applications', desc: 'RAG, fine-tuning, prompt engineering' },
];

const iconMap: Record<string, any> = { Cpu, Code, Sparkles };

export default function AboutSection() {
  const { data: aboutData } = useAboutMe();

  const content = aboutData?.content || "I'm an AI Engineer passionate about building intelligent systems that make a difference. With expertise in machine learning, deep learning, and natural language processing, I bridge the gap between cutting-edge research and production-ready applications.\n\nFrom training custom LLMs to deploying scalable ML pipelines, I bring ideas to life with clean code and robust architecture.";

  const highlights = aboutData?.highlights && Array.isArray(aboutData.highlights) && (aboutData.highlights as any[]).length > 0
    ? (aboutData.highlights as any[])
    : defaultHighlights;

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          About <span className="text-gradient">Me</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {content.split('\n\n').map((p, i) => (
              <p key={i} className="text-muted-foreground text-lg leading-relaxed mb-6">{p}</p>
            ))}
          </div>

          <div className="grid gap-4">
            {highlights.map((item: any) => {
              const Icon = iconMap[item.icon] || Sparkles;
              return (
                <div key={item.title} className="flex items-start gap-4 p-5 rounded-xl card-gradient border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
