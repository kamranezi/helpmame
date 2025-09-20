'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const handleOrder = async () => {
    // Логика оформления заказа (пока не реализована)
    console.log("Оформление заказа...");
    alert('Заказ оформлен! (временно)');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 mb-4">Ваша корзина пуста</p>
          <Link href="/board" legacyBehavior>
            <a className="bg-rose-500 text-white py-2 px-6 rounded-lg hover:bg-rose-600 font-semibold">Перейти к объявлениям</a>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
                // ИСПРАВЛЕНО: Используем первое изображение из массива imageUrls
                const mainImageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '/placeholder.jpg';

                return (
                    <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-md overflow-hidden">
                            <Image 
                                src={mainImageUrl} 
                                alt={item.title} 
                                layout="fill" 
                                objectFit="cover" 
                                onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">{item.title}</h2>
                            <p className="text-gray-600">{item.price.toLocaleString('ru-RU')} руб.</p>
                        </div>
                        </div>
                        <button 
                        onClick={() => handleRemove(item.id)} 
                        className="text-red-500 hover:text-red-700 font-semibold"
                        >
                        Убрать из корзины
                        </button>
                    </div>
                );
            })}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Итого</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Товары ({cartItems.length} шт.)</span>
              <span>{cartTotal.toLocaleString('ru-RU')} руб.</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
              <span>К оплате</span>
              <span>{cartTotal.toLocaleString('ru-RU')} руб.</span>
            </div>
            <button 
              onClick={handleOrder} 
              className="w-full bg-green-500 text-white py-3 mt-6 rounded-lg hover:bg-green-600 font-bold text-lg"
            >
              Оформить заказ
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
  Нажимая "Оформить заказ", вы соглашаетесь с{' '}
  <Link href="/privacy" className="text-rose-500 hover:underline">
    Политикой конфиденциальности
  </Link>{' '}
  нашей платформы.
</p>
          </div>
        </div>
      )}
    </div>
  );
}
