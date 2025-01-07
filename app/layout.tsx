import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; //Inter
import Link from "next/link";
import "./globals.css";
import Image from "next/image"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//const inter = Inter({subsets: ["latin"]});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="flex min-h-screen">
        {/* Navigation Sidebar */}
        <nav className="w-80 bg-muted p-4 space-y-2">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
                <div className="relative w-64 h-24">
                <Image
                    src= "/CDS_logo_purple.png"
                    alt="Company Logo"
                    className="object-contain"
                    priority={true}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  // Example sizes
                    
                />
                </div>
            </div>



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
          <Link
            href="/update_password"
            className="block p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
          >
            Update Password
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
