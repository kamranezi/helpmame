import Image from 'next/image';
import Button from './components/Button';

export default function HomePage() {
  return (
    <div className="text-center space-y-6 px-4">
      <h1 className="text-3xl sm:text-4xl text-pink-600 font-bold">Добро пожаловать в HelpMame!</h1>
      <p>Помощь онлайн и оффлайн для ваших мам.</p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button href="/consultation">Записаться на консультацию</Button>
        <Button href="/urgent" variant="red">Срочная онлайн помощь</Button>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <Image
          src="/banner.jpeg"
          alt="Banner"
          width={1200}
          height={400}
          layout="responsive"
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
