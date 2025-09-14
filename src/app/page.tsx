import Button from './components/Button';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl text-pink-600 font-bold">Добро пожаловать в HelpMame!</h1>
      <p>Помощь онлайн и оффлайн для ваших нужд.</p>

      <div className="flex justify-center space-x-4">
        <Button href="/consultation">Записаться на консультацию</Button>
        <Button href="/urgent" variant="red">Срочная онлайн помощь</Button>
      </div>
      <Image
        src="/banner.jpeg"
        alt="Banner"
        width={1024}
        height={1024}
        className="mx-auto block"
      />
      
    </div>
  );
}
