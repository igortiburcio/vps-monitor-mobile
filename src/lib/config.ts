/**
 * URL da API. Em dev, use o IP da máquina na rede local:
 *   EXPO_PUBLIC_API_URL=http://192.168.0.10:4100
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://monitor.duduisonfire.com';

/** Intervalo do SSE, alinhado com o backend (5s). */
export const LIVE_INTERVAL_MS = 5000;
