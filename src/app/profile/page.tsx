'use client';

import { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user, userProfile, logOut } = useAuth();
  const router = useRouter();
  
  // Состояние для полей формы, инициализируется из профиля пользователя
  const [profileData, setProfileData] = useState<UserProfile>({});

  useEffect(() => {
    // Если пользователь не вошел, перенаправляем на главную
    if (!user) {
      router.push('/');
    }
    // Когда профиль загрузится, заполняем форму
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [user, userProfile, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      // Преобразуем числовые поля перед сохранением
      const dataToSave = {
        ...profileData,
        age: profileData.age ? Number(profileData.age) : undefined,
        childAge: profileData.childAge ? Number(profileData.childAge) : undefined,
      };
      await updateDoc(userRef, dataToSave);
      alert('Профиль успешно обновлен!');
    } catch (error) {
      console.error("Ошибка при обновлении профиля: ", error);
      alert('Не удалось обновить профиль.');
    }
  };

  if (!user || !userProfile) {
    return <div>Загрузка...</div>; // Или любой другой лоадер
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ваш профиль</h1>
      
      {userProfile.photoURL && (
          <img src={userProfile.photoURL} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
      )}

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div>
          <label className="block">Имя</label>
          <input type="text" name="firstName" value={profileData.firstName || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Фамилия</label>
          <input type="text" name="lastName" value={profileData.lastName || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Ваш возраст</label>
          <input type="number" name="age" value={profileData.age || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Имя ребенка</label>
          <input type="text" name="childName" value={profileData.childName || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Возраст ребенка</label>
          <input type="number" name="childAge" value={profileData.childAge || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Пол ребенка</label>
          <select name="childGender" value={profileData.childGender || ''} onChange={handleInputChange} className="w-full p-2 border rounded">
            <option value="">Не выбрано</option>
            <option value="male">Мальчик</option>
            <option value="female">Девочка</option>
            <option value="other">Другой</option>
          </select>
        </div>
        <div>
          <label className="block">Адрес</label>
          <input type="text" name="address" value={profileData.address || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Телефон</label>
          <input type="tel" name="phone" value={profileData.phone || ''} onChange={handleInputChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block">Почта (нельзя изменить)</label>
          <input type="email" name="email" value={profileData.email || ''} readOnly className="w-full p-2 border rounded bg-gray-100" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Сохранить изменения
        </button>
      </form>

      <button onClick={logOut} className="mt-8 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfilePage;
