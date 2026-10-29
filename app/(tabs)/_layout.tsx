import { Tabs } from 'expo-router';
import { Box, LayoutDashboard, LogOut, MessageSquare } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useAuth } from '../../src/auth/auth-context';

const ACTIVE = '#38bdf8';
const INACTIVE = '#7c8aa5';

/**
 * A altura da tab bar NÃO é fixada aqui de propósito: o React Navigation
 * calcula `base + safeAreaInsets.bottom`. Fixar `height` ignora o inset do
 * iPhone (home indicator) e corta os rótulos.
 */
export default function TabsLayout() {
  const { signOut } = useAuth();

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
        },
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11 },
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
