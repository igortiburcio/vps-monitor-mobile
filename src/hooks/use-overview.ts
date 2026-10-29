import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '../api/client';
import type { HistoryMetric, HistoryResponse, Overview } from '../api/types';

export function useOverview() {
  return useQuery({
    queryKey: ['overview'],
    queryFn: () => apiFetch<Overview>('/api/v1/overview'),
    refetchInterval: 15_000,
  });
}

export function useHistory(metric: HistoryMetric, rangeSeconds = 3600, stepSeconds = 60) {
  return useQuery({
    queryKey: ['history', metric, rangeSeconds, stepSeconds],
    queryFn: () =>
      apiFetch<HistoryResponse>(
        `/api/v1/host/history?metric=${metric}&range=${rangeSeconds}&step=${stepSeconds}`,
      ),
    refetchInterval: 60_000,
  });
}
