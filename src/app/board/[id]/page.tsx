'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getFirestore, doc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext';
import { useCart, BoardItem } from '../../context/CartContext';
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
    imageUrls: string[];
    createdAt: Timestamp;
}

const ItemDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { 
        addToCart, 
        removeFromCart, 
        isItemInCart, 
        toggleFavorite, 
        isItemInFavorites 
    } = useCart();
    const id = params.id as string;

    const [item, setItem] = useState<BoardItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!id) return;
        const fetchItem = async () => {
            try {
                const db = getFirestore(app);
                const docRef = doc(db, "board", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() } as BoardItemDetails;
                    setItem(data);
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
                await deleteDoc(doc(db, "board", id));
                router.push('/board');
            } catch (err) {
                console.error("Ошибка при удалении: ", err);
                setError("Не удалось удалить объявление. Попробуйте снова.");
                setIsDeleting(false);
            }
        }
    };
    
    const formatTimestamp = (timestamp: Timestamp) => {
        if (!timestamp) return 'Дата не указана';
        return new Date(timestamp.seconds * 1000).toLocaleString('ru-RU', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    const handlePrev = () => {
        if (!item || !item.imageUrls) return;
        setCurrentIndex((prev) => (prev === 0 ? item.imageUrls.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (!item || !item.imageUrls) return;
        setCurrentIndex((prev) => (prev === item.imageUrls.length - 1 ? 0 : prev + 1));
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
    
    const validImageUrls = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : ['/placeholder.jpg'];
    const hasMultipleImages = validImageUrls.length > 1;
    const isOwner = user && user.uid === item.userId;
    const itemForCart: BoardItem = { id: item.id, title: item.title, price: item.price, imageUrls: item.imageUrls };

    return (
        <div className="bg-white py-10 px-4 sm:px-10">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* --- ИЗМЕНЕНО: Комбинированный блок слайдера и галереи --- */}
                    <div>
                        <div className="relative w-full h-96 group mb-4">
                            <Image 
                                src={validImageUrls[currentIndex]} 
                                alt={item.title} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-lg shadow-lg"
                                onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                            />
                            {hasMultipleImages && (
                            <>
                                <button 
                                onClick={handlePrev}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
                                aria-label="Previous image"
                                >
                                <Image src="/icons/back.svg" alt="Назад" width={24} height={24} />
                                </button>
                                <button 
                                onClick={handleNext}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
                                aria-label="Next image"
                                >
                                <Image src="/icons/next.svg" alt="Вперед" width={24} height={24} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                                {validImageUrls.map((_, index) => (
                                    <span
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`block w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                                    />
                                ))}
                                </div>
                            </>
                            )}
                        </div>
                        
                        {/* --- ИЗМЕНЕНО: Галерея миниатюр возвращена --- */}
                        {hasMultipleImages && (
                            <div className="flex space-x-2 overflow-x-auto p-1">
                                {validImageUrls.map((url, index) => (
                                    <div key={index} 
                                        className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${currentIndex === index ? 'border-rose-500' : 'border-transparent'}`}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <Image src={url} alt={`${item.title} thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                                    <Link href={`/board/${id}/edit`} className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 font-semibold text-center">
                                        Редактировать
                                    </Link>
                                    <button onClick={handleDelete} disabled={isDeleting} className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 font-semibold disabled:bg-gray-400">
                                        {isDeleting ? 'Удаление...' : 'Удалить'}
                                    </button>
                                </div>
                            )}

                            {!isOwner && user && (
                                <div className="flex items-center space-x-4">
                                    <button 
                                        onClick={() => isItemInCart(id) ? removeFromCart(id) : addToCart(itemForCart)}
                                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${isItemInCart(id) ? 'bg-gray-200 text-gray-800' : 'bg-rose-500 text-white hover:bg-rose-600'}`}>
                                        {isItemInCart(id) ? 'Убрать из корзины' : 'Добавить в корзину'}
                                    </button>
                                    <button 
                                        onClick={() => toggleFavorite(itemForCart)} 
                                        className="p-1.5 rounded-full bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all duration-200 hover:scale-110"
                                    >
                                        <Image 
                                            src={isItemInFavorites(id) ? '/icons/like-2.svg' : '/icons/like-1.svg'} 
                                            alt="Add to favorites" 
                                            width={32} 
                                            height={32} 
                                        />
                                    </button>
                                </div>
                            )}
                            {!user && (
                                <p className="text-sm text-gray-600"> <Link href="/login" className="text-rose-500 hover:underline">Войдите</Link>, чтобы добавить товар в корзину.</p>
                            )}
                            
                            <p className="text-sm text-gray-500 mt-4">Опубликовано: {formatTimestamp(item.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsPage;
