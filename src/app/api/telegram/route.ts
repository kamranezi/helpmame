import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return NextResponse.json(
      { message: 'Ошибка конфигурации сервера: не найдены токен или ID чата для Telegram.' },
      { status: 500 }
    );
  }

  try {
    // Получаем не только телефон, но и тип заявки
    const { phone, type } = await req.json();

    if (!phone) {
      return NextResponse.json({ message: 'Номер телефона не указан.' }, { status: 400 });
    }

    let text: string;

    // Проверяем тип заявки и формируем разный текст
    if (type === 'urgent') {
      text = `🚨 *СРОЧНАЯ ЗАЯВКА!* 🚨\n\nТребуется немедленная помощь!\n\n*Телефон:* \`${phone}\``;
    } else {
      text = `Новая заявка на консультацию!\n\nТелефон: \`${phone}\``;
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API Error:', result);
      throw new Error('Не удалось отправить сообщение в Telegram.');
    }

    return NextResponse.json({ message: 'Заявка успешно отправлена!' });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера.' }, { status: 500 });
  }
}
