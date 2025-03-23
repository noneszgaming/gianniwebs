/* eslint-disable no-unused-vars */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer 
      className="w-full bg-slate-600 text-light py-6 mt-auto"
      style={{zIndex : 1000}}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">{t('footer.companyName', 'Gianni\'s Food')}</h3>
            <p className="text-sm">{t('footer.copyright', 'All rights reserved')} © {new Date().getFullYear()}</p>
            <img 
              src="/brown_mini_logo.png" 
              alt="Logo" 
              className="w-24 mt-4 opacity-70"
            />
          </div>
         
          <div>
            <h4 className="text-lg font-semibold mb-2">{t('footer.navigation', 'Navigation')}</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-accent transition-colors">{t('footer.home', 'Home')}</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors">{t('footer.cart', 'Cart')}</Link></li>
            </ul>
          </div>
         
          <div>
            <h4 className="text-lg font-semibold mb-2">{t('footer.contact', 'Contact Us')}</h4>
            <address className="not-italic">
              <p className="text-sm mb-1">{t('footer.address', 'Address')}: 1234 Budapest, Example Street 42.</p>
              <p className="text-sm mb-1">{t('footer.email', 'Email')}: contact@giannisfood.com</p>
              <p className="text-sm mb-3">{t('footer.phone', 'Phone')}: +36 1 234 5678</p>
            </address>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;