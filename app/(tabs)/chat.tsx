import { type ComponentRef, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getAuthToken } from '../../src/api/client';
import { streamSse } from '../../src/api/sse';
import { ChatBubble, ToolChip } from '../../src/components/chat-bubble';
import { EmptyState } from '../../src/components/ui';
import { useBreakpoint } from '../../src/hooks/use-breakpoint';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ToolRun {
  id: string;
  name: string;
  running: boolean;
}

const SUGGESTIONS = [
  'Como está a VPS agora?',
  'Qual container consome mais memória?',
  'Quais apps do Coolify estão saudáveis?',
  'Teve pico de CPU na última hora?',
];

export default function ChatScreen() {
  const { isTablet } = useBreakpoint();

  const [messages, setMessages] = useState<Message[]>([]);
  const [tools, setTools] = useState<ToolRun[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  /** buffer de tokens: evita re-parsear markdown a cada token */
  const pendingRef = useRef('');
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(timer);
  }, [messages, tools]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    };
  }, []);

  function appendToLastAssistant(text: string): void {
    setMessages((previous) => {
      const next = [...previous];
      const last = next[next.length - 1];
      if (!last || last.role !== 'assistant') return previous;

      next[next.length - 1] = { ...last, content: last.content + text };
      return next;
    });
  }

  /** Descarrega o buffer de tokens no estado. */
  function flushPending(): void {
    const chunk = pendingRef.current;
    if (!chunk) return;

    pendingRef.current = '';
    appendToLastAssistant(chunk);
  }

  async function send(question: string): Promise<void> {
    const text = question.trim();
    if (!text || streaming) return;

    const token = getAuthToken();
    if (!token) {
      setError('Sessão expirada. Entre novamente.');
      return;
    }

    setInput('');
    setError(null);
    setTools([]);
    setStreaming(true);
    pendingRef.current = '';
    setMessages((previous) => [
      ...previous,
      { id: `u-${Date.now()}`, role: 'user', content: text },
      { id: `a-${Date.now()}`, role: 'assistant', content: '' },
    ]);

    flushTimerRef.current = setInterval(flushPending, 120);

    try {
      for await (const message of streamSse('/api/v1/ai/chat', {
        method: 'POST',
        token,
        body: { message: text, conversationId: conversationId ?? undefined },
      })) {
        const payload = JSON.parse(message.data) as Record<string, unknown>;

        switch (message.event) {
          case 'start':
          case 'done':
            if (typeof payload.conversationId === 'string')
              setConversationId(payload.conversationId);
            break;

          case 'token':
            if (typeof payload.text === 'string') pendingRef.current += payload.text;
            break;

          case 'tool_start':
            setTools((previous) => [
              ...previous,
              {
                id: `${String(payload.name)}-${Date.now()}`,
                name: String(payload.name),
                running: true,
              },
            ]);
            break;

          case 'tool_result':
            setTools((previous) =>
              previous.map((tool) =>
                tool.name === payload.name ? { ...tool, running: false } : tool,
              ),
            );
            break;

          case 'error':
            setError(typeof payload.message === 'string' ? payload.message : 'Erro no chat');
            break;

          default:
            break;
        }
      }
    } catch (streamError) {
      setError(streamError instanceof Error ? streamError.message : 'Falha na conexão');
    } finally {
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }

      flushPending();
      setStreaming(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24,
          width: '100%',
          maxWidth: isTablet ? 900 : undefined,
          alignSelf: 'center',
        }}
      >
        {messages.length === 0 ? (
          <View className="gap-4">
            <EmptyState
              title="Pergunte sobre a sua VPS"
              description="O agente consulta métricas reais antes de responder — nada é inventado."
            />

            <View className="gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPress={() => void send(suggestion)}
                  className="rounded-xl border border-border bg-card px-4 py-3 active:opacity-70"
                >
                  <Text className="text-sm text-slate-200">{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              role={message.role}
              content={message.content}
              streaming={streaming && message.id === messages[messages.length - 1]?.id}
            />
          ))
        )}

        {tools.map((tool) => (
          <ToolChip key={tool.id} name={tool.name} running={tool.running} />
        ))}

        {error ? (
          <View className="mt-2 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Text className="text-xs text-danger">{error}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="border-t border-border bg-card px-4 py-3">
        <View className="flex-row items-end gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Pergunte algo sobre o servidor…"
            placeholderTextColor="#5b6b85"
            multiline
            className="max-h-28 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-white"
            onSubmitEditing={() => void send(input)}
          />
          <Pressable
            onPress={() => void send(input)}
            disabled={streaming || input.trim().length === 0}
            className={`h-11 w-11 items-center justify-center rounded-xl ${
              streaming || input.trim().length === 0
                ? 'bg-accent/40'
                : 'bg-accent active:opacity-80'
            }`}
          >
            <Text className="text-base font-bold text-[#04121f]">{streaming ? '…' : '↑'}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
