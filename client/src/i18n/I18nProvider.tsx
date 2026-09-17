import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS, ptBR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/pt-br';
import { DEFAULT_LANGUAGE, HTML_LANG, Language, TranslationKey, isLanguage, translations } from './translations';

const STORAGE_KEY = 'travel-countdown.language';

export type Translate = (key: TranslationKey, values?: Record<string, string>) => string;

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translate;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

const DATE_LOCALES: Record<Language, { adapterLocale: string; text: typeof ptBR }> = {
  pt: { adapterLocale: 'pt-br', text: ptBR },
  en: { adapterLocale: 'en', text: enUS },
};

interface I18nProviderProps {
  children: ReactNode;
}

function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language];
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A blocked storage should not stop the language from changing.
    }
  }, []);

  const t = useCallback<Translate>(
    (key, values) => {
      const text = translations[language][key];
      if (!values) {
        return text;
      }
      return text.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match);
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  const dateLocale = DATE_LOCALES[language];

  return (
    <I18nContext.Provider value={value}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={dateLocale.adapterLocale}
        localeText={dateLocale.text.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        {children}
      </LocalizationProvider>
    </I18nContext.Provider>
  );
}

export function useTranslation(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used inside I18nProvider');
  }
  return context;
}

export default I18nProvider;
