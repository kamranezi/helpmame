'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getFirestore, doc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
// Импорты Storage больше не нужны, так как мы не взаимодействуем с ним при удалении
import { useAuth } from '../../context/AuthContext';
import { app } from '../../../lib/firebase';

interface BoardItemDetails {
    id: string;
    userId: string;
    title: string;
    description: string;
    price: number;
    category: string;
    age?: number;
    gender: string;
    address: string;
    imageUrl: string;
    createdAt: Timestamp;
}

const ItemDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const id = params.id as string;

    const [item, setItem] = useState<BoardItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchItem = async () => {
            try {
                const db = getFirestore(app);
                const docRef = doc(db, "board", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItem({ id: docSnap.id, ...docSnap.data() } as BoardItemDetails);
                } else {
                    setError('Объявление не найдено.');
                }
            } catch (err) {
                console.error(err);
                setError('Произошла ошибка при загрузке данных.');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleDelete = async () => {
        if (!item || !user || user.uid !== item.userId) return;
        
        if (window.confirm("Вы уверены, что хотите удалить это объявление?")) {
            setIsDeleting(true);
            try {
                const db = getFirestore(app);

                // Шаг удаления изображения из Firebase Storage полностью убран.
                // Мы просто удаляем запись из базы данных.
                
                await deleteDoc(doc(db, "board", id));

                router.push('/board');
            } catch (err) {
                console.error("Ошибка при удалении: ", err);
                setError("Не удалось удалить объявление. Попробуйте снова.");
                setIsDeleting(false);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-20">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    if (!item) {
        return null;
    }
    
    const isOwner = user && user.uid === item.userId;

    return (
        <div className="bg-white py-10 px-4 sm:px-10">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {item.imageUrl && (
                        <div className="relative w-full h-96">
                            <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" className="rounded-lg shadow-lg"/>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
                        <p className="text-3xl font-bold text-rose-500 mb-6">{item.price.toLocaleString('ru-RU')} руб.</p>
                        
                        <div className="space-y-3 text-gray-700 mb-6">
                           <p><span className="font-semibold">Категория:</span> {item.category}</p>
                           {item.age && <p><span className="font-semibold">Возраст:</span> {item.age} мес.</p>}
                           <p><span className="font-semibold">Пол:</span> {item.gender}</p>
                           <p className="mt-4"><span className="font-semibold">Описание:</span> {item.description || "Без описания"}</p>
                        </div>
                        
                        <div className="mt-auto">
                           <p className="text-lg font-semibold text-gray-800 mt-2 mb-4">Адрес: {item.address}</p>
                            {isOwner && (
                                <div className="flex space-x-4">
                                    <Link href={`/board/${id}/edit`} className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 font-semibold">
                                        Редактировать
                                    </Link>
                                    <button onClick={handleDelete} disabled={isDeleting} className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 font-semibold disabled:bg-gray-400">
                                        {isDeleting ? 'Удаление...' : 'Удалить'}
                                    </button>
                                </div>
                            )}
                            <p className="text-sm text-gray-500 mt-4">Опубликовано: {new Date(item.createdAt.seconds * 1000).toLocaleDateString('ru-RU')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsPage;
