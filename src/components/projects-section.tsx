import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/types";

interface ProjectsSectionProps {
    projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
    return (
        <section className="py-20 px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Section header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            My Projects
                        </span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        A collection of projects I&apos;ve built, showcasing my skills and
                        passion for web development.
                    </p>
                </div>

                {/* Projects grid */}
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">
                            Projects coming soon...
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
