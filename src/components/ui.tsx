import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className}`}>{children}</View>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <Text className="text-[11px] uppercase tracking-wider text-muted">{children}</Text>;
}

export function Value({ children, size = 'lg' }: { children: ReactNode; size?: 'sm' | 'lg' }) {
  return (
    <Text
      className={
        size === 'lg' ? 'text-2xl font-semibold text-white' : 'text-base font-medium text-white'
      }
    >
      {children}
    </Text>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text className="mb-3 text-base font-semibold text-white">{children}</Text>;
}

const STATUS_STYLES = {
  ok: { box: 'bg-ok/10 border-ok/30', text: 'text-ok', dot: 'bg-ok' },
  warn: { box: 'bg-warn/10 border-warn/30', text: 'text-warn', dot: 'bg-warn' },
  danger: { box: 'bg-danger/10 border-danger/30', text: 'text-danger', dot: 'bg-danger' },
  neutral: { box: 'bg-white/5 border-border', text: 'text-muted', dot: 'bg-muted' },
} as const;

export type StatusTone = keyof typeof STATUS_STYLES;

function stylesFor(tone: StatusTone): (typeof STATUS_STYLES)[StatusTone] {
  switch (tone) {
    case 'ok':
      return STATUS_STYLES.ok;
    case 'warn':
      return STATUS_STYLES.warn;
    case 'danger':
      return STATUS_STYLES.danger;
    default:
      return STATUS_STYLES.neutral;
  }
}

export function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: StatusTone }) {
  const style = stylesFor(tone);

  return (
    <View className={`flex-row items-center gap-1.5 rounded-full border px-2 py-0.5 ${style.box}`}>
      <View className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <Text className={`text-[11px] font-medium ${style.text}`}>{label}</Text>
    </View>
  );
}

/** Deriva o tom a partir do status que a API devolve. */
export function toneFromStatus(status: string | null | undefined): StatusTone {
  if (!status) return 'neutral';

  const normalized = status.toLowerCase();
  if (normalized.includes('unhealthy') || normalized.includes('exited')) return 'danger';
  if (normalized.includes('starting') || normalized.includes('restarting')) return 'warn';
  if (normalized.includes('healthy') || normalized.includes('running')) return 'ok';

  return 'neutral';
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

export function Button({ label, onPress, loading, disabled, variant = 'primary' }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-xl px-5 ${
        variant === 'primary' ? 'bg-accent' : 'border border-border bg-transparent'
      } ${isDisabled ? 'opacity-50' : 'active:opacity-80'}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#04121f' : '#e2e8f0'} />
      ) : (
        <Text
          className={`text-base font-semibold ${
            variant === 'primary' ? 'text-[#04121f]' : 'text-white'
          }`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <View className="items-center justify-center rounded-2xl border border-dashed border-border p-8">
      <Text className="text-center text-sm font-medium text-white">{title}</Text>
      {description ? (
        <Text className="mt-1 text-center text-xs text-muted">{description}</Text>
      ) : null}
    </View>
  );
}
