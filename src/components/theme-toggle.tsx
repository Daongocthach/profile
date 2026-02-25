"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="fixed top-4 right-4 z-50 rounded-full border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 backdrop-blur-sm bg-background/80 shadow-lg transition-all duration-300"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
                <Moon className="w-5 h-5 text-purple-400 transition-transform duration-300" />
            )}
        </Button>
    );
}
