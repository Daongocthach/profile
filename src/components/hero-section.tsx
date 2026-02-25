import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/lib/types";

interface HeroSectionProps {
    profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
    const name = profile?.name || "Dao Ngoc Thach";
    const role = profile?.role || "Front-End Developer";
    const description =
        profile?.description ||
        "Crafting high-performance web experiences with modern technologies.";
    const location = profile?.location || "Vietnam";
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(-2)
        .toUpperCase();

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background gradient blobs */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 text-center">
                {/* Avatar */}
                <div className="relative mx-auto w-36 h-36 mb-8">
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-500 via-violet-500 to-blue-500 animate-spin-slow" />
                    <div className="absolute inset-[3px] rounded-full bg-background" />
                    <div className="absolute inset-[6px] rounded-full bg-linear-to-br from-purple-500/20 via-violet-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="text-5xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {initials}
                        </span>
                    </div>
                </div>

                {/* Name & Title */}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    <span className="bg-linear-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                        {name}
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-medium">
                    {role}
                </p>

                {/* Bio */}
                <p className="max-w-2xl mx-auto text-muted-foreground mb-4 text-lg leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{location}</span>
                </div>

                {/* Skills */}
                {profile?.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-2xl mx-auto">
                        {profile.skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="px-3 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3">
                    {profile?.github_url && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300"
                            asChild
                        >
                            <a
                                href={profile.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </Button>
                    )}
                    {profile?.linkedin_url && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                            asChild
                        >
                            <a
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </Button>
                    )}
                    {profile?.email && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-violet-500/30 hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-300"
                            asChild
                        >
                            <a href={`mailto:${profile.email}`} aria-label="Email">
                                <Mail className="w-5 h-5" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
