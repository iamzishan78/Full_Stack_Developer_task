import Dashboard from './components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Live Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Real-time metrics with auto-refresh
          </p>
        </header>

        <Dashboard />
      </div>
    </div>
  );
}
