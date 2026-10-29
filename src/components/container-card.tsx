import { Pressable, Text, View } from 'react-native';

import type { ContainerMetrics } from '../api/types';
import { formatBytes, formatPercent } from '../lib/format';
import { StatusBadge, toneFromStatus } from './ui';

interface ContainerCardProps {
  container: ContainerMetrics;
  selected?: boolean;
  onPress?: () => void;
}

export function ContainerCard({ container, selected, onPress }: ContainerCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border bg-card p-4 active:opacity-80 ${
        selected ? 'border-accent' : 'border-border'
      }`}
    >
      <View className="flex-row items-center justify-between gap-2">
        <Text numberOfLines={1} className="flex-1 text-sm font-semibold text-white">
          {container.displayName}
        </Text>
        <StatusBadge label={container.state} tone={toneFromStatus(container.state)} />
      </View>

      <Text numberOfLines={1} className="mt-0.5 text-[11px] text-muted">
        {container.image}
      </Text>

      <View className="mt-3 flex-row gap-6">
        <View>
          <Text className="text-[10px] uppercase tracking-wider text-muted">CPU</Text>
          <Text className="text-sm font-medium text-white">{formatPercent(container.cpuPct)}</Text>
        </View>
        <View>
          <Text className="text-[10px] uppercase tracking-wider text-muted">RAM</Text>
          <Text className="text-sm font-medium text-white">{formatBytes(container.memUsed)}</Text>
        </View>
        <View>
          <Text className="text-[10px] uppercase tracking-wider text-muted">RAM %</Text>
          <Text className="text-sm font-medium text-white">{formatPercent(container.memPct)}</Text>
        </View>
      </View>
    </Pressable>
  );
}
