'use client';

import { useState } from 'react';

const ConsultationPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!name || !phone) {
      setError('Пожалуйста, введите ваше имя и номер телефона.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, description, type: 'consultation' }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Спасибо! Ваша заявка отправлена. Мы скоро с вами свяжемся.');
        setName('');
        setPhone('');
        setDescription('');
      } else {
        throw new Error(result.message || 'Произошла ошибка при отправке.');
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить заявку. Попробуйте позже.');
    }

    setLoading(false);
  };

  return (
    <div 
      className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-cover bg-center py-4"
      style={{ backgroundImage: "url('/banner.jpeg')" }}
    >
      <div className="p-6 sm:p-8 bg-white bg-opacity-90 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Заявка на онлайн-консультацию</h1>
        <p className="text-center text-gray-600 mb-6">Оставьте свои данные, и наш консультант по ГВ свяжется с вами в ближайшее время.</p>

        {message && <p className="bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Ваше имя</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200"
              placeholder="Например, Анна"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">Номер телефона</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200"
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="description">Опишите ваш вопрос (необязательно)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200"
              rows={3}
              placeholder="Например: малыш плохо берет грудь, есть ли трещины..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-200 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationPage;
