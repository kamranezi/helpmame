import { NextRequest, NextResponse } from 'next/server';

// Функция для форматирования даты, если она есть
const formatDateTime = (dateTime: string | undefined) => {
  if (!dateTime) return 'Не указано';
  try {
    return new Date(dateTime).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateTime; // Возвращаем как есть, если формат некорректен
  }
}

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsEnv = process.env.TELEGRAM_CHAT_IDS; 

  if (!botToken || !chatIdsEnv) {
    return NextResponse.json(
      { message: 'Ошибка конфигурации сервера: не найдены переменные для Telegram.' },
      { status: 500 }
    );
  }

  const chatIds = chatIdsEnv.split(',').map(id => id.trim());

  try {
    // Получаем все возможные данные из тела запроса
    const { 
      name, 
      phone, 
      description, 
      type, 
      consultationType, 
      address, 
      dateTime, 
      asap 
    } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ message: 'Имя и телефон обязательны.' }, { status: 400 });
    }

    let text: string;

    // Общая информация для всех заявок
    let baseInfo = `*Имя:* ${name}\\n*Телефон:* \`${phone}\`\\n`;

    // Логика формирования текста сообщения
    switch (type) {
      case 'urgent':
        text = `🚨 *СРОЧНАЯ ЗАЯВКА!* 🚨\\n\\n${baseInfo}`;
        if (description) text += `*Описание:* ${description}`;
        break;

      case 'specialist-call': {
        let title = '📞 *ВЫЗОВ СПЕЦИАЛИСТА НА ДОМ* 📞';
        let timeInfo = asap ? '*Время:* Ближайшее возможное' : `*Желаемое время:* ${formatDateTime(dateTime)}`;
        
        text = `${title}\\n\\n${baseInfo}`;
        if (address) text += `*Адрес:* ${address}\\n`;
        text += `${timeInfo}\\n`;
        if (description) text += `*Описание проблемы:* ${description}`;
        break;
      }

      case 'consultation':
      default: {
        const isHomeVisit = consultationType === 'home_visit';
        let title = isHomeVisit 
          ? '📄 *Новая заявка: Вызов на дом*' 
          : '📄 *Новая заявка: Онлайн-консультация*';
        
        let timeInfo = asap ? '*Время:* Ближайшее возможное' : `*Желаемое время:* ${formatDateTime(dateTime)}`;

        text = `${title}\\n\\n${baseInfo}`;
        if (isHomeVisit && address) {
          text += `*Адрес:* ${address}\\n`;
        }
        text += `${timeInfo}\\n`;
        if (description) {
          text += `*Описание вопроса:* ${description}`;
        }
        break;
      }
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const sendPromises = chatIds.map(chatId => 
      fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' }),
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ message: 'Заявка успешно отправлена!' });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Внутренняя ошибка сервера.' }, { status: 500 });
  }
}
