'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from '../../../lib/firebase';

const NewItemPage = () => {
  const { user } = useAuth(); 
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('одежда');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('унисекс');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ВАЖНО: В реальном проекте ключ API следует хранить в переменных окружения на сервере,
  // а не в клиентском коде для безопасности.
  const IMGBB_API_KEY = 'adc437ee13731c5fafb9f3ebfa6b7d28';

  if (!user) {
    return (
        <div className="text-center py-10">
            <p className="text-lg">Пожалуйста, <a href="/login" className="text-rose-500 hover:underline">войдите в систему</a>, чтобы добавить объявление.</p>
        </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address || !image) {
        setError('Пожалуйста, заполните все обязательные поля и загрузите фото.');
        return;
    }
    setLoading(true);
    setError('');

    try {
        // 1. Загрузка изображения на ImgBB
        const formData = new FormData();
        formData.append('image', image);
        formData.append('key', IMGBB_API_KEY);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке изображения.');
        }

        const imgbbData = await response.json();
        const imageUrl = imgbbData.data.url;

        if (!imageUrl) {
            throw new Error('Не удалось получить URL изображения после загрузки.');
        }

        // 2. Сохранение данных в Firestore
        const db = getFirestore(app);
        await addDoc(collection(db, "board"), {
            userId: user.uid,
            title,
            description,
            price: parseFloat(price),
            category,
            age: age ? parseInt(age) : null,
            gender,
            address,
            imageUrl: imageUrl, // Используем URL от ImgBB
            createdAt: serverTimestamp()
        });

        setLoading(false);
        router.push('/board');

    } catch (e) {
        console.error("Error adding document: ", e);
        setError(e instanceof Error ? e.message : 'Произошла ошибка при создании объявления.');
        setLoading(false);
    }
  };

  return (
    <div className="bg-white py-10 px-4 sm:px-10">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Новое объявление</h1>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold" htmlFor="title">Название объявления</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" placeholder="Например, Молокоотсос ручной" required />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Фото</label>
                    <input type="file" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" required/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="category">Категория</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring focus:ring-pink-200">
                            <option>одежда</option>
                            <option>игрушка</option>
                            <option>комфорт</option>
                            <option>питание</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="age">Возраст (в месяцах)</label>
                        <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" placeholder="Например, 6" />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-semibold" htmlFor="gender">Пол</label>
                    <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring focus:ring-pink-200">
                        <option>унисекс</option>
                        <option>мальчик</option>
                        <option>девочка</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-semibold" htmlFor="description">Описание</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" rows={4} placeholder="Расскажите подробнее о товаре..."></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="price">Цена (руб.)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" placeholder="Например, 1500" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="address">Адрес</label>
                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" placeholder="Город, район или метро" required />
                    </div>
                </div>

                <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 disabled:bg-gray-400 font-semibold" disabled={loading}>{loading ? 'Публикация...' : 'Опубликовать объявление'}</button>
            </form>
        </div>
    </div>
  );
};

export default NewItemPage;
