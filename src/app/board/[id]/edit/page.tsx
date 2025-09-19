'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from '../../../../lib/firebase';
import Image from 'next/image';

const EditItemPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Поля формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('одежда');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('унисекс');
  const [address, setAddress] = useState('');
  
  // Управление изображениями
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  // Состояния UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const IMGBB_API_KEY = 'adc437ee13731c5fafb9f3ebfa6b7d28';

  useEffect(() => {
    if (!id || !user) return;

    const fetchItem = async () => {
      const db = getFirestore(app);
      const docRef = doc(db, "board", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const itemData = docSnap.data();
        if (itemData.userId !== user.uid) {
          setError("У вас нет прав для редактирования этого объявления.");
          setInitialLoading(false);
          return;
        }

        setTitle(itemData.title);
        setDescription(itemData.description || '');
        setPrice(itemData.price.toString());
        setCategory(itemData.category);
        setAge(itemData.age ? itemData.age.toString() : '');
        setGender(itemData.gender);
        setAddress(itemData.address);
        setExistingImageUrls(itemData.imageUrls || []);
      } else {
        setError('Объявление не найдено.');
      }
      setInitialLoading(false);
    };

    fetchItem();
  }, [id, user]);

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const removeNewImage = (indexToRemove: number) => {
    setNewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address || (existingImageUrls.length === 0 && newImages.length === 0)) {
      setError('Пожалуйста, заполните обязательные поля и добавьте хотя бы одно фото.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Загрузка новых изображений
      const newImageUrls = await Promise.all(
        newImages.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image);
          formData.append('key', IMGBB_API_KEY);

          const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Ошибка загрузки изображения.');
          const imgbbData = await response.json();
          return imgbbData.data.url;
        })
      );

      // 2. Объединение старых и новых URL
      const finalImageUrls = [...existingImageUrls, ...newImageUrls];

      // 3. Обновление документа в Firestore
      const db = getFirestore(app);
      const docRef = doc(db, "board", id);
      await updateDoc(docRef, {
        title,
        description,
        price: parseFloat(price),
        category,
        age: age ? parseInt(age) : null,
        gender,
        address,
        imageUrls: finalImageUrls, // Сохраняем итоговый массив
      });

      setLoading(false);
      router.push(`/board/${id}`);

    } catch (e) {
      console.error("Error updating document: ", e);
      setError(e instanceof Error ? e.message : 'Произошла ошибка при обновлении.');
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center py-10">Загрузка данных...</div>;
  }

  if (error && !title) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white py-10 px-4 sm:px-10">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Редактировать объявление</h1>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Поля для текста */}
                 <div>
                    <label className="block text-gray-700 mb-2 font-semibold" htmlFor="title">Название объявления</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" required />
                </div>
                
                {/* Управление изображениями */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Фотографии</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                        {/* Существующие изображения */}
                        {existingImageUrls.map((url) => (
                             <div key={url} className="relative group">
                                <Image src={url} alt="Existing image" width={100} height={100} className="w-full h-24 object-cover rounded-md" />
                                <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100">X</button>
                            </div>
                        ))}
                        {/* Превью новых изображений */}
                        {newImages.map((file, index) => (
                             <div key={index} className="relative group">
                                <Image src={URL.createObjectURL(file)} alt={`New preview ${index}`} width={100} height={100} className="w-full h-24 object-cover rounded-md" />
                                <button type="button" onClick={() => removeNewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-75 group-hover:opacity-100">X</button>
                            </div>
                        ))}
                    </div>
                     <label className="block text-gray-700 mt-4 mb-2 font-semibold">Добавить новые фото</label>
                    <input type="file" multiple onChange={handleNewImagesChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
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
                        <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" />
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
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" rows={4}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="price">Цена (руб.)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="address">Адрес</label>
                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" required />
                    </div>
                </div>

                <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 disabled:bg-gray-400 font-semibold" disabled={loading}>{loading ? 'Сохранение...' : 'Сохранить изменения'}</button>
            </form>
        </div>
    </div>
  );
};

export default EditItemPage;
