import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GroceryQuest",
  description: "Simple and effective grocery list app to keep track of your shopping",
  icons: {
    icon: "https://assets.kiloapps.io/user_de7487d4-ddd5-4a73-bf02-bb07e43b3386/37732363-9e5c-4ed4-9f1a-09430e123304/4248585e-3f45-497b-8d0b-b489bdea852b.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <DarkModeProvider>
          <MobileLayout>{children}</MobileLayout>
        </DarkModeProvider>
      </body>
    </html>
  );
}