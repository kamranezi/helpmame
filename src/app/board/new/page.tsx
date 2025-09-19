'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from '../../../lib/firebase';
import Image from 'next/image';

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
  const [images, setImages] = useState<File[]>([]); // Состояние для нескольких файлов
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const IMGBB_API_KEY = 'adc437ee13731c5fafb9f3ebfa6b7d28';

  if (!user) {
    return (
        <div className="text-center py-10">
            <p className="text-lg">Пожалуйста, <a href="/login" className="text-rose-500 hover:underline">войдите в систему</a>, чтобы добавить объявление.</p>
        </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Преобразуем FileList в массив и добавляем к существующим
      const newFiles = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...newFiles]);
    }
  };
  
  // Функция для удаления изображения из превью
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address || images.length === 0) {
        setError('Пожалуйста, заполните все обязательные поля и загрузите хотя бы одно фото.');
        return;
    }
    setLoading(true);
    setError('');

    try {
        // 1. Загрузка всех изображений на ImgBB
        const imageUrls = await Promise.all(
            images.map(async (image) => {
                const formData = new FormData();
                formData.append('image', image);
                formData.append('key', IMGBB_API_KEY);

                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Ошибка при загрузке одного из изображений.');
                }

                const imgbbData = await response.json();
                if (!imgbbData.data.url) {
                    throw new Error('Не удалось получить URL изображения после загрузки.');
                }
                return imgbbData.data.url;
            })
        );

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
            imageUrls: imageUrls, // Сохраняем массив URL
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
                    <label className="block text-gray-700 mb-2 font-semibold">Фото (до 5 шт., первая будет главной)</label>
                    <input type="file" onChange={handleImageChange} multiple className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" required/>
                    {/* Превью загруженных изображений */}
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {images.map((file, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="w-full h-24 object-cover rounded-md"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveImage(index)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100 transition-opacity"
                                >
                                    X
                                </button>
                                {index === 0 && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 rounded-b-md">Главное</div>}
                            </div>
                        ))}
                    </div>
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
