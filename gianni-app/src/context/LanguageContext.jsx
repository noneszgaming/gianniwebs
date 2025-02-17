/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import i18n from 'i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const availableLanguages = ['eng', 'de', 'hu'];

    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && availableLanguages.includes(savedLanguage)) return savedLanguage;

        const browserLang = navigator.language.split('-')[0];
        const languageMap = {
            'en': 'eng',
            'de': 'de',
            'hu': 'hu'
        };

        const mappedLanguage = languageMap[browserLang];
        return availableLanguages.includes(mappedLanguage) ? mappedLanguage : 'eng';
    });

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem('preferredLanguage', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
