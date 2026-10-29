import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

interface MetricChartProps {
  values: (number | null)[];
  height?: number;
  color?: string;
  /** fixa o topo do eixo Y (ex.: 100 para percentuais) */
  max?: number;
}

/**
 * Sparkline em SVG puro: evita dependência de biblioteca de gráficos
 * e funciona igual em Android, iOS e tablet.
 */
export function MetricChart({ values, height = 88, color = '#38bdf8', max }: MetricChartProps) {
  const [width, setWidth] = useState(0);

  const data = values.filter((value): value is number => value !== null);
  const top = max ?? Math.max(...data, 1);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const buildPath = (): { line: string; area: string } => {
    if (data.length === 0 || width === 0) return { line: '', area: '' };

    const step = data.length > 1 ? width / (data.length - 1) : width;
    const points = data.map((value, index) => {
      const x = index * step;
      const y = height - Math.min(1, value / top) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const line = `M${points.join(' L')}`;
    const area = `${line} L${width.toFixed(1)},${height} L0,${height} Z`;

    return { line, area };
  };

  const { line, area } = buildPath();

  return (
    <View onLayout={onLayout} style={{ height }}>
      {line ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.35} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={area} fill="url(#fill)" />
          <Path d={line} stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
        </Svg>
      ) : null}
    </View>
  );
}
