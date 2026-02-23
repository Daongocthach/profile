import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/lib/types";

interface FooterProps {
    profile: Profile | null;
}

export function Footer({ profile }: FooterProps) {
    const name = profile?.name || "Dao Ngoc Thach";
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 px-6">
            <Separator className="mb-10 bg-border/40" />
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        © {currentYear} {name}. Built with{" "}
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> and
                        Next.js
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-4">
                        {profile?.github_url && (
                            <a
                                href={profile.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-purple-400 transition-colors duration-300"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {profile?.linkedin_url && (
                            <a
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-blue-400 transition-colors duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {profile?.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="text-muted-foreground hover:text-violet-400 transition-colors duration-300"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
