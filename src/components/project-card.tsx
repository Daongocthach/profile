"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ExternalLink, Github, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
}

/* ───────── Lightbox (portal) ───────── */
function Lightbox({
    images,
    initialIndex,
    onClose,
}: {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}) {
    const [index, setIndex] = useState(initialIndex);

    const goPrev = useCallback(
        () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1)),
        [images.length],
    );
    const goNext = useCallback(
        () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1)),
        [images.length],
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose, goPrev, goNext]);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div
                className="relative w-[90vw] h-[85vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    key={index}
                    src={images[index]}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-contain animate-in fade-in duration-300"
                    sizes="90vw"
                    priority
                />
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goPrev();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goNext();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-7 h-7" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIndex(i);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${i === index
                                    ? "bg-purple-400 scale-125"
                                    : "bg-white/40 hover:bg-white/70"
                                    }`}
                                aria-label={`Go to screenshot ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>,
        document.body,
    );
}

/* ───────── Project Card ───────── */
export function ProjectCard({ project }: ProjectCardProps) {
    const screenshots = project.screenshots ?? [];
    const fallbackImage = project.image_url;
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const mainImage = screenshots[activeIndex] ?? fallbackImage;

    const allImages = screenshots.length > 0 ? screenshots : fallbackImage ? [fallbackImage] : [];

    return (
        <>
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/5">
                {/* Hover gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main Image */}
                <div
                    className="relative aspect-video overflow-hidden cursor-pointer"
                    onClick={() => mainImage && setLightboxOpen(true)}
                >
                    {mainImage ? (
                        <Image
                            src={mainImage}
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

                {/* Screenshot thumbnails */}
                {screenshots.length > 1 && (
                    <div className="relative flex gap-1.5 px-4 pt-3 overflow-x-auto scrollbar-hide">
                        {screenshots.map((src, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${idx === activeIndex
                                    ? "border-purple-500 shadow-md shadow-purple-500/20"
                                    : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={`${project.name} screenshot ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                />
                            </button>
                        ))}
                    </div>
                )}

                <CardContent className="relative pt-4 space-y-3">
                    <h3 className="text-xl font-semibold tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
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
                                    className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 hover:bg-purple-500/20"
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

            {/* Lightbox popup */}
            {lightboxOpen && allImages.length > 0 && (
                <Lightbox
                    images={allImages}
                    initialIndex={activeIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
}
