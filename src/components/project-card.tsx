import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/5">
            {/* Hover gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
                {project.image_url ? (
                    <Image
                        src={project.image_url}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-blue-500/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-muted-foreground/50">
                            {project.name.charAt(0)}
                        </span>
                    </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <CardContent className="relative pt-4 space-y-3">
                <h3 className="text-xl font-semibold tracking-tight group-hover:text-purple-400 transition-colors duration-300">
                    {project.name}
                </h3>

                {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {project.description}
                    </p>
                )}

                {/* Tech badges */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((tech) => (
                            <Badge
                                key={tech}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20"
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="relative pt-0 gap-2">
                {project.project_url && (
                    <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-md shadow-purple-500/20"
                        asChild
                    >
                        <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="w-4 h-4 mr-1.5" />
                            Live Demo
                        </a>
                    </Button>
                )}
                {project.github_url && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-border/60 hover:border-purple-500/40 hover:bg-purple-500/10"
                        asChild
                    >
                        <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Github className="w-4 h-4 mr-1.5" />
                            GitHub
                        </a>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
