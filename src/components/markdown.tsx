import { memo } from 'react';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import {
  type MarkedStyles,
  Renderer,
  useMarkdown,
  type useMarkdownHookOptions,
} from 'react-native-marked';

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
};

/**
 * Tabela própria.
 *
 * O renderer padrão da lib usa largura fixa de 43% da JANELA por coluna
 * (3 colunas = 130% da tela) e embrulha tudo num ScrollView horizontal
 * dentro do nosso ScrollView vertical — combinação que quebra a medição
 * de altura e faz a bolha crescer sem limite.
 *
 * Aqui as colunas dividem a largura disponível (`flex: 1`) e o texto quebra.
 */
const tableStyles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#1e2d45',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerRow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#1e2d45',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});

class ChatRenderer extends Renderer {
  override table(
    header: React.ReactNode[][],
    rows: React.ReactNode[][][],
    tableStyle?: ViewStyle,
    rowStyle?: ViewStyle,
    cellStyle?: ViewStyle,
  ): React.ReactNode {
    const lastColumn = header.length - 1;

    return (
      <View key={this.getKey()} style={[tableStyles.table, tableStyle]}>
        <View style={[tableStyles.row, tableStyles.headerRow, rowStyle]}>
          {header.map((cell, index) => (
            <View
              key={`h-${index}`}
              style={[
                tableStyles.cell,
                index === lastColumn ? { borderRightWidth: 0 } : null,
                cellStyle,
              ]}
            >
              <Text style={tableStyles.headerText}>{cell}</Text>
            </View>
          ))}
        </View>

        {rows.map((row, rowIndex) => (
          <View
            key={`r-${rowIndex}`}
            style={[
              tableStyles.row,
              rowIndex < rows.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: '#1e2d45' }
                : null,
              rowStyle,
            ]}
          >
            {row.map((cell, cellIndex) => (
              <View
                key={`c-${cellIndex}`}
                style={[
                  tableStyles.cell,
                  cellIndex === lastColumn ? { borderRightWidth: 0 } : null,
                  cellStyle,
                ]}
              >
                {cell}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }
}

const renderer = new ChatRenderer({ selectable: false });

/**
 * Markdown do chat. Usa `useMarkdown` (e não o componente <Markdown>)
 * porque ele renderiza uma FlatList — aninhada na ScrollView do chat
 * isso quebraria o scroll.
 */
function MarkdownTextComponent({ value }: { value: string }) {
  const elements = useMarkdown(value, { theme, styles, renderer, colorScheme: 'dark' });

  return <View style={{ flexShrink: 1 }}>{elements}</View>;
}

export const MarkdownText = memo(MarkdownTextComponent);
