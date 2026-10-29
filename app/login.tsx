import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../src/auth/auth-context';
import { Button } from '../src/components/ui';
import { useBreakpoint } from '../src/hooks/use-breakpoint';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { isTablet } = useBreakpoint();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(): Promise<void> {
    if (!email || !password) {
      setError('Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(email.trim(), password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Falha ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className={`w-full self-center px-6 ${isTablet ? 'max-w-md' : ''}`}>
            <View className="mb-8">
              <Text className="text-3xl font-bold text-white">VPS Monitor</Text>
              <Text className="mt-1 text-sm text-muted">Métricas do servidor e chat com IA</Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="mb-1.5 text-xs uppercase tracking-wider text-muted">E-mail</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="voce@exemplo.com"
                  placeholderTextColor="#5b6b85"
                  className="h-12 rounded-xl border border-border bg-card px-4 text-white"
                />
              </View>

              <View>
                <Text className="mb-1.5 text-xs uppercase tracking-wider text-muted">Senha</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholder="••••••••"
                  placeholderTextColor="#5b6b85"
                  onSubmitEditing={() => void handleSubmit()}
                  className="h-12 rounded-xl border border-border bg-card px-4 text-white"
                />
              </View>

              {error ? (
                <View className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{error}</Text>
                </View>
              ) : null}

              <View className="mt-2">
                {loading ? (
                  <View className="h-12 items-center justify-center rounded-xl bg-accent/60">
                    <ActivityIndicator color="#04121f" />
                  </View>
                ) : (
                  <Button label="Entrar" onPress={() => void handleSubmit()} />
                )}
              </View>
            </View>

            <Text className="mt-8 text-center text-[11px] text-muted">
              Sessão protegida com BetterAuth · token no SecureStore
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
