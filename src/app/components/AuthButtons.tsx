'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Button from './Button';
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="flex justify-center space-x-4">
      {user ? (
        <>
          <Button href="/profile">Профиль</Button>
          <button onClick={handleSignOut} className="bg-red-600 text-white font-bold py-2 px-4 rounded">
            Выйти
          </button>
        </>
      ) : (
        <>
          <Button href="/login">Войти</Button>
          <Button href="/register">Регистрация</Button>
        </>
      )}
    </div>
  );
}
