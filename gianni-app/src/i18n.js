import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translations
import translationEN from './translations/en.json';
import translationDE from './translations/de.json';
import translationHU from './translations/hu.json';

i18n
  .use(initReactI18next)
  .init({
    debug: true, // This helps in development
    resources: {
      eng: translationEN,  // Note: changed 'en' to 'eng' to match your button types
      hu: translationHU,
      de: translationDE
    },
    lng: 'eng', // default language
    fallbackLng: 'eng',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;