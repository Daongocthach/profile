"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Globe, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/routing";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const t = useTranslations("nav");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLocale = () => {
        const newLocale = locale === "en" ? "vi" : "en";
        router.replace(pathname, { locale: newLocale });
    };

    const navLinks = [
        { name: t("home"), href: "/#home" },
        { name: t("projects"), href: "/#projects" },
        { name: t("contact"), href: "/#contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
                scrolled || mobileMenuOpen
                    ? "bg-background/80 backdrop-blur-md border-b py-3 shadow-sm" 
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    NT
                </Link>

                {/* Nav Links - Desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-purple-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLocale}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 hover:border-purple-500/50 transition-all bg-muted/20"
                    >
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">{locale === "en" ? "EN" : "VI"}</span>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-muted-foreground hover:text-purple-400 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-background/95 backdrop-blur-lg z-40 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-bold text-foreground hover:text-purple-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
