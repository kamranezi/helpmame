'use client';
import Link from 'next/link';
import AuthButtons from './AuthButtons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center flex-wrap">
      <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
          </button>
          <Link href="/">
              <h1 className="font-bold text-xl cursor-pointer">HelpMame</h1>
          </Link>
      </div>
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
          />
        </svg>
      </button>
      <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col md:flex-row md:space-x-4 items-center md:items-start">
          <li><Link href="/" onClick={() => setIsOpen(false)}>Главная</Link></li>
          <li><Link href="/consultation" onClick={() => setIsOpen(false)}>Консультация</Link></li>
          <li><Link href="/urgent" onClick={() => setIsOpen(false)}>Срочная помощь</Link></li>
          <li><Link href="/specialist-call" onClick={() => setIsOpen(false)}>Вызов на дом</Link></li>
          <li><Link href="/services" onClick={() => setIsOpen(false)}>Услуги и Цены</Link></li>
          <li><Link href="/forum" onClick={() => setIsOpen(false)}>Форум</Link></li>
          <li><Link href="/articles" onClick={() => setIsOpen(false)}>Статьи</Link></li>
        </ul>
        <div className="md:hidden mt-4">
            <AuthButtons />
        </div>
      </div>
      <div className="hidden md:block">
        <AuthButtons />
      </div>
    </nav>
  );
}
