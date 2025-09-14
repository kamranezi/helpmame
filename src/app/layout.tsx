'use client';

import '../styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ru">
      <body className="flex flex-col min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 container mx-auto p-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
