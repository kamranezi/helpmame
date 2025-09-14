'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function AuthButtons() {
  // Достаем не только пользователя, но и его профиль из Firestore
  const { user, userProfile, logOut } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        // ==== Интерфейс для вошедшего пользователя ====
        <>
          <Link href="/profile" title="Перейти в профиль">
            {userProfile?.photoURL ? (
              // Если в профиле есть фото, показываем его
              <img 
                src={userProfile.photoURL} 
                alt="Профиль"
                className="w-10 h-10 rounded-full border-2 border-white hover:opacity-90 transition-opacity"
              />
            ) : (
              // Иначе, показываем инициалы
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                {userProfile?.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
          <button onClick={logOut} className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700">
            Выйти
          </button>
        </>
      ) : (
        // ==== Интерфейс для гостя ====
        <>
          {/* Оставляем только кнопку "Войти" */}
          <Link href="/login" className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
            Войти
          </Link>
        </>
      )}
    </div>
  );
}
