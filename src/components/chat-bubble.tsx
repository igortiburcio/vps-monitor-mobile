import { Text, View } from 'react-native';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  /** indica que a resposta ainda está chegando */
  streaming?: boolean;
}

export function ChatBubble({ role, content, streaming }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <View className={`mb-3 max-w-[92%] ${isUser ? 'self-end' : 'self-start'}`}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser ? 'rounded-br-sm bg-accent' : 'rounded-bl-sm border border-border bg-card'
        }`}
      >
        <Text className={`text-sm leading-5 ${isUser ? 'text-[#04121f]' : 'text-slate-100'}`}>
          {content}
          {streaming ? <Text className="text-accent">▋</Text> : null}
        </Text>
      </View>
    </View>
  );
}

export function ToolChip({ name, running }: { name: string; running: boolean }) {
  return (
    <View className="mb-2 self-start rounded-full border border-border bg-white/5 px-3 py-1">
      <Text className="text-[11px] text-muted">
        {running ? '🔍 consultando' : '✓ consultou'} <Text className="text-accent">{name}</Text>
      </Text>
    </View>
  );
}
