import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Use Inter font as a fallback since Poppins is causing issues
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Food App Admin Dashboard",
  description: "Admin dashboard for food delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
