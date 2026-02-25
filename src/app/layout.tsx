import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dao Ngoc Thach — FrontEnd Developer",
  description:
    "Portfolio of Dao Ngoc Thach — FrontEnd Developer specializing in modern web technologies. Explore my projects and get in touch.",
  keywords: ["developer", "portfolio", "frontend", "next.js", "react"],
  openGraph: {
    title: "Dao Ngoc Thach — FrontEnd Developer",
    description:
      "Crafting high-performance web experiences with modern technologies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

