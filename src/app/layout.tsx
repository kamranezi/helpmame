
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider"; // ИМПОРТ

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "HelpMame - Помощь мамам",
  description: "Онлайн и оффлайн помощь для мам",
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning> 
      <body className={inter.className}>
        {/* ОБЕРТКА ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Принудительно ставим светлую тему
          enableSystem={false} // Отключаем зависимость от системы
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 container mx-auto p-4">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
