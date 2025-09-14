import { NextRequest, NextResponse } from 'next/server';

// Функция для универсального форматирования сообщения
const formatMessage = (title: string, data: { name: string; phone: string; description?: string }) => {
  let message = `${title}\n\n`;
  message += `*Имя:* ${data.name}\n`;
  message += `*Телефон:* \`${data.phone}\`\n`;

  // Добавляем описание, только если оно есть
  if (data.description) {
    message += `*Описание проблемы:* ${data.description}`;
  }

  return message;
};

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID; // Используем один Chat ID, как вы и просили

  if (!botToken || !chatId) {
    return NextResponse.json(
      { message: 'Ошибка конфигурации сервера: не найдены переменные для Telegram.' },
      { status: 500 }
    );
  }

  try {
    const { name, phone, description, type } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ message: 'Имя и телефон обязательны.' }, { status: 400 });
    }

    let text: string;

    // Определяем заголовок и ID чата в зависимости от типа заявки
    switch (type) {
      case 'urgent':
        text = formatMessage('🚨 *СРОЧНАЯ ЗАЯВКА!* 🚨', { name, phone, description });
        break;
      case 'specialist-call':
        text = formatMessage('📞 *ВЫЗОВ СПЕЦИАЛИСТА* 📞', { name, phone, description });
        break;
      case 'consultation':
      default:
        text = formatMessage('📄 Новая заявка на консультацию', { name, phone, description });
        break;
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
