'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  age?: number | null;
  childName?: string;
  childAge?: number | null;
  childGender?: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  email?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  googleSignIn: () => Promise<void>;
  emailSignUp: (email: string, password: string) => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userProfile: null,
  googleSignIn: async () => {},
  emailSignUp: async () => {},
  emailSignIn: async () => {},
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ
  const checkAndCreateUserProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const [firstName, lastName] = user.displayName?.split(' ') || ['', ''];
      
      // При создании записи теперь добавляются ВСЕ поля со значениями по умолчанию
      await setDoc(userRef, {
        firstName: firstName || user.email?.split('@')[0] || '',
        lastName: lastName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        age: null,
        childName: '',
        childAge: null,
        childGender: 'other',
        address: '',
        phone: '',
      });
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await checkAndCreateUserProfile(result.user);
    } catch (error) {
      console.error("Ошибка при входе через Google: ", error);
      throw error;
    }
  };

  const emailSignUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await checkAndCreateUserProfile(result.user);
    } catch (error) {
      console.error("Ошибка при регистрации: ", error);
      throw error;
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Ошибка при входе: ", error);
      throw error;
    }
  };

  const logOut = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        // Добавим небольшую задержку, чтобы `setDoc` успел выполниться перед `getDoc`
        setTimeout(async () => {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
            } else {
                // Если профиля всё еще нет, возможно, это новый юзер, чей профиль создается.
                // Можно попробовать пересоздать его здесь как крайнюю меру, 
                // но исправление в checkAndCreateUserProfile должно быть достаточным.
            }
        }, 100) // 100ms задержка
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = { user, userProfile, googleSignIn, emailSignUp, emailSignIn, logOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
