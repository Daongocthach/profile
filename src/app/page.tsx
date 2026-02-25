import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { Footer } from "@/components/footer";
import { mockProfile, mockProjects } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection profile={mockProfile} />
      <ProjectsSection projects={mockProjects} />
      <Footer profile={mockProfile} />
    </main>
  );
}
