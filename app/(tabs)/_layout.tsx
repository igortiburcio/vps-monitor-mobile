import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useAuth } from '../../src/auth/auth-context';

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.45 }}>{symbol}</Text>;
}

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
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#7c8aa5',
        tabBarLabelStyle: { fontSize: 11 },
        headerRight: () => (
          <Pressable onPress={() => void signOut()} className="mr-4 active:opacity-60">
            <Text className="text-xs text-muted">Sair</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon symbol="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="containers"
        options={{
          title: 'Containers',
          tabBarIcon: ({ focused }) => <TabIcon symbol="📦" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => <TabIcon symbol="💬" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
