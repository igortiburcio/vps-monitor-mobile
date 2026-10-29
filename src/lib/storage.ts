import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * `expo-secure-store` não tem implementação no web
 * (o shim exporta um objeto vazio), então usamos localStorage lá.
 * Isso é só para desenvolvimento/demo: no app nativo o token fica no Keychain/Keystore.
 */
const isWeb = Platform.OS === 'web';

function webStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export const storage = {
  async get(key: string): Promise<string | null> {
    if (isWeb) return webStorage()?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (isWeb) {
      webStorage()?.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    if (isWeb) {
      webStorage()?.removeItem(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};
