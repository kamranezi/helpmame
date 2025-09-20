'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AuthButtons from './AuthButtons';
import { useCart } from '../context/CartContext'; // Импортируем наш хук

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { cartTotal } = useCart(); // Получаем общую стоимость из контекста
  const [clientCartTotal, setClientCartTotal] = useState(0);

  useEffect(() => {
    setClientCartTotal(cartTotal);
  }, [cartTotal]);

  const navLinkClass = "hover:text-gray-200 transition-colors";

  const navLinks = (
    <>
      <li><Link href="/" className={navLinkClass} onClick={() => setIsOpen(false)}>Главная</Link></li>
      <li><Link href="/consultation" className={navLinkClass} onClick={() => setIsOpen(false)}>Консультация</Link></li>
      <li><Link href="/urgent" className={navLinkClass} onClick={() => setIsOpen(false)}>Срочная помощь</Link></li>
      <li><Link href="/specialist-call" className={navLinkClass} onClick={() => setIsOpen(false)}>Вызов на дом</Link></li>
      <li><Link href="/services" className={navLinkClass} onClick={() => setIsOpen(false)}>Услуги и Цены</Link></li>
      <li><Link href="/discharge" className={navLinkClass} onClick={() => setIsOpen(false)}>К выписке</Link></li>
      <li><Link href="/board" className={navLinkClass} onClick={() => setIsOpen(false)}>Доска объявлений</Link></li>
      <li><Link href="/forum" className={navLinkClass} onClick={() => setIsOpen(false)}>Форум</Link></li>
      <li><Link href="/articles" className={navLinkClass} onClick={() => setIsOpen(false)}>Статьи</Link></li>
    </>
  );

  const cartLink = (
    <Link href="/cart" className="flex items-center space-x-2 hover:text-gray-200 transition-colors" onClick={() => setIsOpen(false)}>
        <Image src="/icons/cart.svg" alt="Корзина" width={24} height={24} />
        {clientCartTotal > 0 && (
            <span className="font-bold">{clientCartTotal.toLocaleString('ru-RU')} руб.</span>
        )}
    </Link>
  );

  return (
    <nav className="bg-rose-400 text-white p-4 flex justify-between items-center relative font-semibold z-20 shadow-md">
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
        {/* Навигация для десктопа */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks}
        </ul>
        
        <div className="hidden md:flex items-center ml-6 space-x-6">
            {cartLink}
            <AuthButtons />
        </div>

        {/* ИЗМЕНЕНО: Контейнер для иконок мобильной версии */}
        <div className="flex items-center md:hidden ml-4">
            {/* ИЗМЕНЕНО: cartLink вынесен в хедер для мобильных */}
            <div className="mr-4">
                {cartLink}
            </div>
            <button onClick={() => setIsOpen(!isOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
                </svg>
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-rose-300 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col items-center space-y-4 p-4">
          {navLinks}
        </ul>
        {/* ИЗМЕНЕНО: cartLink убран из выезжающего меню */}
        <div className="p-4 border-t border-white/20 flex flex-col items-center space-y-4">
            <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
