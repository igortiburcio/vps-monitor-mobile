import { Tabs } from 'expo-router';
import { Box, LayoutDashboard, LogOut, MessageSquare } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../src/auth/auth-context';

const ACTIVE = '#38bdf8';
const INACTIVE = '#7c8aa5';

/**
 * Medido no DOM (393x852):
 *   barra 68 - 1 (borda) - 12 (padding) = 55 no tablist
 *   o <a> de cada aba tem padding 5+5 -> 45 internos
 *   ícone 28 + rótulo 13 = 41, com folga
 * Somamos o safe area (home indicator do iPhone) por fora.
 */
const BAR_HEIGHT = 68;
const BAR_PADDING = 6;

export default function TabsLayout() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0b1220' },
        headerShadowVisible: false,
        headerTintColor: '#e2e8f0',
        headerTitleStyle: { fontSize: 16, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#111c2e',
          borderTopColor: '#1e2d45',
          height: BAR_HEIGHT + insets.bottom,
          paddingTop: BAR_PADDING,
          paddingBottom: insets.bottom > 0 ? insets.bottom : BAR_PADDING,
        },
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11, lineHeight: 13 },
        tabBarIconStyle: { marginBottom: 0 },
        headerRight: () => (
          <Pressable
            onPress={() => void signOut()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Sair"
            className="mr-4 active:opacity-60"
          >
            <LogOut size={20} color={INACTIVE} strokeWidth={1.75} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="containers"
        options={{
          title: 'Containers',
          tabBarIcon: ({ color }) => <Box size={22} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MessageSquare size={22} color={color} strokeWidth={1.75} />,
        }}
      />
    </Tabs>
  );
}
