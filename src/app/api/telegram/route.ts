
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
  // Теперь читаем несколько ID из переменной окружения
  const chatIdsEnv = process.env.TELEGRAM_CHAT_IDS; 

  if (!botToken || !chatIdsEnv) {
    return NextResponse.json(
      { message: 'Ошибка конфигурации сервера: не найдены переменные для Telegram.' },
      { status: 500 }
    );
  }

  // Разделяем строку с ID на массив
  const chatIds = chatIdsEnv.split(',').map(id => id.trim());

  try {
    const { name, phone, description, type } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ message: 'Имя и телефон обязательны.' }, { status: 400 });
    }

    let text: string;

    // Определяем заголовок в зависимости от типа заявки
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

    // Создаем массив промисов для отправки сообщений в каждый чат
    const sendPromises = chatIds.map(chatId => 
      fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId, 
          text: text,
          parse_mode: 'Markdown',
        }),
      })
    );

    // Ожидаем выполнения всех запросов
    const responses = await Promise.all(sendPromises);

    // Проверяем каждый ответ
    for (const response of responses) {
      const result = await response.json();
      if (!result.ok) {
        console.error('Telegram API Error:', result);
        // Если один из запросов неудачен, выбрасываем ошибку
        throw new Error('Не удалось отправить сообщение в один из чатов Telegram.');
      }
    }

    return NextResponse.json({ message: 'Заявка успешно отправлена во все чаты!' });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера.' }, { status: 500 });
  }
}
