const skillCategories = [
  {
    title: 'AI & ML',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Hugging Face', 'LangChain', 'OpenAI API'],
  },
  {
    title: 'Languages',
    skills: ['Python', 'TypeScript', 'SQL', 'R', 'Rust'],
  },
  {
    title: 'Cloud & MLOps',
    skills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'MLflow', 'Airflow'],
  },
  {
    title: 'Data & Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Pinecone', 'Weaviate'],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Tech <span className="text-gradient">Stack</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.title} className="p-6 rounded-xl card-gradient border border-border/50">
              <h3 className="text-sm font-mono text-primary mb-4">{`// ${cat.title}`}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs font-mono rounded-md bg-secondary text-secondary-foreground border border-border/50 hover:border-primary/30 hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
