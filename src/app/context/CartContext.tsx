'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Определяем единый тип для товара, чтобы использовать его везде
export interface BoardItem {
  id: string;
  imageUrls: string[]; // Теперь это массив для нескольких изображений
  title: string;
  price: number;
  userId?: string; 
  createdAt?: any; // Добавляем поле для времени создания/обновления
}

// Определяем, какие данные и функции будет предоставлять наш контекст
interface CartContextType {
  cartItems: BoardItem[];
  favoriteItems: BoardItem[];
  addToCart: (item: BoardItem) => void;
  removeFromCart: (itemId: string) => void;
  isItemInCart: (itemId: string) => boolean;
  toggleFavorite: (item: BoardItem) => void; // Одна функция для добавления/удаления
  isItemInFavorites: (itemId: string) => boolean;
  cartTotal: number;
}

// Создаем сам контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Создаем компонент-"провайдер", который будет "заворачивать" наше приложение
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Используем ленивую инициализацию, чтобы данные из localStorage читались только один раз
  const [cartItems, setCartItems] = useState<BoardItem[]>(() => {
      if (typeof window === 'undefined') return [];
      const savedCart = window.localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favoriteItems, setFavoriteItems] = useState<BoardItem[]>(() => {
      if (typeof window === 'undefined') return [];
      const savedFavorites = window.localStorage.getItem('favoriteItems');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Сохраняем изменения в корзине в localStorage
  useEffect(() => {
    window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Сохраняем изменения в избранном в localStorage
  useEffect(() => {
    window.localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // --- Функции для Корзины ---
  const addToCart = (item: BoardItem) => {
    setCartItems(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const isItemInCart = (itemId: string) => {
    return cartItems.some(item => item.id === itemId);
  };

  // --- Функции для Избранного ---
  const toggleFavorite = (item: BoardItem) => {
    if (isItemInFavorites(item.id)) {
      setFavoriteItems(prev => prev.filter(fav => fav.id !== item.id));
    } else {
      setFavoriteItems(prev => [...prev, item]);
    }
  };

  const isItemInFavorites = (itemId: string) => {
    return favoriteItems.some(item => item.id === itemId);
  };

  // Считаем общую стоимость товаров в корзине
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        favoriteItems, 
        addToCart, 
        removeFromCart, 
        isItemInCart,
        toggleFavorite,
        isItemInFavorites,
        cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Создаем кастомный хук для удобного доступа к контексту из любого компонента
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};
