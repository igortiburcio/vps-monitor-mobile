import { useWindowDimensions } from 'react-native';

/** Breakpoint de tablet (dp). Alinhado com o Material Design. */
export const TABLET_MIN_WIDTH = 768;

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isTablet: width >= TABLET_MIN_WIDTH,
    /** duas colunas em telas largas de tablet */
    isWide: width >= 1024,
  };
}
