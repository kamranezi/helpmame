
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // Импортируем наш новый провайдер

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "HelpMame - Помощь мамам",
  description: "Онлайн и оффлайн помощь для мам",
  themeColor: "#ffffff", 
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
      </body>
    </html>
  );
}
