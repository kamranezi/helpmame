
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // Импортируем наш новый провайдер
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "HelpMame - Помощь мамам",
  description: "Онлайн и оффлайн помощь для мам",
  icons: {
    icon: '/logo.jpg',
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider> {/* Оборачиваем приложение в CartProvider */}
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 container mx-auto p-4">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
