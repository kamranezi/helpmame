import Button from './components/Button';

export default function HomePage() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold">Добро пожаловать в HelpMame!</h1>
      <p>Помощь онлайн и оффлайн для ваших нужд.</p>

      <div className="flex justify-center space-x-4">
        <Button href="/consultation">Записаться на консультацию</Button>
        <Button href="/urgent" variant="red">Срочная онлайн помощь</Button>
      </div>
    </div>
  );
}
