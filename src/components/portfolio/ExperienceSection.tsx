import { Briefcase } from 'lucide-react';

const experiences = [
  {
    role: 'Senior AI Engineer',
    company: 'Your Company',
    period: '2023 — Present',
    description: 'Leading AI/ML initiatives, building production LLM applications and scalable ML pipelines.',
  },
  {
    role: 'Machine Learning Engineer',
    company: 'Previous Company',
    period: '2021 — 2023',
    description: 'Developed computer vision models, NLP solutions, and deployed ML models to production.',
  },
  {
    role: 'Data Scientist',
    company: 'First Company',
    period: '2019 — 2021',
    description: 'Built predictive models, performed data analysis, and created dashboards for business insights.',
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Work <span className="text-gradient">Experience</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 md:text-right">
                  {i % 2 === 0 && (
                    <div className="pl-16 md:pl-0 md:pr-12">
                      <ExperienceCard {...exp} />
                    </div>
                  )}
                </div>

                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary glow mt-6" />

                <div className="flex-1">
                  {i % 2 !== 0 && (
                    <div className="pl-16 md:pl-12">
                      <ExperienceCard {...exp} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ role, company, period, description }: typeof experiences[0]) {
  return (
    <div className="p-6 rounded-xl card-gradient border border-border/50 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 text-primary text-sm font-mono mb-2">
        <Briefcase className="h-4 w-4" />
        {period}
      </div>
      <h3 className="text-lg font-semibold mb-1">{role}</h3>
      <p className="text-sm text-muted-foreground mb-3">{company}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
