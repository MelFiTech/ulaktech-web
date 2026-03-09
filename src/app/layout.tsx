import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ulaktech — Pay Bills. Buy Data. Stay Connected.",
  description:
    "Fast, secure and fully automated platform for data bundles, airtime, TV subscriptions and electricity payments — available 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('ulaktech-theme');if(t==='dark'||t==='light'){document.documentElement.classList.add(t);}else{document.documentElement.classList.add('light');}})();`,
          }}
        />
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
