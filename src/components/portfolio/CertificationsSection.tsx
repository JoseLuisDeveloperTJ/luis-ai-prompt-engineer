import { Award, ExternalLink } from 'lucide-react';
import { useCertifications } from '@/hooks/useSiteContent';

const fallbackCerts = [
  { id: '1', title: 'AWS Certified Machine Learning', issuer: 'Amazon Web Services', date: '2024', credential_id: null, link: null },
  { id: '2', title: 'TensorFlow Developer Certificate', issuer: 'Google', date: '2023', credential_id: null, link: null },
  { id: '3', title: 'Deep Learning Specialization', issuer: 'Coursera / DeepLearning.AI', date: '2022', credential_id: null, link: null },
];

export default function CertificationsSection() {
  const { data: dbCerts } = useCertifications();
  const certs = dbCerts && dbCerts.length > 0 ? dbCerts : fallbackCerts;

  return (
    <section id="certifications" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-gradient">Certifications</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-xl card-gradient border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-2 text-primary text-sm font-mono mb-3">
                <Award className="h-4 w-4" />
                {cert.date}
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{cert.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{cert.issuer}</p>
              {cert.credential_id && (
                <p className="text-xs text-muted-foreground font-mono">ID: {cert.credential_id}</p>
              )}
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                >
                  Verify <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
