'use client';

import { useState } from 'react';

const ConsultationPage = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!phone) {
      setError('Пожалуйста, введите номер телефона.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Спасибо! Ваша заявка отправлена. Мы скоро с вами свяжемся.');
        setPhone(''); // Очищаем поле после успеха
      } else {
        throw new Error(result.message || 'Произошла ошибка при отправке.');
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить заявку. Попробуйте позже.');
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Заявка на консультацию</h1>
        <p className="text-center text-gray-600 mb-6">Оставьте свой номер телефона, и наш специалист свяжется с вами в ближайшее время.</p>

        {message && <p className="bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Номер телефона
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-gray-400"
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
