import { RefreshControl, ScrollView, Text, View } from 'react-native';

import type { HostMetrics } from '../../src/api/types';
import { MetricChart } from '../../src/components/metric-chart';
import {
  Card,
  EmptyState,
  Label,
  SectionTitle,
  StatusBadge,
  toneFromStatus,
  Value,
} from '../../src/components/ui';
import { useBreakpoint } from '../../src/hooks/use-breakpoint';
import { useLiveMetrics } from '../../src/hooks/use-live-metrics';
import { useHistory, useOverview } from '../../src/hooks/use-overview';
import { formatBytes, formatPercent, formatRate, formatUptime } from '../../src/lib/format';

function StatCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'warn' | 'danger';
}) {
  const valueColor =
    tone === 'danger' ? 'text-danger' : tone === 'warn' ? 'text-warn' : 'text-white';

  return (
    <Card className="flex-1 min-w-[150px]">
      <Label>{label}</Label>
      <Text className={`mt-1 text-2xl font-semibold ${valueColor}`}>{value}</Text>
      {hint ? <Text className="mt-0.5 text-[11px] text-muted">{hint}</Text> : null}
    </Card>
  );
}

function toneForUsage(percent: number | null): 'default' | 'warn' | 'danger' {
  if (percent === null) return 'default';
  if (percent >= 90) return 'danger';
  if (percent >= 75) return 'warn';
  return 'default';
}

function HostSection({ host }: { host: HostMetrics }) {
  if (!host.available) {
    return (
      <EmptyState
        title="Métricas do host indisponíveis"
        description="O container da API não tem /proc do host montado."
      />
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3">
      <StatCard
        label="CPU"
        value={formatPercent(host.cpuPct)}
        hint={host.cpuPerCore ? `${host.cpuPerCore.length} cores` : undefined}
        tone={toneForUsage(host.cpuPct)}
      />
      <StatCard
        label="Memória"
        value={formatPercent(host.memPct)}
        hint={`${formatBytes(host.memUsed)} de ${formatBytes(host.memTotal)}`}
        tone={toneForUsage(host.memPct)}
      />
      <StatCard
        label="Disco"
        value={formatPercent(host.diskPct)}
        hint={`${formatBytes(host.diskUsed)} de ${formatBytes(host.diskTotal)}`}
        tone={toneForUsage(host.diskPct)}
      />
      <StatCard
        label="Load"
        value={host.load1?.toFixed(2) ?? '—'}
        hint={`5m ${host.load5?.toFixed(2) ?? '—'} · 15m ${host.load15?.toFixed(2) ?? '—'}`}
      />
      <StatCard
        label="Rede"
        value={formatRate(host.netRxBps)}
        hint={`↑ ${formatRate(host.netTxBps)}`}
      />
      <StatCard label="Uptime" value={formatUptime(host.uptimeSec)} />
    </View>
  );
}

export default function DashboardScreen() {
  const { isWide } = useBreakpoint();
  const overview = useOverview();
  const { snapshot, connected } = useLiveMetrics(true);
  const history = useHistory('cpu', 1800, 60);

  const data = snapshot ?? overview.data;
  const values = (history.data?.points ?? []).map((point) => point.value);

  if (!data && overview.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <Text className="text-sm text-muted">Carregando métricas…</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-6">
        <EmptyState
          title="Não foi possível carregar"
          description={overview.error instanceof Error ? overview.error.message : 'Tente novamente'}
        />
      </View>
    );
  }

  const healthyApps = data.coolify.applications.filter((app) =>
    app.status.toLowerCase().includes('healthy'),
  ).length;

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={overview.isRefetching}
          onRefresh={() => void overview.refetch()}
          tintColor="#38bdf8"
        />
      }
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-semibold text-white">Servidor</Text>
          <Text className="text-[11px] text-muted">
            atualizado{' '}
            {data.collectedAt ? new Date(data.collectedAt).toLocaleTimeString('pt-BR') : '—'}
          </Text>
        </View>
        <StatusBadge
          label={connected ? 'ao vivo' : 'reconectando'}
          tone={connected ? 'ok' : 'warn'}
        />
      </View>

      <HostSection host={data.host} />

      <Card>
        <View className="mb-2 flex-row items-center justify-between">
          <SectionTitle>CPU · última hora</SectionTitle>
          <Text className="text-[11px] text-muted">
            {history.data?.points.length ?? 0} amostras
          </Text>
        </View>
        <MetricChart values={values} max={100} height={90} />
      </Card>

      <View className={isWide ? 'flex-row gap-4' : 'gap-4'}>
        <Card className="flex-1">
          <SectionTitle>Containers</SectionTitle>
          <View className="flex-row items-end justify-between">
            <Value>{String(data.containers.length)}</Value>
            <Text className="text-[11px] text-muted">
              {data.containers.filter((container) => container.state === 'running').length} rodando
            </Text>
          </View>
        </Card>

        <Card className="flex-1">
          <SectionTitle>Coolify</SectionTitle>
          <View className="flex-row items-end justify-between">
            <Value>
              {healthyApps}/{data.coolify.applications.length}
            </Value>
            <Text className="text-[11px] text-muted">apps saudáveis</Text>
          </View>
        </Card>
      </View>

      <Card>
        <SectionTitle>Aplicações</SectionTitle>
        {data.coolify.applications.length === 0 ? (
          <Text className="text-xs text-muted">Nenhuma aplicação retornada pelo Coolify.</Text>
        ) : (
          <View className="gap-3">
            {data.coolify.applications.map((app) => (
              <View key={app.uuid} className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-white">{app.name}</Text>
                  <Text numberOfLines={1} className="text-[11px] text-muted">
                    {app.fqdn ?? 'sem domínio'}
                  </Text>
                </View>
                <StatusBadge label={app.status} tone={toneFromStatus(app.status)} />
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <SectionTitle>Bancos</SectionTitle>
        {data.coolify.databases.length === 0 ? (
          <Text className="text-xs text-muted">Nenhum banco retornado.</Text>
        ) : (
          <View className="gap-2">
            {data.coolify.databases.map((database) => (
              <View key={database.uuid} className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 text-sm text-white">{database.name}</Text>
                <Text className="text-[11px] text-muted">
                  {database.type.replace('standalone-', '')}
                </Text>
                {database.isPublic ? <StatusBadge label="público" tone="warn" /> : null}
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}
