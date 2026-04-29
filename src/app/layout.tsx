import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkflowPro - Workflow Management Tool",
  description: "Comprehensive workflow management tool for teams. Streamline processes, track progress, and collaborate in real-time.",
  keywords: ["workflow", "management", "tasks", "team collaboration", "project management", "Next.js", "TypeScript"],
  authors: [{ name: "WorkflowPro Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "WorkflowPro - Workflow Management Tool",
    description: "Streamline your team's workflows with our powerful management tool",
    url: "https://workflowpro.com",
    siteName: "WorkflowPro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkflowPro - Workflow Management Tool",
    description: "Streamline your team's workflows with our powerful management tool",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
