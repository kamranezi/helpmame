'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart, BoardItem } from '../context/CartContext';

interface BoardItemCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
}

export default function BoardItemCard({ id, imageUrl, title, price }: BoardItemCardProps) {
  const { 
    addToCart, 
    removeFromCart, 
    isItemInCart, 
    toggleFavorite, 
    isItemInFavorites 
  } = useCart();

  const item: BoardItem = { id, imageUrl, title, price };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Останавливаем переход по ссылке
    isItemInCart(id) ? removeFromCart(id) : addToCart(item);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Останавливаем переход по ссылке
    toggleFavorite(item);
  };

  return (
    <Link href={`/board/${id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Image 
          src={imageUrl} 
          alt={title} 
          width={300} 
          height={200} 
          className="w-full h-48 object-cover"
        />
        <button onClick={handleFavoriteClick} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white">
          <Image 
            src={isItemInFavorites(id) ? '/icons/like-2.svg' : '/icons/like-1.svg'} 
            alt="Add to favorites" 
            width={24} 
            height={24} 
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
