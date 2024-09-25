import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ReduxProvider } from "./redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwiftChat",
  description: "It was made by Alper Karakoyun and Atalay Karahan.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={inter.className}>
          <ReduxProvider>{children}</ReduxProvider>
          <Toaster richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
