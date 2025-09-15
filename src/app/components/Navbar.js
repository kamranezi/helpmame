'use client';
import Link from 'next/link';
import AuthButtons from './AuthButtons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinkClass = "hover:text-gray-200";

  const navLinks = (
    <>
      <li><Link href="/" className={navLinkClass} onClick={() => setIsOpen(false)}>Главная</Link></li>
      <li><Link href="/consultation" className={navLinkClass} onClick={() => setIsOpen(false)}>Консультация</Link></li>
      <li><Link href="/urgent" className={navLinkClass} onClick={() => setIsOpen(false)}>Срочная помощь</Link></li>
      <li><Link href="/specialist-call" className={navLinkClass} onClick={() => setIsOpen(false)}>Вызов на дом</Link></li>
      <li><Link href="/services" className={navLinkClass} onClick={() => setIsOpen(false)}>Услуги и Цены</Link></li>
      <li><Link href="/forum" className={navLinkClass} onClick={() => setIsOpen(false)}>Форум</Link></li>
      <li><Link href="/articles" className={navLinkClass} onClick={() => setIsOpen(false)}>Статьи</Link></li>
    </>
  );

  return (
    <nav className="bg-purple-500 text-white p-4 flex justify-between items-center relative font-semibold">
      {/* Left Side: Back Button & Logo */}
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src="/logo.jpg" alt="HelpMame Logo" width={40} height={40} className="rounded-full" />
            <h1 className="font-bold text-xl italic">HelpMame</h1>
          </div>
        </Link>
      </div>

      {/* Right Side: Desktop Links, Auth Buttons, Hamburger */}
      <div className="flex items-center">
        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-4 items-center">
          {navLinks}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block ml-6">
          <AuthButtons />
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden ml-4"
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
      </div>

      {/* Mobile Menu (collapsible) */}
      <div className={`absolute top-full left-0 w-full bg-purple-500 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col items-center space-y-4 p-4">
          {navLinks}
        </ul>
        {/* Mobile Auth Buttons */}
        <div className="p-4 border-t border-white/20 flex justify-center">
            <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
