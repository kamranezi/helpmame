
import { NextResponse } from 'next/server';

export async function GET(request) {
  // TODO: Восстановите вашу оригинальную логику для бота здесь.
  // Это базовый шаблон для API-маршрута.
  return NextResponse.json({ message: "Bot API is active" });
}

export async function POST(request) {
    const data = await request.json();
    // TODO: Восстановите вашу оригинальную логику для бота здесь.
    console.log('Received data:', data);
    return NextResponse.json({ message: "Bot API received a POST request", data });
}
