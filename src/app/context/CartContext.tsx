'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; 
import { useAuth } from './AuthContext';

// Определяем единый тип для товара
export interface BoardItem {
  id: string;
  imageUrls: string[];
  title: string;
  price: number;
  userId?: string;
  createdAt?: any;
}

// Определяем, какие данные и функции будет предоставлять наш контекст
interface CartContextType {
  cartItems: BoardItem[];
  favoriteItems: BoardItem[];
  addToCart: (item: BoardItem) => void;
  removeFromCart: (itemId: string) => void;
  isItemInCart: (itemId: string) => boolean;
  toggleFavorite: (item: BoardItem) => void;
  isItemInFavorites: (itemId: string) => boolean;
  cartTotal: number;
  loading: boolean; // Флаг для отслеживания загрузки данных
}

// Создаем сам контекст
const CartContext = createContext<CartContextType | undefined>(undefined);

// Создаем компонент-"провайдер"
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Получаем текущего пользователя
  const [loading, setLoading] = useState(true);
  
  // Состояния для корзины и избранного теперь инициализируются пустыми
  const [cartItems, setCartItems] = useState<BoardItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<BoardItem[]>([]);

  // Эффект для загрузки и синхронизации данных при изменении пользователя
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        const cartRef = doc(db, 'carts', user.uid);
        const docSnap = await getDoc(cartRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCartItems(data.cartItems || []);
          setFavoriteItems(data.favoriteItems || []);
        } else {
          // Если документа нет, создаем его с пустыми массивами
          await setDoc(cartRef, { cartItems: [], favoriteItems: [] });
          setCartItems([]);
          setFavoriteItems([]);
        }
        setLoading(false);
      } else {
        // Если пользователя нет, очищаем состояния и выключаем загрузку
        setCartItems([]);
        setFavoriteItems([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- Функции для Корзины ---
  const addToCart = async (item: BoardItem) => {
    if (!user) return; // Не добавляем, если пользователь не авторизован
    const newCartItems = [...cartItems, item];
    setCartItems(newCartItems);
    const cartRef = doc(db, 'carts', user.uid);
    await updateDoc(cartRef, { cartItems: newCartItems });
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    const newCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCartItems);
    const cartRef = doc(db, 'carts', user.uid);
    await updateDoc(cartRef, { cartItems: newCartItems });
  };

  const isItemInCart = (itemId: string) => cartItems.some(item => item.id === itemId);

  // --- Функции для Избранного ---
  const toggleFavorite = async (item: BoardItem) => {
    if (!user) return;
    let newFavoriteItems;
    if (isItemInFavorites(item.id)) {
      newFavoriteItems = favoriteItems.filter(fav => fav.id !== item.id);
    } else {
      newFavoriteItems = [...favoriteItems, item];
    }
    setFavoriteItems(newFavoriteItems);
    const cartRef = doc(db, 'carts', user.uid);
    await updateDoc(cartRef, { favoriteItems: newFavoriteItems });
  };

  const isItemInFavorites = (itemId: string) => favoriteItems.some(item => item.id === itemId);
  
  // Считаем общую стоимость
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
      cartTotal,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Кастомный хук для доступа к контексту
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};
