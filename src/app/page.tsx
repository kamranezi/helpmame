import Link from 'next/link';
import Button from './components/Button';

export default function HomePage() {
  return (
    <>
      {/* Секция с баннером */}
      <section 
        className="bg-cover bg-center h-[60vh] text-white flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="text-center bg-black bg-opacity-70 p-8 rounded-lg mx-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Спокойствие и уверенность для каждой мамы</h1>
          <p className="text-lg md:text-xl mb-6">Профессиональная поддержка по грудному вскармливанию и уходу за новорожденным</p>
          <Link href="/consultation">
            <div className="bg-pink-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 cursor-pointer inline-block">
              Получить консультацию
            </div>
          </Link>
        </div>
      </section>
      {/* Секция с тремя кнопками */}
      <section className="py-4">
          <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Наши основные услуги</h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
                <Button href="/consultation" variant="blue">Записаться на консультацию</Button>
                <Button href="/urgent" variant="red">Срочная онлайн помощь</Button>
                <Button href="/specialist-call" variant="teal">Вызов врача на дом</Button>
            </div>
          </div>
      </section>
      
      {/* Секция о нас */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Как мы можем помочь?</h2>
          <p className="max-w-3xl mx-auto text-gray-700 text-lg">
            Мы предлагаем индивидуальные консультации, срочную поддержку и выезды на дом, чтобы помочь вам наладить грудное вскармливание, справиться с трудностями и обрести уверенность в своих силах. Наша цель — сделать ваше материнство счастливым и комфортным.
          </p>
        </div>
      </section>
    </>
  );
}
