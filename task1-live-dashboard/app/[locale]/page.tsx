import { getTranslations, setRequestLocale } from 'next-intl/server';
import Dashboard from '../components/Dashboard';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher />
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{t('subtitle')}</p>
        </header>

        <Dashboard />
      </div>
    </div>
  );
}
