import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Inject all variables into the body */}
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}