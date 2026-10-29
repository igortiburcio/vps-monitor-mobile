import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-surface px-6">
      <Text className="text-lg font-semibold text-white">Tela não encontrada</Text>
      <Link href="/" className="mt-4 text-sm text-accent">
        Voltar para o dashboard
      </Link>
    </View>
  );
}
