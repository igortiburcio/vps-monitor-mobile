import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { apiFetch } from '../../src/api/client';
import type { ContainerLogs, ContainerMetrics } from '../../src/api/types';
import { ContainerCard } from '../../src/components/container-card';
import {
  Card,
  EmptyState,
  Label,
  StatusBadge,
  toneFromStatus,
  Value,
} from '../../src/components/ui';
import { useBreakpoint } from '../../src/hooks/use-breakpoint';
import { useLiveMetrics } from '../../src/hooks/use-live-metrics';
import { useOverview } from '../../src/hooks/use-overview';
import { formatBytes, formatPercent, formatRate } from '../../src/lib/format';

function ContainerDetail({ container }: { container: ContainerMetrics }) {
  const [showLogs, setShowLogs] = useState(false);

  const logs = useQuery({
    queryKey: ['logs', container.id],
    queryFn: () => apiFetch<ContainerLogs>(`/api/v1/containers/${container.id}/logs?lines=80`),
    enabled: showLogs,
    staleTime: 0,
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Card>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-white">{container.displayName}</Text>
            <Text className="mt-0.5 text-[11px] text-muted">{container.image}</Text>
          </View>
          <StatusBadge label={container.state} tone={toneFromStatus(container.state)} />
        </View>

        <View className="mt-4 flex-row flex-wrap gap-6">
          <View>
            <Label>CPU</Label>
            <Value size="sm">{formatPercent(container.cpuPct)}</Value>
          </View>
          <View>
            <Label>Memória</Label>
            <Value size="sm">{formatBytes(container.memUsed)}</Value>
          </View>
          <View>
            <Label>Limite</Label>
            <Value size="sm">{formatBytes(container.memLimit)}</Value>
          </View>
          <View>
            <Label>RX</Label>
            <Value size="sm">{formatRate(container.netRx)}</Value>
          </View>
          <View>
            <Label>TX</Label>
            <Value size="sm">{formatRate(container.netTx)}</Value>
          </View>
        </View>

        <Text className="mt-3 text-[11px] text-muted">{container.status}</Text>
      </Card>

      <Card>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-white">Logs</Text>
          <Pressable
            onPress={() => setShowLogs((current) => !current)}
            className="rounded-lg border border-border px-3 py-1.5 active:opacity-70"
          >
            <Text className="text-xs text-accent">{showLogs ? 'Ocultar' : 'Carregar'}</Text>
          </Pressable>
        </View>

        {showLogs ? (
          <View className="mt-3">
            {logs.isLoading ? (
              <ActivityIndicator color="#38bdf8" />
            ) : logs.data && logs.data.available ? (
              <ScrollView horizontal>
                <Text className="font-mono text-[11px] leading-4 text-slate-300">
                  {logs.data.logs || '(vazio)'}
                </Text>
              </ScrollView>
            ) : (
              <Text className="text-xs text-muted">Logs indisponíveis para este container.</Text>
            )}
          </View>
        ) : null}
      </Card>
    </ScrollView>
  );
}

export default function ContainersScreen() {
  const { isTablet } = useBreakpoint();
  const overview = useOverview();
  const { snapshot } = useLiveMetrics(true);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const containers = useMemo(
    () => snapshot?.containers ?? overview.data?.containers ?? [],
    [snapshot, overview.data],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = term
      ? containers.filter(
          (container) =>
            container.displayName.toLowerCase().includes(term) ||
            container.image.toLowerCase().includes(term),
        )
      : containers;

    return [...list].sort((a, b) => (b.memUsed ?? 0) - (a.memUsed ?? 0));
  }, [containers, query]);

  const selected =
    containers.find((container) => container.id === selectedId) ??
    (isTablet ? filtered[0] : undefined);

  if (overview.isLoading && containers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#38bdf8" />
      </View>
    );
  }

  const list = (
    <View className="flex-1">
      <View className="px-4 pb-3 pt-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar container ou imagem"
          placeholderTextColor="#5b6b85"
          className="h-10 rounded-xl border border-border bg-card px-4 text-sm text-white"
        />
        <Text className="mt-2 text-[11px] text-muted">
          {filtered.length} containers · ordenados por memória
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}>
        {filtered.map((container) => (
          <ContainerCard
            key={container.id}
            container={container}
            selected={selected?.id === container.id}
            onPress={() => setSelectedId(container.id)}
          />
        ))}

        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum container encontrado"
            description="Verifique o socket do Docker na API."
          />
        ) : null}
      </ScrollView>
    </View>
  );

  // Tablet: lista + detalhe lado a lado
  if (isTablet) {
    return (
      <View className="flex-1 flex-row bg-surface">
        <View className="w-[42%] border-r border-border">{list}</View>
        <View className="flex-1">
          {selected ? (
            <ContainerDetail container={selected} />
          ) : (
            <View className="flex-1 items-center justify-center px-8">
              <EmptyState title="Selecione um container" />
            </View>
          )}
        </View>
      </View>
    );
  }

  // Celular: lista; detalhe abre como tela cheia abaixo
  return (
    <View className="flex-1 bg-surface">
      {selectedId && selected ? (
        <View className="flex-1">
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable onPress={() => setSelectedId(null)} className="active:opacity-60">
              <Text className="text-sm text-accent">← Voltar</Text>
            </Pressable>
          </View>
          <ContainerDetail container={selected} />
        </View>
      ) : (
        list
      )}
    </View>
  );
}
