'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BoardItemCard from '../components/BoardItemCard';
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { app } from '../../lib/firebase';
import { useCart } from '../context/CartContext'; // Импортируем хук для доступа к избранному
import { BoardItem } from '../context/CartContext'; // Импортируем тип

// Определяем, какие вкладки у нас есть
enum Tab {
  All,      // Все объявления
  Favorites // Избранное
}

export default function BoardPage() {
  const [allItems, setAllItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.All);

  const { favoriteItems } = useCart(); // Получаем список избранных товаров

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const db = getFirestore(app);
        const itemsCollection = collection(db, 'board');
        const q = query(itemsCollection, orderBy('createdAt', 'desc'));
        const itemSnapshot = await getDocs(q);
        
        const itemsList = itemSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BoardItem));
        
        setAllItems(itemsList);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить объявления. Попробуйте обновить страницу.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Определяем, какие товары показывать в зависимости от активной вкладки
  const displayedItems = activeTab === Tab.All ? allItems : favoriteItems;

  const getTabClass = (tab: Tab) => {
    return activeTab === tab
      ? "pb-2 border-b-2 border-rose-500 font-semibold text-rose-600"
      : "pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700";
  };

  return (
    <div className="bg-white py-10 px-4 sm:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Доска объявлений</h1>
        <Link href="/board/new" legacyBehavior>
          <a className="bg-pink-500 text-white py-2 px-6 rounded-lg hover:bg-pink-600 font-semibold">Добавить объявление</a>
        </Link>
      </div>

      {/* Вкладки для переключения */}
      <div className="flex space-x-8 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab(Tab.All)} className={getTabClass(Tab.All)}>
          Все объявления
        </button>
        <button onClick={() => setActiveTab(Tab.Favorites)} className={getTabClass(Tab.Favorites)}>
          Избранное ({favoriteItems.length})
        </button>
      </div>

      {loading && <p className="text-center py-10">Загрузка объявлений...</p>}
      {error && <p className="text-center text-red-600 py-10">{error}</p>}
      
      {!loading && !error && (
        <>
          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedItems.map((item) => (
                <BoardItemCard 
                  key={item.id}
                  id={item.id}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  price={item.price}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">
              {activeTab === Tab.Favorites 
                ? "В избранном пока ничего нет. Добавьте товары, нажав на сердечко."
                : "Объявлений пока нет."
              }
            </p>
          )}
        </>
      )}
    </div>
  );
}
