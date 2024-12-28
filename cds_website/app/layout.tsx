import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "NYU CDS Interview Sharing Form",
  description: "NYU CDS Alumni Council",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html> 
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="flex min-h-screen">
        {/* Navigation Sidebar */}
        <nav className="w-64 bg-muted p-4 space-y-2">
          <div className="text-lg font-semibold mb-6"> Select </div>
          <Link
            href="/"
            className = "block p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
          > Log Interviews 
          </Link>
          <Link
            href="/interviews_table"
            className = "block p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
          >
            View Interviews
          </Link>
        </nav>

      {/* Main Content */}
      <main className= "flex-1 p-8">
        {children}
      </main>
      </div>
    </body>
  </html>  
  );
}
