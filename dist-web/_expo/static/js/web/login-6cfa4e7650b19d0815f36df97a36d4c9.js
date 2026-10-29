__d(
  function (g, r, i, a, m, _e, d) {
    'use strict';
    function e(e) {
      return e && e.__esModule ? e : { default: e };
    }
    (Object.defineProperty(_e, '__esModule', { value: !0 }),
      Object.defineProperty(_e, 'default', {
        enumerable: !0,
        get: function () {
          return p;
        },
      }));
    var t = r(d[0]),
      l = e(r(d[1])),
      s = e(r(d[2]));
    r(d[3]);
    var n = e(r(d[4])),
      c = e(r(d[5])),
      o = e(r(d[6])),
      u = e(r(d[7])),
      x = r(d[8]),
      f = r(d[9]),
      h = r(d[10]),
      b = r(d[11]),
      j = r(d[12]);
    function p() {
      const { signIn: e } = (0, f.useAuth)(),
        { isTablet: p } = (0, b.useBreakpoint)(),
        [N, y] = (0, t.useState)(''),
        [S, w] = (0, t.useState)(''),
        [v, C] = (0, t.useState)(!1),
        [T, k] = (0, t.useState)(null);
      async function P() {
        if (N && S) {
          (C(!0), k(null));
          try {
            await e(N.trim(), S);
          } catch (e) {
            k(e instanceof Error ? e.message : 'Falha ao entrar');
          } finally {
            C(!1);
          }
        } else k('Preencha e-mail e senha');
      }
      return (0, j.jsx)(x.SafeAreaView, {
        className: 'flex-1 bg-surface',
        children: (0, j.jsx)(s.default, {
          className: 'flex-1',
          behavior: void 0,
          children: (0, j.jsx)(n.default, {
            contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
            keyboardShouldPersistTaps: 'handled',
            children: (0, j.jsxs)(u.default, {
              className: 'w-full self-center px-6 ' + (p ? 'max-w-md' : ''),
              children: [
                (0, j.jsxs)(u.default, {
                  className: 'mb-8',
                  children: [
                    (0, j.jsx)(c.default, {
                      className: 'text-3xl font-bold text-white',
                      children: 'VPS Monitor',
                    }),
                    (0, j.jsx)(c.default, {
                      className: 'mt-1 text-sm text-muted',
                      children: 'M\xe9tricas do servidor e chat com IA',
                    }),
                  ],
                }),
                (0, j.jsxs)(u.default, {
                  className: 'gap-4',
                  children: [
                    (0, j.jsxs)(u.default, {
                      children: [
                        (0, j.jsx)(c.default, {
                          className: 'mb-1.5 text-xs uppercase tracking-wider text-muted',
                          children: 'E-mail',
                        }),
                        (0, j.jsx)(o.default, {
                          value: N,
                          onChangeText: y,
                          autoCapitalize: 'none',
                          autoComplete: 'email',
                          keyboardType: 'email-address',
                          placeholder: 'voce@exemplo.com',
                          placeholderTextColor: '#5b6b85',
                          className: 'h-12 rounded-xl border border-border bg-card px-4 text-white',
                        }),
                      ],
                    }),
                    (0, j.jsxs)(u.default, {
                      children: [
                        (0, j.jsx)(c.default, {
                          className: 'mb-1.5 text-xs uppercase tracking-wider text-muted',
                          children: 'Senha',
                        }),
                        (0, j.jsx)(o.default, {
                          value: S,
                          onChangeText: w,
                          secureTextEntry: !0,
                          autoCapitalize: 'none',
                          placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
                          placeholderTextColor: '#5b6b85',
                          onSubmitEditing: () => {
                            P();
                          },
                          className: 'h-12 rounded-xl border border-border bg-card px-4 text-white',
                        }),
                      ],
                    }),
                    T
                      ? (0, j.jsx)(u.default, {
                          className: 'rounded-xl border border-danger/40 bg-danger/10 px-4 py-3',
                          children: (0, j.jsx)(c.default, {
                            className: 'text-sm text-danger',
                            children: T,
                          }),
                        })
                      : null,
                    (0, j.jsx)(u.default, {
                      className: 'mt-2',
                      children: v
                        ? (0, j.jsx)(u.default, {
                            className: 'h-12 items-center justify-center rounded-xl bg-accent/60',
                            children: (0, j.jsx)(l.default, { color: '#04121f' }),
                          })
                        : (0, j.jsx)(h.Button, {
                            label: 'Entrar',
                            onPress: () => {
                              P();
                            },
                          }),
                    }),
                  ],
                }),
                (0, j.jsx)(c.default, {
                  className: 'mt-8 text-center text-[11px] text-muted',
                  children: 'Sess\xe3o protegida com BetterAuth \xb7 token no SecureStore',
                }),
              ],
            }),
          }),
        }),
      });
    }
  },
  781,
  [12, 228, 237, 104, 133, 188, 255, 109, 271, 783, 841, 842, 289],
);
