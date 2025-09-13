import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className}`}
          suppressHydrationWarning={true}
        >
          <Header />
          <main className="h-screen mx-auto py-5">
            {children}
          </main>
          <footer>
            <p>© 2025 Welth. All rights reserved.</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
