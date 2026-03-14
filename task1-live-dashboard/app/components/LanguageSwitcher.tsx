'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useEffect } from 'react';
import { routing, type Locale } from '@/i18n/routing';

const LOCALE_STORAGE_KEY = 'preferred-locale';

const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  ar: '🇸🇦',
  es: '🇪🇸',
};

export default function LanguageSwitcher() {
  const t = useTranslations('languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Check localStorage on mount and redirect if needed
  useEffect(() => {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (
      storedLocale &&
      storedLocale !== locale &&
      routing.locales.includes(storedLocale as Locale)
    ) {
      // Redirect to stored locale
      const newPath = getLocalizedPath(pathname, storedLocale);
      router.replace(newPath);
    }
  }, [locale, pathname, router]);

  const getLocalizedPath = (currentPath: string, newLocale: string) => {
    // Remove current locale prefix if present
    const pathWithoutLocale = routing.locales.reduce((path, loc) => {
      if (path.startsWith(`/${loc}/`)) {
        return path.replace(`/${loc}`, '');
      }
      if (path === `/${loc}`) {
        return '/';
      }
      return path;
    }, currentPath);

    // For default locale (en), don't add prefix (as-needed strategy)
    if (newLocale === routing.defaultLocale) {
      return pathWithoutLocale || '/';
    }

    return `/${newLocale}${pathWithoutLocale}`;
  };

  const handleLocaleChange = (newLocale: string) => {
    // Save to localStorage
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);

    // Navigate to new locale
    startTransition(() => {
      const newPath = getLocalizedPath(pathname, newLocale);
      router.replace(newPath);
    });
  };

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">
        {t('label')}
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        disabled={isPending}
        className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pe-10 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeFlags[loc]} {t(loc)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        ) : (
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
