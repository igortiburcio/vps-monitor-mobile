# VPS Monitor — App mobile

App React Native (Expo) para acompanhar a VPS e conversar com o agente de IA.

- **Expo SDK 58** + expo-router (file-based routing)
- **NativeWind 4** (Tailwind) para estilos
- **TanStack Query** para dados e cache
- **SSE** via `expo/fetch` para métricas ao vivo e streaming do chat
- Token de sessão no **expo-secure-store**

## Requisitos

- Bun
- App Expo Go no celular, ou emulador Android/iOS

## Rodando

```bash
bun install
cp .env.example .env     # ajuste a URL da API se for dev local
bun run start
```

Por padrão o app aponta para `https://monitor.duduisonfire.com`.

Para desenvolver contra a API local, suba o backend na sua máquina e use o IP da rede
(no celular, `localhost` aponta para o próprio aparelho):

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:4100 bun run start
```

## Scripts

| Script                    | O que faz                                        |
| ------------------------- | ------------------------------------------------ |
| `bun run start`           | Expo dev server                                  |
| `bun run android` / `ios` | abre no emulador                                 |
| `bun run lint`            | ESLint (`eslint-config-expo`)                    |
| `bun run format`          | Prettier                                         |
| `bun run typecheck`       | `tsc --noEmit`                                   |
| `bun run bundle:android`  | gera o bundle de produção (valida imports/Metro) |

## Estrutura

```
app/
├── _layout.tsx          providers + guarda de rota
├── login.tsx
└── (tabs)/
    ├── _layout.tsx      abas
    ├── index.tsx        dashboard (host + Coolify)
    ├── containers.tsx   lista/detalhe + logs
    └── chat.tsx         chat com streaming
src/
├── api/                 client, SSE, tipos do contrato
├── auth/                AuthProvider (SecureStore)
├── components/          UI, gráfico SVG, cards
├── hooks/               overview, histórico, SSE, breakpoint
└── lib/                 config e formatação
```

## Celular e tablet

O layout responde por largura (`useBreakpoint`, breakpoint 768dp):

|            | Celular                       | Tablet                              |
| ---------- | ----------------------------- | ----------------------------------- |
| Containers | lista → detalhe em tela cheia | **dois painéis** (lista + detalhe)  |
| Dashboard  | coluna única                  | cards em linha e seções lado a lado |
| Chat       | largura total                 | coluna central de até 900dp         |

Configuração de plataforma: `ios.supportsTablet: true`, `android.resizeableActivity: true`
e `orientation: "default"` (permite paisagem no tablet).

## Autenticação

Login por e-mail/senha contra `/api/auth/sign-in/email`. O token (plugin `bearer` do
BetterAuth) vai para o `SecureStore` e é enviado como `Authorization: Bearer` em todas
as requisições. No boot o app valida o token em `/api/v1/me`.

## Notas técnicas

- O `fetch` padrão do React Native **não** faz streaming; por isso o SSE usa `expo/fetch`.
- O SSE reconecta sozinho após 4s quando a conexão cai (comum em rede móvel).
- O gráfico é SVG puro (`react-native-svg`), sem biblioteca de charts — funciona igual
  em Android, iOS e tablet.
