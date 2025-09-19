'use client';

import { useState, useEffect, useMemo } from 'react';
import { IMaskInput } from 'react-imask';

const ConsultationPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [asap, setAsap] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dateOptions = useMemo(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const value = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('ru-RU', { weekday: 'short', month: 'long', day: 'numeric' });
      options.push({ value, label: i === 0 ? `Сегодня, ${label}` : label });
    }
    return options;
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setTimeOptions([]);
      return;
    }

    const options: string[] = [];
    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];
    
    let startHour = 8;
    let startMinute = 0;

    if (isToday) {
      const minTime = new Date();
      let minHour = minTime.getHours();
      let minMinute = minTime.getMinutes();

      if (minMinute > 30) {
        minHour++;
        minMinute = 0;
      } else if (minMinute > 0) {
        minMinute = 30;
      }
      
      if (minHour >= startHour) {
          startHour = minHour;
          startMinute = minMinute;
      }
    }

    for (let h = startHour; h < 22; h++) {
      for (let m = (h === startHour ? startMinute : 0); m < 60; m += 30) {
        options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    
    setTimeOptions(options);
    if (options.length > 0 && !options.includes(selectedTime)) {
        setSelectedTime('');
    }

  }, [selectedDate, selectedTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!name || !phone || (!asap && (!selectedDate || !selectedTime))) {
      setError('Пожалуйста, заполните все обязательные поля и выберите время.');
      setLoading(false);
      return;
    }

    try {
      const dateTime = asap ? null : `${selectedDate}T${selectedTime}`;
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, description, dateTime, asap, type: 'consultation', consultationType: 'online' }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Спасибо! Ваша заявка отправлена. Наш консультант по грудному вскармливанию свяжется с вами в ближайшее время.');
        setName(''); setPhone(''); setDescription('');
        setSelectedDate(''); setSelectedTime(''); setAsap(false);
        window.scrollTo(0, 0);
      } else {
        throw new Error(result.message || 'Произошла ошибка.');
      }
    } catch (err: any) {
      setError(err.message || 'Не удалось отправить заявку.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-cover bg-center py-4" style={{ backgroundImage: "url('/banner.jpeg')" }}>
      <div className="p-6 sm:p-8 bg-white bg-opacity-90 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Онлайн-консультация по грудному вскармливанию (ГВ)</h1>
        <p className="text-center text-gray-600 mb-6">Получите профессиональную помощь от сертифицированного консультанта по ГВ. Мы поможем решить любые проблемы с грудным вскармливанием и наладить комфортное кормление для вас и вашего малыша.</p>

        {message && <p className="bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm">{message}</p>}
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-700 mb-4">Консультация поможет, если вы столкнулись с такими вопросами, как:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
                <li>Больно кормить, трещины на сосках</li>
                <li>Малыш плохо набирает вес</li>
                <li>Недостаток или избыток молока</li>
                <li>Лактостаз или угроза мастита</li>
                <li>Ребенок отказывается от груди</li>
            </ul>
            <p className="text-center text-gray-800 mb-4 font-semibold">Заполните форму, чтобы записаться на консультацию</p>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Ваше имя</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" placeholder="Например, Анна" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">Номер телефона</label>
            <IMaskInput
              mask="+7 (000) 000-00-00"
              id="phone"
              value={phone}
              onAccept={(value: any) => setPhone(value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200"
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Желаемая дата и время</label>
            <div className={`grid grid-cols-2 gap-2 ${asap ? 'opacity-50' : ''}`}>
                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} disabled={asap} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring focus:ring-pink-200">
                    <option value="" disabled>Дата</option>
                    {dateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} disabled={asap || !selectedDate || timeOptions.length === 0} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring focus:ring-pink-200">
                    <option value="" disabled>Время</option>
                    {timeOptions.length > 0 ? timeOptions.map(time => <option key={time} value={time}>{time}</option>) : <option disabled>Нет доступного времени</option>}
                </select>
            </div>
            <div className="mt-2 flex items-center">
              <input type="checkbox" id="asap-consult" checked={asap} onChange={(e) => setAsap(e.target.checked)} className="h-4 w-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500" />
              <label htmlFor="asap-consult" className="ml-2 text-gray-700">Ближайшее возможное время</label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="description">Опишите ваш вопрос (необязательно)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-pink-200" rows={3} placeholder="Например: малыш плохо берет грудь..."></textarea>
          </div>
          <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-400" disabled={loading}>{loading ? 'Отправка...' : 'Записаться на консультацию'}</button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationPage;
