'use client';

import Link from 'next/link';
import Image from 'next/image';
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

  const mainImageUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : '/placeholder.jpg';
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
      <div className="relative">
        <Image 
          src={mainImageUrl} 
          alt={title} 
          width={300} 
          height={200} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
        />
        {/* ИЗМЕНЕНО: Отступ уменьшен до p-0.5 для максимального заполнения */}
        <button 
          onClick={handleFavoriteClick} 
          className="absolute top-2 right-2 p-0.5 rounded-full bg-white shadow-md transition-transform duration-200 hover:scale-110"
        >
          <Image 
            src={isItemInFavorites(id) ? '/icons/like-2.svg' : '/icons/like-1.svg'} 
            alt="Add to favorites" 
            width={28} 
            height={28} 
          />
        </button>
      </div>
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
