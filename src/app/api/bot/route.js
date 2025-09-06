import { NextResponse } from 'next/server';

// В реальном проекте подключай базу для хранения заявок, пользователей и т.д.
export async function POST(req) {
  const data = await req.json();
  const chatId = data.message?.chat?.id;
  const text = data.message?.text;

  console.log('Incoming Telegram message:', text);

  // Приветствие
  if (text === '/start') {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Привет! Я HelpMamBot. Я могу записать вас на консультацию, дать срочную помощь или показать статьи.',
    });
  }

  // Запись на консультацию
  if (text?.toLowerCase().includes('консультация')) {
    // Тут можно сохранять в базу
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Ваша заявка на консультацию принята! Мы свяжемся с вами.',
    });
  }

  // Срочная помощь
  if (text?.toLowerCase().includes('срочно')) {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Мы получили ваш запрос на срочную помощь! Ожидайте ответа от специалиста.',
    });
  }

  // Форум / статьи
  if (text?.toLowerCase().includes('статьи')) {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Список статей: https://helpmame.ru/articles',
    });
  }

  // По умолчанию
  return NextResponse.json({
    method: 'sendMessage',
    chat_id: chatId,
    text: 'Я не понял ваш запрос. Используйте /start для инструкций.',
  });
}
