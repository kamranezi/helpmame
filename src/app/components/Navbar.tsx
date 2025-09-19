'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AuthButtons from './AuthButtons';
import { useCart } from '../context/CartContext'; // Импортируем наш хук

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cartTotal } = useCart(); // Получаем общую стоимость из контекста

  const navLinkClass = "hover:text-gray-200 transition-colors";

  const navLinks = (
    <>
      <li><Link href="/" className={navLinkClass} onClick={() => setIsOpen(false)}>Главная</Link></li>
      <li><Link href="/consultation" className={navLinkClass} onClick={() => setIsOpen(false)}>Консультация</Link></li>
      <li><Link href="/board" className={navLinkClass} onClick={() => setIsOpen(false)}>Доска объявлений</Link></li>
      <li><Link href="/services" className={navLinkClass} onClick={() => setIsOpen(false)}>Услуги</Link></li>
      {/* Можно добавить и другие ссылки при необходимости */}
    </>
  );

  const cartLink = (
    <Link href="/cart" legacyBehavior>
        <a className="flex items-center space-x-2 hover:text-gray-200 transition-colors" onClick={() => setIsOpen(false)}>
            <Image src="/cart.svg" alt="Корзина" width={24} height={24} />
            {cartTotal > 0 && (
                <span className="font-bold">{cartTotal.toLocaleString('ru-RU')} руб.</span>
            )}
        </a>
    </Link>
  );

  return (
    <nav className="bg-rose-500 text-white p-4 flex justify-between items-center relative font-semibold z-20 shadow-md">
      <div className="flex items-center space-x-4">
        {pathname !== '/' && (
          <button onClick={() => router.back()} className="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
                <Image src="/logo.jpg" alt="HelpMame Logo" width={40} height={40} className="rounded-full" />
                <h1 className="font-bold text-xl italic">HelpMame</h1>
            </div>
        </Link>
      </div>

      <div className="flex items-center">
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks}
        </ul>
        
        <div className="hidden md:flex items-center ml-6 space-x-6">
            {cartLink}
            <AuthButtons />
        </div>

        <button className="md:hidden ml-4" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
            </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-rose-400 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col items-center space-y-4 p-4">
          {navLinks}
        </ul>
        <div className="p-4 border-t border-white/20 flex flex-col items-center space-y-4">
            {cartLink}
            <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
