'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="container mx-auto max-w-md text-center px-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold my-6">Profile</h1>
          <p>Email: {user.email}</p>
          <button onClick={handleSignOut} className="mt-4 w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Sign Out
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
