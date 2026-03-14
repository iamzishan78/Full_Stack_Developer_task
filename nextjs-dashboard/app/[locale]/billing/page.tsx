import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import BillingSession from '../../components/BillingSession';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default async function BillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('billing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            {t('backToDashboard')}
          </Link>
          <LanguageSwitcher />
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {t('pageTitle')}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{t('pageSubtitle')}</p>
        </header>

        <BillingSession />
      </div>
    </div>
  );
}
