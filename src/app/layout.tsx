import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dao Ngoc Thach — Full-Stack Developer",
  description:
    "Portfolio of Dao Ngoc Thach — Full-Stack Developer specializing in modern web technologies. Explore my projects and get in touch.",
  keywords: ["developer", "portfolio", "full-stack", "next.js", "react"],
  openGraph: {
    title: "Dao Ngoc Thach — Full-Stack Developer",
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
