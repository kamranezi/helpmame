'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const LoginPage = () => {
  const { user, googleSignIn, emailSignIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Если пользователь уже вошел, перенаправляем его на главную
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await googleSignIn();
      router.push('/'); // <-- Немедленный редирект на главную
    } catch (error) {
      console.error("Login page error (Google): ", error);
      setError('Не удалось войти с помощью Google.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Пожалуйста, введите email и пароль.');
      return;
    }
    try {
      await emailSignIn(email, password);
      router.push('/'); // <-- Немедленный редирект на главную
    } catch (error: any) {
      console.error(error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Пользователь с таким email не найден.');
          break;
        case 'auth/wrong-password':
          setError('Неверный пароль.');
          break;
        case 'auth/invalid-email':
          setError('Некорректный формат email.');
          break;
        default:
          setError('Произошла ошибка при входе.');
          break;
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в аккаунт</h1>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="********"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 mb-4"
          >
            Войти
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">ИЛИ</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring focus:ring-gray-200"
        >
          <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google" className="h-5 mr-3" />
          Войти с помощью Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Еще нет аккаунта? <Link href="/register" className="text-blue-500 hover:underline">Зарегистрируйтесь</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
