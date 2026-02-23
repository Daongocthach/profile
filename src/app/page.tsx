import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { Footer } from "@/components/footer";
import type { Project, Profile } from "@/lib/types";

export const revalidate = 60; // Revalidate every 60 seconds

async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getProjects(),
  ]);

  return (
    <main className="min-h-screen">
      <HeroSection profile={profile} />
      <ProjectsSection projects={projects} />
      <Footer profile={profile} />
    </main>
  );
}
