import React from 'react';

interface Article {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
}

const ArticlesPage: React.FC = () => {
    // Dummy data for articles
    const articles: Article[] = [
        {
            id: 1,
            title: 'Первые дни ГВ: что нужно знать',
            excerpt: 'О том, как наладить грудное вскармливание в роддоме и в первые дни после выписки.',
            author: 'Мария Иванова',
            date: '15 мая 2024'
        },
        {
            id: 2,
            title: '5 мифов о грудном вскармливании',
            excerpt: 'Разбираем самые популярные заблуждения, которые мешают мамам кормить грудью.',
            author: 'Анна Петрова',
            date: '10 мая 2024'
        },
        {
            id: 3,
            title: 'Лактостаз: как себе помочь?',
            excerpt: 'Пошаговая инструкция для мам, столкнувшихся с застоем молока. Что делать и чего нельзя.',
            author: 'Екатерина Сидорова',
            date: '5 мая 2024'
        }
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Статьи о грудном вскармливании</h1>
                <p className="text-base sm:text-lg text-gray-600 mt-2">Полезная информация и советы от наших экспертов.</p>
            </div>

            <div className="space-y-8">
                {articles.map(article => (
                    <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                            <a href="#" className="hover:text-blue-600">{article.title}</a>
                        </h2>
                        <p className="text-gray-700 mb-4">{article.excerpt}</p>
                        <div className="text-sm text-gray-500">
                            <span>Автор: {article.author}</span>
                            <span className="mx-2">|</span>
                            <span>{article.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArticlesPage;
