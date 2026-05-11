"use client";

import React from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/types";
import { useTranslations } from "next-intl";

interface ProjectsSectionProps {
    projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
    const t = useTranslations("projects");

    // Sort projects by sort_order
    const sortedProjects = [...projects].sort((a, b) => a.sort_order - b.sort_order);

    return (
        <section id="projects" className="py-24 px-6 bg-background">
            <div className="container mx-auto max-w-7xl">
                {/* Section header */}
                <div className="mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {t("title")}
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Projects list (Wide Cards) */}
                {sortedProjects.length > 0 ? (
                    <div className="space-y-16">
                        {sortedProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-[3rem]">
                        <p className="text-muted-foreground text-lg italic">
                            {t("comingSoon")}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
