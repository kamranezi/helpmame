import React from 'react';

interface Post {
    id: number;
    author: string;
    title: string;
    replies: number;
    lastReply: string;
}

const ForumPage: React.FC = () => {
    // Dummy data for forum posts
    const posts: Post[] = [
        {
            id: 1,
            author: 'Алена',
            title: 'Как часто кормить новорожденного?',
            replies: 12,
            lastReply: 'Мария, 2 часа назад'
        },
        {
            id: 2,
            author: 'Ольга',
            title: 'Больно кормить, что делать?',
            replies: 5,
            lastReply: 'Екатерина, 5 часов назад'
        },
        {
            id: 3,
            author: 'Татьяна',
            title: 'Нужно ли сцеживаться после каждого кормления?',
            replies: 8,
            lastReply: 'Анна, вчера'
        }
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Форум</h1>
                <button className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Создать новую тему
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {posts.map(post => (
                        <li key={post.id} className="p-4 sm:p-6 hover:bg-gray-50">
                            <div className="flex flex-col sm:flex-row justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <a href="#" className="text-lg font-semibold text-blue-600 hover:underline">{post.title}</a>
                                    <p className="text-sm text-gray-600">Автор: {post.author}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-sm text-gray-800">Ответов: {post.replies}</p>
                                    <p className="text-xs text-gray-500">Последний ответ: {post.lastReply}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ForumPage;
