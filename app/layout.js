import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/landingPageComponent/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DBS Finance Tracker",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logosm.png" sizes="any" />
        </head>
        <body className={`${inter.className} highlighter-context`}
        cz-shortcut-listen="true"
        >
          <Header />
          <main className="h-screen mx-auto py-5">
            {children}
          </main>
          <Toaster richColors/>
          
        </body>
      </html>
    </ClerkProvider>
  );
}
