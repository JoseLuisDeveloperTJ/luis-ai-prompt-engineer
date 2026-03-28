import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import EducationSection from '@/components/portfolio/EducationSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import { useTrackVisit } from '@/hooks/useTrackVisit';

export default function Index() {
  useTrackVisit('/');

  return (
    <div className="min-h-screen">
      <PortfolioHeader />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
