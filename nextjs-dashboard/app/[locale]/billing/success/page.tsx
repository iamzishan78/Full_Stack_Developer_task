import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('billing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-end">
          <LanguageSwitcher />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-10 w-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {t('paymentSuccess')}
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            {t('thankYou')}
          </p>

          {session_id && (
            <div className="mb-8 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Session ID</p>
              <code className="text-sm text-gray-700 break-all">
                {session_id}
              </code>
            </div>
          )}

          <Link
            href={`/${locale}`}
            className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
          >
            {t('returnToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
}
