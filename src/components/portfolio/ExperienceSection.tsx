import { useExperience } from '@/hooks/useSiteContent';
import { Briefcase } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';


function Waves() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, count } = useMemo(() => {
    const SEP = 0.4, AMOUNT_X = 60, AMOUNT_Y = 60;
    const numPoints = AMOUNT_X * AMOUNT_Y;
    const pos = new Float32Array(numPoints * 3);
    let i = 0;
    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iy = 0; iy < AMOUNT_Y; iy++) {
        pos[i] = ix * SEP - (AMOUNT_X * SEP) / 2;
        pos[i + 1] = 0;
        pos[i + 2] = iy * SEP - (AMOUNT_Y * SEP) / 2;
        i += 3;
      }
    }
    return { positions: pos, count: numPoints };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    let i = 0;
    for (let ix = 0; ix < 60; ix++) {
      for (let iy = 0; iy < 60; iy++) {
        arr[i + 1] = (Math.sin((ix + t) * 0.3) * 0.25) + (Math.sin((iy + t) * 0.5) * 0.25);
        i += 3;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.060} color="#064e3b" transparent opacity={1} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}


const fallbackExperiences = [
  { id: '1', role: 'Senior AI Engineer', company: 'Your Company', period: '2023 — Present', description: 'Leading AI/ML initiatives.' },
  { id: '2', role: 'ML Engineer', company: 'Previous Company', period: '2021 — 2023', description: 'Developed CV and NLP solutions.' },
];

export default function ExperienceSection() {
  const { data: dbItems } = useExperience();
  const experiences = dbItems && dbItems.length > 0
    ? dbItems.map((e) => ({ id: e.id, role: e.job_title, company: e.company, period: e.period, description: e.description || '' }))
    : fallbackExperiences;

  return (
<section id="experience" className="py-24 relative overflow-hidden bg-[#080A0C]">
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas 
      camera={{ position: [0, 5, 10], fov: 45 }} 
      gl={{ toneMapping: THREE.NoToneMapping }}
      dpr={[1, 2]}
    >
      <Waves />
    </Canvas>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
  </div>

  <div className="container mx-auto px-6 relative z-10">

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Work <span className="text-gradient">Experience</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />
          <div className="space-y-12">
          {experiences.map((exp, i) => (
            <div 
              key={exp.id} 
              className={`relative flex flex-col md:flex-row items-center gap-8 mb-16 ${
                i % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
          <div className={`flex-1 w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <div className="pl-16 md:pl-0"> 
                  
                    <ExperienceCard {...exp} isLeft={i % 2 === 0} />
                
                </div> 
              </div>

              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow z-10" 
                  style={{ top: '1.5rem' }} />    <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ role, company, period, description, isLeft }: { 
  role: string; 
  company: string; 
  period: string; 
  description: string;
  isLeft?: boolean; 
}) {
  return (
    <div className="p-6 rounded-xl card-gradient border border-border/50 hover:border-primary/30 transition-colors">
<div className={`flex items-center gap-2 text-primary text-sm font-mono mb-2 ${isLeft ? 'md:flex-row-reverse md:ml-auto' : ''}`}>
  <Briefcase className="h-4 w-4" />
  {period}
</div>
      <h3 className="text-lg font-semibold mb-1">{role}</h3>
      <p className="text-sm text-muted-foreground mb-3">{company}</p>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{description}</p>
    </div>
  );
}
