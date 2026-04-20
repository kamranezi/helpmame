import { NextResponse } from 'next/server';

// Глобальный массив, который сборщик мусора (GC) не имеет права удалять,
// пока работает приложение.
const globalMemoryLeak: any[] = [];

export async function GET() {
  console.log('⚠️ ВНИМАНИЕ: Запущена плавная утечка RAM!');

  // Каждые 50 миллисекунд добавляем в память новый огромный кусок данных
  const intervalId = setInterval(() => {
    try {
      // Генерируем массив случайных строк. Уникальность строк важна, 
      // чтобы V8 (движок JS) не схитрил и не закешировал их.
      const chunk = new Array(100000).fill(0).map(() => Math.random().toString(36));
      globalMemoryLeak.push(chunk);
      
      console.log(`[Утечка] Добавлен блок. Текущий размер массива: ${globalMemoryLeak.length}`);
    } catch (e) {
      // Если память кончится на уровне JS (до того как убьет Docker)
      console.error('JS Heap Out Of Memory!', e);
      clearInterval(intervalId);
    }
  }, 50);

  // Запрос сразу вернет 200 OK, браузер не зависнет, а на сервере начнется потоп
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Фоновая утечка RAM началась! Смотри графики.' 
  });
}