import { GraduationCap } from 'lucide-react';
import { useEducation } from '@/hooks/useSiteContent';

const fallbackEducation = [
  { id: '1', degree: 'M.S. Computer Science — AI Specialization', school: 'Your University', year: '2019' },
  { id: '2', degree: 'B.S. Computer Science', school: 'Your University', year: '2017' },
];

export default function EducationSection() {
  const { data: dbEdu } = useEducation();
  const education = dbEdu && dbEdu.length > 0 ? dbEdu : fallbackEducation;

  return (
    <section id="education" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-gradient">Education</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {education.map((edu) => (
            <div key={edu.id} className="p-6 rounded-xl card-gradient border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-primary text-sm font-mono mb-3">
                <GraduationCap className="h-4 w-4" />
                {edu.year}
              </div>
              <h3 className="font-semibold mb-1">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
