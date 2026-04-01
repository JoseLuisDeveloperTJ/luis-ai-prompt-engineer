import { useSkills } from '@/hooks/useSiteContent';
import TiltCard from '@/components/ui/TiltCard';


const fallbackSkills = [
  { title: 'AI & ML', skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Hugging Face', 'LangChain'] },
  { title: 'Languages', skills: ['Python', 'TypeScript', 'SQL', 'R'] },
  { title: 'Cloud & MLOps', skills: ['AWS', 'GCP', 'Docker', 'Kubernetes'] },
  { title: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Pinecone'] },
];

export default function SkillsSection() {
  const { data: dbSkills } = useSkills();

  const categories = dbSkills && dbSkills.length > 0
    ? Object.entries(
        dbSkills.reduce<Record<string, string[]>>((acc, s) => {
          if (!acc[s.category]) acc[s.category] = [];
          acc[s.category].push(s.name);
          return acc;
        }, {})
      ).map(([title, skills]) => ({ title, skills }))
    : fallbackSkills;

  return (
    <section id="skills" className="py-24 bg-secondary/20">
     
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tech <span className="text-gradient">Stack</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
             <TiltCard>
            <div key={cat.title} className="p-6 rounded-xl card-gradient border border-border/50">
              <h3 className="text-sm font-mono text-primary mb-4">{`// ${cat.title}`}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill}
                    className="px-3 py-1.5 text-xs font-mono rounded-md bg-secondary text-secondary-foreground border border-border/50 hover:border-primary/30 hover:text-primary transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
               
            </div>
            </TiltCard> 
          ))}
            
        </div>
          
      </div>

    </section>
  );
}
