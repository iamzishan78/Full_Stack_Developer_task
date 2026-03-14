import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
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
  const tNav = await getTranslations('navigation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/billing"
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-md"
          >
            {tNav('billing')}
          </Link>
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
