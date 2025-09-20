
import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/cart/', '/login/', '/register/'],
    },
    sitemap: 'https://www.helpmame.ru/sitemap.xml',
  };
}
