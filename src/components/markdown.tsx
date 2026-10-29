import { memo } from 'react';
import { Platform, View } from 'react-native';
import { type MarkedStyles, useMarkdown, type useMarkdownHookOptions } from 'react-native-marked';

const MONOSPACE = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

const theme: NonNullable<useMarkdownHookOptions['theme']> = {
  colors: {
    text: '#e2e8f0',
    link: '#38bdf8',
    code: '#7dd3fc',
    border: '#1e2d45',
  },
};

const styles: MarkedStyles = {
  text: { fontSize: 14, lineHeight: 20 },
  paragraph: { marginTop: 0, marginBottom: 6 },
  strong: { fontWeight: '700', color: '#ffffff' },
  em: { fontStyle: 'italic' },

  h1: { fontSize: 18, fontWeight: '700', marginTop: 6, marginBottom: 4, color: '#ffffff' },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 6, marginBottom: 4, color: '#ffffff' },
  h3: { fontSize: 15, fontWeight: '600', marginTop: 4, marginBottom: 3, color: '#ffffff' },

  link: { color: '#38bdf8', textDecorationLine: 'underline' },

  codespan: {
    fontFamily: MONOSPACE,
    fontSize: 12,
    color: '#7dd3fc',
    backgroundColor: '#0b1220',
  },
  code: {
    backgroundColor: '#0b1220',
    borderColor: '#1e2d45',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  codeText: { fontFamily: MONOSPACE, fontSize: 12, color: '#cbd5e1' },

  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#38bdf8',
    paddingLeft: 10,
    marginVertical: 6,
  },

  list: { marginVertical: 2 },
  li: { fontSize: 14, lineHeight: 20 },

  table: { borderWidth: 1, borderColor: '#1e2d45', borderRadius: 8, marginVertical: 8 },
  tableRow: { borderBottomWidth: 1, borderBottomColor: '#1e2d45' },
  tableCell: { paddingVertical: 6, paddingHorizontal: 10 },

  hr: { backgroundColor: '#1e2d45', height: 1, marginVertical: 10 },
};

/**
 * Markdown do chat. Usa `useMarkdown` (e não o componente <Markdown>)
 * porque ele renderiza uma FlatList — aninhada na ScrollView do chat
 * isso quebraria o scroll.
 */
function MarkdownTextComponent({ value }: { value: string }) {
  const elements = useMarkdown(value, { theme, styles, colorScheme: 'dark' });

  return <View>{elements}</View>;
}

export const MarkdownText = memo(MarkdownTextComponent);
