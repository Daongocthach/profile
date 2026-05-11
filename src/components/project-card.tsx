"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
    index: number;
}

/* ───────── Lightbox Component ───────── */
function Lightbox({ 
    images, 
    initialIndex, 
    onClose 
}: { 
    images: string[]; 
    initialIndex: number; 
    onClose: () => void 
}) {
    const [index, setIndex] = useState(initialIndex);

    const goPrev = useCallback(() => {
        setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goNext = useCallback(() => {
        setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose, goPrev, goNext]);

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-50"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/20 transition-all z-50"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/20 transition-all z-50"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Image Container */}
            <div 
                className="relative w-full h-full max-w-6xl max-h-[85vh] select-none"
                onClick={(e) => e.stopPropagation()}
            >
                <Image 
                    src={images[index]} 
                    alt={`Screenshot ${index + 1}`} 
                    fill 
                    className="object-contain animate-in zoom-in-95 duration-300"
                    priority
                />
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
                {images.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-purple-500" : "w-2 bg-white/20"}`}
                    />
                ))}
            </div>
        </div>,
        document.body
    );
}

/* ───────── Main ProjectCard ───────── */
export function ProjectCard({ project, index }: ProjectCardProps) {
    const t = useTranslations("projects");
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    
    // Get localized content
    const projectData = t.raw(`list.${project.slug}`);
    const name = projectData?.name || project.name;
    const description = projectData?.description || project.description;
    
    const screenshots = project.screenshots || [];
    const mainImage = screenshots[activeIndex] || project.image_url;
    const isEven = index % 2 === 0;

    return (
        <>
            <div className="group relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5">
                <div className={`flex flex-col lg:flex-row gap-8 lg:gap-0 ${!isEven ? "lg:flex-row-reverse" : ""}`}>
                    {/* Left Side: Visuals */}
                    <div className="lg:w-1/2 p-6 md:p-8 space-y-6">
                        <div 
                            className="relative aspect-video rounded-2xl overflow-hidden bg-muted/20 border border-border/50 cursor-zoom-in"
                            onClick={() => setIsLightboxOpen(true)}
                        >
                            {mainImage && (
                                <Image
                                    src={mainImage}
                                    alt={name}
                                    fill
                                    className="object-contain transition-all duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            )}
                        </div>
                        
                        {/* Thumbnails */}
                        {screenshots.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto p-2 scrollbar-hide">
                                {screenshots.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIndex(idx)}
                                        className={`relative w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-muted/10 ${
                                            idx === activeIndex 
                                            ? "border-purple-500 scale-105 shadow-lg shadow-purple-500/20" 
                                            : "border-transparent opacity-50 hover:opacity-100"
                                        }`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`${name} thumb ${idx}`}
                                            fill
                                            className="object-contain"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Content */}
                    <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                {name}
                            </h3>
                            
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                {description}
                            </p>

                            {/* Tech Tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.technologies?.map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant="outline"
                                        className="px-4 py-1.5 rounded-full bg-muted/10 border-border/50 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-purple-400 hover:border-purple-500/30 transition-all"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-8">
                                <Button
                                    className="h-14 px-8 rounded-2xl bg-linear-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold text-lg transition-all shadow-lg shadow-purple-500/20 group/btn"
                                    asChild
                                >
                                    <Link href={`/projects/${project.slug}`}>
                                        {t("viewDetail") || "Xem chi tiết dự án"}
                                    </Link>
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-14 h-14 rounded-full border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                                    asChild
                                >
                                    <Link href={`/projects/${project.slug}`}>
                                        <ArrowUpRight className="w-6 h-6" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && screenshots.length > 0 && (
                <Lightbox 
                    images={screenshots} 
                    initialIndex={activeIndex} 
                    onClose={() => setIsLightboxOpen(false)} 
                />
            )}
        </>
    );
}
