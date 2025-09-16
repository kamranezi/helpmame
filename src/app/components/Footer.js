
      import React from 'react';
      import { FaPhone, FaTelegram, FaWhatsapp } from 'react-icons/fa';
      
      const Footer = () => {
        return (
          <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center items-center space-x-6">
                <a href="tel:+79891563549" className="text-white hover:text-pink-500">
                  <FaPhone size={30} />
                </a>
                <a href="https://t.me/kamriq" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                  <FaTelegram size={30} />
                </a>
                <a href="https://wa.me/79891563549" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500">
                  <FaWhatsapp size={30} />
                </a>
              </div>
              <p className="mt-4 text-gray-400">&copy; 2025 HelpMame. Все права защищены.</p>
            </div>
          </footer>
        );
      };
      
      export default Footer;