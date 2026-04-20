// Файл: app/api/crash/route.ts (внутри проекта helpmame)
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('⚠️ Имитация утечки памяти запущена...');
  const leak = [];
  try {
    // Бесконечный цикл, который за секунды выжрет всю память
    while (true) {
      leak.push(new Array(100000).fill('MEMORY_LEAK_TEST'));
    }
  } catch (e) {
    // Сюда код никогда не дойдет из-за OOM (Out of Memory)
    console.error('Ошибка:', e);
  }
  return NextResponse.json({ status: 'ok' });
}