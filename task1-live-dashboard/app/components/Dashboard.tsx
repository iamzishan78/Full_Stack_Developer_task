'use client';

import { useState, useEffect } from 'react';
import CounterCard from './CounterCard';

interface Stats {
  requestsMade: number;
  tokensUsed: number;
  activeConnections: number;
  timestamp: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchStats, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error loading data</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CounterCard
          title="Requests Made"
          value={stats?.requestsMade ?? 0}
          icon="📊"
          color="blue"
        />
        <CounterCard
          title="Tokens Used"
          value={stats?.tokensUsed ?? 0}
          icon="🪙"
          color="green"
        />
        <CounterCard
          title="Active Connections"
          value={stats?.activeConnections ?? 0}
          icon="🔗"
          color="purple"
        />
      </div>

      {lastUpdated && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 10 seconds
        </div>
      )}
    </div>
  );
}
