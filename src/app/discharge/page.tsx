'use client';

import React from 'react';
import Image from 'next/image';
import { useCart, BoardItem } from '../context/CartContext';
import Link from 'next/link';

// Товары для выписки
const dischargeItems: Omit<BoardItem, 'id'>[] = [
  {
    title: 'Конверт на выписку \"Зефирка\"',
    price: 3500,
    imageUrls: ['/logo.jpg'],
  },
  {
    title: 'Комплект одежды \"Мой первый день\"',
    price: 2800,
    imageUrls: ['/logo.jpg'],
  },
  {
    title: 'Набор подгузников Merries (0-5 кг)',
    price: 1500,
    imageUrls: ['/logo.jpg'],
  },
  {
    title: 'Бутылочка для кормления Philips Avent',
    price: 800,
    imageUrls: ['/logo.jpg'],
  },
  {
    title: 'Автолюлька Maxi-Cosi (0+)',
    price: 12500,
    imageUrls: ['/logo.jpg'],
  },
    {
    title: 'Праздничные шары \"Спасибо за сына/дочь!\"',
    price: 1800,
    imageUrls: ['/logo.jpg'],
  },
];

// Добавляем уникальные ID к каждому товару
const products: BoardItem[] = dischargeItems.map((item, index) => ({
  ...item,
  id: `discharge-${index + 1}`,
}));

const ProductCard = ({ item }: { item: BoardItem }) => {
  const { addToCart, removeFromCart, isItemInCart } = useCart();
  const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/placeholder.jpg';
  const inCart = isItemInCart(item.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <Link href={`#`} passHref>
            <div className="relative h-48 w-full">
                <Image 
                    src={imageUrl}
                    alt={item.title} 
                    layout="fill" 
                    objectFit="cover"
                    onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} // На случай если картинка не загрузится
                />
            </div>
        </Link>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg truncate flex-grow">{item.title}</h3>
            <p className="text-gray-600 mt-1">{item.price.toLocaleString('ru-RU')} руб.</p>
            <div className="mt-4">
              {inCart ? (
                  <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-gray-600"
                  >
                      Убрать из корзины
                  </button>
              ) : (
                  <button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-rose-500 text-white py-2 rounded-lg font-semibold transition-colors duration-300 hover:bg-rose-600"
                  >
                      Добавить в корзину
                  </button>
              )}
            </div>
        </div>
    </div>
  )
}

export default function DischargePage() {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Товары к выписке</h1>
            <p className="text-lg text-gray-500 mt-2">Все самое необходимое для счастливой встречи из роддома!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(item => (
                <ProductCard key={item.id} item={item} />
            ))}
        </div>
    </div>
  );
}