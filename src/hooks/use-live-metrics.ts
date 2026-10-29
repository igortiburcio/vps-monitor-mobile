import { useEffect, useRef, useState } from 'react';

import { getAuthToken } from '../api/client';
import { streamSse } from '../api/sse';
import type { Overview } from '../api/types';

const RECONNECT_DELAY_MS = 4000;

/**
 * Assina o SSE de métricas e mantém o último snapshot.
 * Reconecta sozinho se a conexão cair (comum em redes móveis).
 */
export function useLiveMetrics(enabled: boolean) {
  const [snapshot, setSnapshot] = useState<Overview | null>(null);
  const [connected, setConnected] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!enabled) return;

    const controller = new AbortController();
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    async function connect(): Promise<void> {
      const token = getAuthToken();
      if (!token) return;

      try {
        for await (const message of streamSse('/api/v1/events/stream', {
          token,
          signal: controller.signal,
        })) {
          if (!mounted.current) return;
          if (message.event !== 'metrics') continue;

          setSnapshot(JSON.parse(message.data) as Overview);
          setConnected(true);
        }
      } catch {
        if (!mounted.current || controller.signal.aborted) return;
        setConnected(false);
      }

      if (!mounted.current || controller.signal.aborted) return;
      reconnectTimer = setTimeout(() => void connect(), RECONNECT_DELAY_MS);
    }

    void connect();

    return () => {
      mounted.current = false;
      controller.abort();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      setConnected(false);
    };
  }, [enabled]);

  return { snapshot, connected };
}
