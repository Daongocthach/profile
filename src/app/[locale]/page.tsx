import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { mockProfile, mockProjects } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      <HeroSection profile={mockProfile} />
      <ProjectsSection projects={mockProjects} />
      <ContactSection />
      <Footer profile={mockProfile} />
    </main>
  );
}
