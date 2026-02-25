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
    images: [
      {
        url: "https://res.cloudinary.com/dalhc6zvg/image/upload/v1772035695/A%CC%89nh_chu%CC%A3p_ma%CC%80n_hi%CC%80nh_25-2-2026_23718_profile-phi-rose-50.vercel.app_yrllsh.jpg",
        width: 1200,
        height: 630,
        alt: "Dao Ngoc Thach — FrontEnd Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dao Ngoc Thach — FrontEnd Developer",
    description:
      "Crafting high-performance web experiences with modern technologies.",
    images: [
      "https://res.cloudinary.com/dalhc6zvg/image/upload/v1772035695/A%CC%89nh_chu%CC%A3p_ma%CC%80n_hi%CC%80nh_25-2-2026_23718_profile-phi-rose-50.vercel.app_yrllsh.jpg",
    ],
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

