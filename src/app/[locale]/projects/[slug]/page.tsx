"use client";

import React, { use } from "react";
import Image from "next/image";
import { 
    ChevronLeft, 
    CheckCircle2, 
    Smartphone, 
    User, 
    Calendar, 
    Users, 
    Send,
    Star
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { mockProjects, mockProfile } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/footer";

type ProjectStat = {
    label: string;
    value: string;
};

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug } = use(params);
    const t = useTranslations("projects");
    const project = mockProjects.find((p) => p.slug === slug);

    // Get localized content
    const projectData = t.raw(`list.${slug}`);

    if (!project || !projectData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Project not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* Left: Content */}
                        <div className="lg:w-1/2 space-y-8">
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Back to Home</span>
                            </Link>

                            <div className="space-y-6">
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-purple-500/30 bg-purple-500/5 text-purple-400 flex items-center gap-2 w-fit">
                                    <Star className="w-4 h-4 fill-purple-400" />
                                    {t("featuredProject")}
                                </Badge>
                                
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                                    {projectData.name}
                                </h1>
                                
                                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                    {projectData.description}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {project.technologies?.map((tech) => (
                                        <Badge 
                                            key={tech} 
                                            variant="outline" 
                                            className="px-5 py-2 rounded-full border-white/10 bg-white/5 text-sm font-medium"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                                {(projectData.stats as ProjectStat[] | undefined)?.map((stat, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Mockups */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative aspect-square max-w-[600px] mx-auto">
                                {/* Large Mockup */}
                                <div className="absolute top-0 right-0 w-[70%] aspect-[9/19.5] rounded-[3rem] border-[8px] border-zinc-800 overflow-hidden shadow-2xl rotate-[10deg] translate-x-10">
                                    <Image 
                                        src={project.screenshots[0]} 
                                        alt="Dashboard" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                {/* Secondary Mockup */}
                                <div className="absolute top-10 left-0 w-[70%] aspect-[9/19.5] rounded-[3rem] border-[8px] border-zinc-800 overflow-hidden shadow-2xl -rotate-[5deg] z-10">
                                    <Image 
                                        src={project.screenshots[1] || project.screenshots[0]} 
                                        alt="Details" 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Section */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Overview */}
                        <Card className="lg:col-span-1 p-10 bg-card/30 border-white/5 rounded-[2.5rem] space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-purple-400">
                                    <div className="p-3 rounded-2xl bg-purple-500/10">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold">{t("overview")}</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {projectData.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-white">{t("theChallenge")}</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {projectData.challenge}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-white">{t("theSolution")}</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {projectData.solution}
                                </p>
                            </div>
                        </Card>

                        {/* Features & Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                {/* Key Features */}
                                <Card className="p-10 bg-card/30 border-white/5 rounded-[2.5rem] space-y-8">
                                    <div className="flex items-center gap-4 text-blue-400">
                                        <div className="p-3 rounded-2xl bg-blue-500/10">
                                            <Star className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{t("keyFeatures")}</h3>
                                    </div>
                                    <ul className="space-y-6">
                                        {projectData.features?.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                                                <p className="text-muted-foreground font-medium">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                                {/* Project Info & Call to Action */}
                                <div className="space-y-8 flex flex-col">
                                    <Card className="p-10 bg-card/30 border-white/5 rounded-[2.5rem] space-y-8 flex-grow">
                                        <div className="space-y-6">
                                            {[
                                                { label: t("projectType"), value: projectData.type, icon: Smartphone },
                                                { label: t("myRole"), value: projectData.role, icon: User },
                                                { label: t("duration"), value: projectData.duration, icon: Calendar },
                                                { label: t("teamSize"), value: projectData.teamSize, icon: Users },
                                                { label: t("launched"), value: projectData.launched, icon: Send },
                                            ].map((info, i) => (
                                                <div key={i} className="flex items-start justify-between group gap-4">
                                                    <div className="flex items-center gap-4 shrink-0 mt-0.5">
                                                        <info.icon className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                                                        <span className="text-muted-foreground font-medium">{info.label}</span>
                                                    </div>
                                                    <div className="flex justify-end text-right">
                                                        <span className="text-white font-bold">{info.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Interested in working together? */}
                                    <Card className="p-10 bg-linear-to-br from-purple-500/10 via-blue-500/5 to-transparent border-white/5 rounded-[2.5rem] space-y-6">
                                        <h3 className="text-2xl font-bold text-white">{t("interestedWork")}</h3>
                                        <p className="text-muted-foreground">
                                            {t("letDiscuss")}
                                        </p>
                                        <Button 
                                            className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                                            asChild
                                        >
                                            <Link href="/#contact">Get In Touch</Link>
                                        </Button>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Screenshots Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="space-y-12">
                        <div className="flex items-center gap-4 text-purple-400">
                            <div className="p-3 rounded-2xl bg-purple-500/10">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold">{t("appScreenshots")}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {project.screenshots.map((src, i) => (
                                <div key={i} className="relative aspect-[9/19.5] rounded-3xl overflow-hidden border border-white/10 group">
                                    <Image 
                                        src={src} 
                                        alt={`Screenshot ${i + 1}`} 
                                        fill 
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer profile={mockProfile} />
        </div>
    );
}
