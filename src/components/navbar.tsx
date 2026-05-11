"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Globe, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/routing";
import { auth, database } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const t = useTranslations("nav");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        
        // Listen for Auth changes
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch Role from Database
                if (database) {
                    try {
                        const userRef = ref(database, `users/${currentUser.uid}`);
                        const snapshot = await get(userRef);
                        if (snapshot.exists()) {
                            setUserRole(snapshot.val().role);
                        }
                    } catch (error) {
                        console.error("Error fetching user role:", error);
                        setUserRole("customer"); // Fallback to default role
                    }
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            unsubscribe();
        };
    }, []);

    const toggleLocale = () => {
        const newLocale = locale === "en" ? "vi" : "en";
        router.replace(pathname, { locale: newLocale });
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    const navLinks = [
        { name: t("home"), href: "/#home" },
        { name: t("projects"), href: "/#projects" },
        { name: t("contact"), href: "/#contact" },
    ];

    // Add Dashboard if Admin
    if (userRole === "admin") {
        navLinks.push({ name: "Dashboard", href: "/dashboard" });
    }

    if (isAuthPage) return null;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
                scrolled || mobileMenuOpen
                    ? "bg-background/80 backdrop-blur-md border-b py-3 shadow-sm" 
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto flex items-center">
                {/* Logo - Left Side */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        NT
                    </Link>
                </div>

                {/* Nav Links - Center (Desktop) */}
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

                {/* Actions - Right Side */}
                <div className="flex-1 flex items-center justify-end gap-4">
                    {/* User Profile / Login */}
                    {user ? (
                        <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-full border border-border/50 group relative cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 overflow-hidden">
                                {user.photoURL ? (
                                    <Image src={user.photoURL} alt="Avatar" width={32} height={32} />
                                ) : (
                                    <User className="w-4 h-4 text-purple-400" />
                                )}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-[10px] font-bold text-purple-400 uppercase leading-none">{userRole || "User"}</span>
                                <span className="text-xs font-medium truncate max-w-[80px] leading-tight">{user.displayName || user.email?.split('@')[0]}</span>
                            </div>
                            
                            {/* Dropdown Logout */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-card border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link 
                            href="/login" 
                            className="p-2 rounded-full border border-border/50 hover:border-purple-500/50 transition-all bg-muted/20 text-muted-foreground hover:text-purple-400"
                        >
                            <User className="w-5 h-5" />
                        </Link>
                    )}

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
