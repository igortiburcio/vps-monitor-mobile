import { Text, View } from 'react-native';

import { MarkdownText } from './markdown';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  /** indica que a resposta ainda está chegando */
  streaming?: boolean;
}

export function ChatBubble({ role, content, streaming }: ChatBubbleProps) {
  const isUser = role === 'user';

  /**
   * Durante o stream o texto está incompleto: parsear markdown a cada
   * atualização gera estruturas inválidas (tabela sem linhas, lista aberta)
   * e faz o layout oscilar. Renderizamos texto puro e só trocamos para
   * markdown quando a resposta termina.
   */
  const renderAsMarkdown = !isUser && !streaming && content.length > 0;

  return (
    <View className={`mb-3 max-w-[92%] shrink ${isUser ? 'self-end' : 'self-start'}`}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser ? 'rounded-br-sm bg-accent' : 'rounded-bl-sm border border-border bg-card'
        }`}
      >
        {isUser ? (
          <Text className="text-sm leading-5 text-[#04121f]">{content}</Text>
        ) : renderAsMarkdown ? (
          <MarkdownText value={content} />
        ) : content ? (
          <Text className="text-sm leading-5 text-slate-100">{content}</Text>
        ) : (
          <Text className="text-sm text-muted">pensando…</Text>
        )}

        {streaming && content ? <Text className="mt-0.5 text-sm text-accent">▋</Text> : null}
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
