import { NextResponse } from 'next/server';

// В реальном проекте использовать БД (Postgres, Firebase Auth и т.д.)
const users = [
  { email: 'test@example.com', password: '123456', name: 'Тест' },
];

export async function POST(req) {
  const { email, password } = await req.json();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return NextResponse.json({ message: `Привет, ${user.name}!` });
  } else {
    return NextResponse.json({ message: 'Неверный email или пароль' });
  }
}
