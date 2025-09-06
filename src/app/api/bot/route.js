import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();
  const chatId = data.message?.chat?.id;
  const text = data.message?.text;

  if (!chatId) return NextResponse.json({ ok: false });

  if (text === '/start') {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Привет! Я HelpMamBot. Я могу записать вас на консультацию, дать срочную помощь или показать статьи.',
    });
  }

  if (text?.toLowerCase().includes('консультация')) {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Ваша заявка на консультацию принята! Мы свяжемся с вами.',
    });
  }

  if (text?.toLowerCase().includes('срочно')) {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Мы получили ваш запрос на срочную помощь! Ожидайте ответа от специалиста.',
    });
  }

  if (text?.toLowerCase().includes('статьи')) {
    return NextResponse.json({
      method: 'sendMessage',
      chat_id: chatId,
      text: 'Список статей: https://helpmame.ru/articles',
    });
  }

  return NextResponse.json({
    method: 'sendMessage',
    chat_id: chatId,
    text: 'Я не понял ваш запрос. Используйте /start для инструкций.',
  });
}
