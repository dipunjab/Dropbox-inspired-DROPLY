import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Droply — Modern Cloud Storage, Simplified",
  description:
    "Droply is a modern cloud storage platform built with Next.js, Clerk, and ImageKit. Store, organize, and access your files effortlessly — fast, secure, and beautifully designed.",
  keywords: [
    "cloud storage",
    "Next.js",
    "file management",
    "Clerk authentication",
    "ImageKit CDN",
    "React",
    "Droply",
    "file sharing",
    "secure storage",
  ],
  authors: [{ name: "Muhammad Usman Ghani" }],
  creator: "Muhammad Usman Ghani",
  publisher: "Muhammad Usman Ghani",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
