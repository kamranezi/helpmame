import Link from 'next/link';
import AuthButtons from './AuthButtons';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">HelpMame</h1>
      <ul className="flex space-x-4 ">
        <li><Link href="/">Главная</Link></li>
        <li><Link href="/consultation">Консультация</Link></li>
        <li><Link href="/urgent">Срочная помощь</Link></li>
        <li><Link href="/forum">Форум</Link></li>
        <li><Link href="/articles">Статьи</Link></li>
      </ul>
      <AuthButtons />
    </nav>
  );
}
