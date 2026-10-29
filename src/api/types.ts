/**
 * Contrato da API (ver openapi.json no repo do backend).
 * Mantido à mão porque a API ainda não declara response DTOs no Swagger.
 */

export interface HostMetrics {
  available: boolean;
  cpuPct: number | null;
  cpuPerCore: number[] | null;
  memUsed: number | null;
  memTotal: number | null;
  memPct: number | null;
  swapUsed: number | null;
  load1: number | null;
  load5: number | null;
  load15: number | null;
  diskUsed: number | null;
  diskTotal: number | null;
  diskPct: number | null;
  netRxBps: number | null;
  netTxBps: number | null;
  uptimeSec: number | null;
  tempC: number | null;
}

export interface ContainerMetrics {
  id: string;
  name: string;
  displayName: string;
  image: string;
  state: string;
  status: string;
  health: string | null;
  coolifyUuid: string | null;
  cpuPct: number | null;
  memUsed: number | null;
  memLimit: number | null;
  memPct: number | null;
  netRx: number | null;
  netTx: number | null;
}

export interface CoolifyApplication {
  uuid: string;
  name: string;
  description: string | null;
  fqdn: string | null;
  status: string;
  buildPack: string | null;
  gitBranch: string | null;
}

export interface CoolifyDatabase {
  uuid: string;
  name: string;
  type: string;
  status: string;
  isPublic: boolean;
  image: string | null;
}

export interface CoolifyServiceItem {
  uuid: string;
  name: string;
  type: string;
  status: string;
}

export interface Overview {
  collectedAt: string;
  host: HostMetrics;
  containers: ContainerMetrics[];
  coolify: {
    configured: boolean;
    applications: CoolifyApplication[];
    databases: CoolifyDatabase[];
    servers: { uuid: string; name: string; isReachable: boolean; isUsable: boolean }[];
    services: CoolifyServiceItem[];
  };
}

export interface HistoryPoint {
  ts: string;
  value: number | null;
}

export interface HistoryResponse {
  metric: string;
  rangeSeconds: number;
  stepSeconds: number;
  points: HistoryPoint[];
}

export type HistoryMetric = 'cpu' | 'memory' | 'load' | 'net_rx' | 'net_tx' | 'disk';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface SignInResponse {
  token?: string;
  user?: SessionUser;
}

export interface MeResponse {
  user: SessionUser;
  expiresAt: string;
}

export interface ConversationSummary {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant' | string;
  content: string | null;
  createdAt: string;
}

export interface ContainerLogs {
  containerId: string;
  name: string;
  lines: number;
  available: boolean;
  logs: string;
}

export interface Diagnostics {
  host: { procPath: string; sysPath: string; rootPath: string; available: boolean };
  docker: { url: string; reachable: boolean; containers: number };
  coolify: { url: string | null; ok: boolean; status: number | null; error: string | null };
  llm: { provider: string; model: string; configured: boolean };
  metrics: { intervalMs: number; retentionDays: number };
}

/** Eventos do SSE de chat. */
export type ChatEvent =
  | { type: 'start'; conversationId: string }
  | { type: 'token'; text: string }
  | { type: 'tool_start'; name: string; input: unknown }
  | { type: 'tool_result'; name: string; output: string }
  | { type: 'done'; conversationId: string }
  | { type: 'error'; message: string };
