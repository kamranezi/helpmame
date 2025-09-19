'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart, BoardItem } from '../context/CartContext';

interface BoardItemCardProps {
  id: string;
  imageUrls: string[];
  title: string;
  price: number;
}

export default function BoardItemCard({ id, imageUrls, title, price }: BoardItemCardProps) {
  const { 
    addToCart, 
    removeFromCart, 
    isItemInCart, 
    toggleFavorite, 
    isItemInFavorites 
  } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const validImageUrls = imageUrls && imageUrls.length > 0 ? imageUrls : ['/placeholder.jpg'];
  const hasMultipleImages = validImageUrls.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImageUrls.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === validImageUrls.length - 1 ? 0 : prev + 1));
  };

  const item: BoardItem = { id, imageUrls, title, price };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isItemInCart(id) ? removeFromCart(id) : addToCart(item);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(item);
  };

  return (
    <Link href={`/board/${id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        <Image 
          src={validImageUrls[currentIndex]}
          alt={title} 
          width={300} 
          height={200} 
          className="w-full h-48 object-cover transition-transform duration-300 transform-gpu"
          onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
        />

        {hasMultipleImages && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
              aria-label="Previous image"
            >
              <Image src="/icons/back.svg" alt="Назад" width={20} height={20} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/60"
              aria-label="Next image"
            >
              <Image src="/icons/next.svg" alt="Вперед" width={20} height={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {validImageUrls.map((_, index) => (
                <span
                  key={index}
                  className={`block w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        <button 
          onClick={handleFavoriteClick} 
          className="absolute top-2 right-2 p-0.5 rounded-full bg-white shadow-md transition-transform duration-200 hover:scale-110 z-10"
        >
          <Image 
            src={isItemInFavorites(id) ? '/icons/like-2.svg' : '/icons/like-1.svg'} 
            alt="Add to favorites" 
            width={28} 
            height={28} 
          />
        </button>
      </div>
      {/* --- ИЗМЕНЕНО: Flexbox-выравнивание убрано --- */}
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <p className="text-gray-600 mt-1 font-bold text-xl">{price.toLocaleString('ru-RU')} руб.</p>
        <button 
          onClick={handleCartClick}
          className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-colors ${isItemInCart(id) ? 'bg-gray-200 text-gray-800' : 'bg-rose-500 text-white hover:bg-rose-600'}`}>
          {isItemInCart(id) ? 'Убрать из корзины' : 'Добавить в корзину'}
        </button>
      </div>
    </Link>
  );
}
