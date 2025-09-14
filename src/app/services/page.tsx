
export default function ServicesPage() {
  const services = [
    {
      title: "Онлайн-консультация",
      description: "Видео-консультация с сертифицированным консультантом по ГВ. Разбор вашей ситуации, ответы на вопросы, составление предварительного плана.",
      price: "3000 руб. / час",
    },
    {
      title: "Вызов консультанта на дом",
      description: "Очная встреча со специалистом. Помощь в прикладывании, оценка уздечки, решение проблем с грудью. (Доступно в пределах города)",
      price: "5000 руб. / визит",
    },
    {
      title: "Срочная онлайн-помощь",
      description: "Приоритетная связь с консультантом в течение часа для решения острых проблем (лактостаз, отказ от груди).",
      price: "4000 руб.",
    },
    {
      title: "Сопровождение до результата",
      description: "Месячный пакет поддержки, включающий несколько онлайн-встреч и неограниченную связь в мессенджере.",
      price: "15 000 руб. / месяц",
    },
     {
      title: "Лекция для беременных",
      description: "Групповая или индивидуальная лекция о том, как подготовиться к грудному вскармливанию еще во время беременности.",
      price: "2500 руб.",
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Наши Услуги и Цены</h1>
        <p className="text-lg text-gray-600 mt-2">
          Профессиональная поддержка грудного вскармливания для мам и малышей.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-bold text-pink-600 mb-2">{service.title}</h2>
            <p className="text-gray-700 flex-grow">{service.description}</p>
            <div className="mt-4 text-right">
              <span className="text-xl font-semibold text-gray-800">{service.price}</span>
            </div>
          </div>
        ))}
      </div>
       <div className="text-center mt-12">
           <p className="text-md text-gray-500">
                Не нашли подходящую услугу? Свяжитесь с нами для индивидуального предложения.
           </p>
       </div>
    </div>
  );
}
