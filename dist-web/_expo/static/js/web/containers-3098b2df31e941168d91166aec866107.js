__d(
  function (g, r, i, _a, m, _e, d) {
    'use strict';
    function e(e) {
      return e && e.__esModule ? e : { default: e };
    }
    (Object.defineProperty(_e, '__esModule', { value: !0 }),
      Object.defineProperty(_e, 'default', {
        enumerable: !0,
        get: function () {
          return L;
        },
      }));
    var t = r(d[0]),
      s = r(d[1]),
      a = e(r(d[2])),
      l = e(r(d[3])),
      n = e(r(d[4])),
      c = e(r(d[5])),
      o = e(r(d[6])),
      x = e(r(d[7])),
      u = r(d[8]),
      f = r(d[9]),
      j = r(d[10]),
      h = r(d[11]),
      p = r(d[12]),
      b = r(d[13]),
      N = r(d[14]),
      y = r(d[15]);
    function w({ container: e }) {
      const [o, f] = (0, s.useState)(!1),
        h = (0, t.useQuery)({
          queryKey: ['logs', e.id],
          queryFn: () => (0, u.apiFetch)(`/api/v1/containers/${e.id}/logs?lines=80`),
          enabled: o,
          staleTime: 0,
        });
      return (0, y.jsxs)(n.default, {
        contentContainerStyle: { padding: 16, gap: 16 },
        children: [
          (0, y.jsxs)(j.Card, {
            children: [
              (0, y.jsxs)(x.default, {
                className: 'flex-row items-start justify-between gap-3',
                children: [
                  (0, y.jsxs)(x.default, {
                    className: 'flex-1',
                    children: [
                      (0, y.jsx)(c.default, {
                        className: 'text-base font-semibold text-white',
                        children: e.displayName,
                      }),
                      (0, y.jsx)(c.default, {
                        className: 'mt-0.5 text-[11px] text-muted',
                        children: e.image,
                      }),
                    ],
                  }),
                  (0, y.jsx)(j.StatusBadge, {
                    label: e.state,
                    tone: (0, j.toneFromStatus)(e.state),
                  }),
                ],
              }),
              (0, y.jsxs)(x.default, {
                className: 'mt-4 flex-row flex-wrap gap-6',
                children: [
                  (0, y.jsxs)(x.default, {
                    children: [
                      (0, y.jsx)(j.Label, { children: 'CPU' }),
                      (0, y.jsx)(j.Value, { size: 'sm', children: (0, N.formatPercent)(e.cpuPct) }),
                    ],
                  }),
                  (0, y.jsxs)(x.default, {
                    children: [
                      (0, y.jsx)(j.Label, { children: 'Mem\xf3ria' }),
                      (0, y.jsx)(j.Value, { size: 'sm', children: (0, N.formatBytes)(e.memUsed) }),
                    ],
                  }),
                  (0, y.jsxs)(x.default, {
                    children: [
                      (0, y.jsx)(j.Label, { children: 'Limite' }),
                      (0, y.jsx)(j.Value, { size: 'sm', children: (0, N.formatBytes)(e.memLimit) }),
                    ],
                  }),
                  (0, y.jsxs)(x.default, {
                    children: [
                      (0, y.jsx)(j.Label, { children: 'RX' }),
                      (0, y.jsx)(j.Value, { size: 'sm', children: (0, N.formatRate)(e.netRx) }),
                    ],
                  }),
                  (0, y.jsxs)(x.default, {
                    children: [
                      (0, y.jsx)(j.Label, { children: 'TX' }),
                      (0, y.jsx)(j.Value, { size: 'sm', children: (0, N.formatRate)(e.netTx) }),
                    ],
                  }),
                ],
              }),
              (0, y.jsx)(c.default, {
                className: 'mt-3 text-[11px] text-muted',
                children: e.status,
              }),
            ],
          }),
          (0, y.jsxs)(j.Card, {
            children: [
              (0, y.jsxs)(x.default, {
                className: 'flex-row items-center justify-between',
                children: [
                  (0, y.jsx)(c.default, {
                    className: 'text-sm font-semibold text-white',
                    children: 'Logs',
                  }),
                  (0, y.jsx)(l.default, {
                    onPress: () => f((e) => !e),
                    className: 'rounded-lg border border-border px-3 py-1.5 active:opacity-70',
                    children: (0, y.jsx)(c.default, {
                      className: 'text-xs text-accent',
                      children: o ? 'Ocultar' : 'Carregar',
                    }),
                  }),
                ],
              }),
              o
                ? (0, y.jsx)(x.default, {
                    className: 'mt-3',
                    children: h.isLoading
                      ? (0, y.jsx)(a.default, { color: '#38bdf8' })
                      : h.data && h.data.available
                        ? (0, y.jsx)(n.default, {
                            horizontal: !0,
                            children: (0, y.jsx)(c.default, {
                              className: 'font-mono text-[11px] leading-4 text-slate-300',
                              children: h.data.logs || '(vazio)',
                            }),
                          })
                        : (0, y.jsx)(c.default, {
                            className: 'text-xs text-muted',
                            children: 'Logs indispon\xedveis para este container.',
                          }),
                  })
                : null,
            ],
          }),
        ],
      });
    }
    function L() {
      const { isTablet: e } = (0, h.useBreakpoint)(),
        t = (0, b.useOverview)(),
        { snapshot: u } = (0, p.useLiveMetrics)(!0),
        [N, L] = (0, s.useState)(''),
        [v, C] = (0, s.useState)(null),
        S = (0, s.useMemo)(() => u?.containers ?? t.data?.containers ?? [], [u, t.data]),
        P = (0, s.useMemo)(() => {
          const e = N.trim().toLowerCase();
          return [
            ...(e
              ? S.filter(
                  (t) =>
                    t.displayName.toLowerCase().includes(e) || t.image.toLowerCase().includes(e),
                )
              : S),
          ].sort((e, t) => (t.memUsed ?? 0) - (e.memUsed ?? 0));
        }, [S, N]),
        z = S.find((e) => e.id === v) ?? (e ? P[0] : void 0);
      if (t.isLoading && 0 === S.length)
        return (0, y.jsx)(x.default, {
          className: 'flex-1 items-center justify-center bg-surface',
          children: (0, y.jsx)(a.default, { color: '#38bdf8' }),
        });
      const V = (0, y.jsxs)(x.default, {
        className: 'flex-1',
        children: [
          (0, y.jsxs)(x.default, {
            className: 'px-4 pb-3 pt-2',
            children: [
              (0, y.jsx)(o.default, {
                value: N,
                onChangeText: L,
                placeholder: 'Buscar container ou imagem',
                placeholderTextColor: '#5b6b85',
                className: 'h-10 rounded-xl border border-border bg-card px-4 text-sm text-white',
              }),
              (0, y.jsxs)(c.default, {
                className: 'mt-2 text-[11px] text-muted',
                children: [P.length, ' containers \xb7 ordenados por mem\xf3ria'],
              }),
            ],
          }),
          (0, y.jsxs)(n.default, {
            contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
            children: [
              P.map((e) =>
                (0, y.jsx)(
                  f.ContainerCard,
                  { container: e, selected: z?.id === e.id, onPress: () => C(e.id) },
                  e.id,
                ),
              ),
              0 === P.length
                ? (0, y.jsx)(j.EmptyState, {
                    title: 'Nenhum container encontrado',
                    description: 'Verifique o socket do Docker na API.',
                  })
                : null,
            ],
          }),
        ],
      });
      return e
        ? (0, y.jsxs)(x.default, {
            className: 'flex-1 flex-row bg-surface',
            children: [
              (0, y.jsx)(x.default, { className: 'w-[42%] border-r border-border', children: V }),
              (0, y.jsx)(x.default, {
                className: 'flex-1',
                children: z
                  ? (0, y.jsx)(w, { container: z })
                  : (0, y.jsx)(x.default, {
                      className: 'flex-1 items-center justify-center px-8',
                      children: (0, y.jsx)(j.EmptyState, { title: 'Selecione um container' }),
                    }),
              }),
            ],
          })
        : (0, y.jsx)(x.default, {
            className: 'flex-1 bg-surface',
            children:
              v && z
                ? (0, y.jsxs)(x.default, {
                    className: 'flex-1',
                    children: [
                      (0, y.jsx)(x.default, {
                        className: 'flex-row items-center justify-between px-4 py-3',
                        children: (0, y.jsx)(l.default, {
                          onPress: () => C(null),
                          className: 'active:opacity-60',
                          children: (0, y.jsx)(c.default, {
                            className: 'text-sm text-accent',
                            children: '\u2190 Voltar',
                          }),
                        }),
                      }),
                      (0, y.jsx)(w, { container: z }),
                    ],
                  })
                : V,
          });
    }
  },
  777,
  [2861, 12, 228, 245, 133, 188, 255, 109, 2854, 2860, 2856, 2857, 2862, 2863, 2864, 289],
);
__d(
  function (g, r, i, a, m, _e, d) {
    'use strict';
    function e(e) {
      return e && e.__esModule ? e : { default: e };
    }
    (Object.defineProperty(_e, '__esModule', { value: !0 }),
      (_e.ContainerCard = function ({ container: e, selected: x, onPress: f }) {
        return (0, u.jsxs)(t.default, {
          onPress: f,
          className:
            'rounded-2xl border bg-card p-4 active:opacity-80 ' +
            (x ? 'border-accent' : 'border-border'),
          children: [
            (0, u.jsxs)(l.default, {
              className: 'flex-row items-center justify-between gap-2',
              children: [
                (0, u.jsx)(s.default, {
                  numberOfLines: 1,
                  className: 'flex-1 text-sm font-semibold text-white',
                  children: e.displayName,
                }),
                (0, u.jsx)(n.StatusBadge, { label: e.state, tone: (0, n.toneFromStatus)(e.state) }),
              ],
            }),
            (0, u.jsx)(s.default, {
              numberOfLines: 1,
              className: 'mt-0.5 text-[11px] text-muted',
              children: e.image,
            }),
            (0, u.jsxs)(l.default, {
              className: 'mt-3 flex-row gap-6',
              children: [
                (0, u.jsxs)(l.default, {
                  children: [
                    (0, u.jsx)(s.default, {
                      className: 'text-[10px] uppercase tracking-wider text-muted',
                      children: 'CPU',
                    }),
                    (0, u.jsx)(s.default, {
                      className: 'text-sm font-medium text-white',
                      children: (0, c.formatPercent)(e.cpuPct),
                    }),
                  ],
                }),
                (0, u.jsxs)(l.default, {
                  children: [
                    (0, u.jsx)(s.default, {
                      className: 'text-[10px] uppercase tracking-wider text-muted',
                      children: 'RAM',
                    }),
                    (0, u.jsx)(s.default, {
                      className: 'text-sm font-medium text-white',
                      children: (0, c.formatBytes)(e.memUsed),
                    }),
                  ],
                }),
                (0, u.jsxs)(l.default, {
                  children: [
                    (0, u.jsx)(s.default, {
                      className: 'text-[10px] uppercase tracking-wider text-muted',
                      children: 'RAM %',
                    }),
                    (0, u.jsx)(s.default, {
                      className: 'text-sm font-medium text-white',
                      children: (0, c.formatPercent)(e.memPct),
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }));
    var t = e(r(d[0])),
      s = e(r(d[1])),
      l = e(r(d[2])),
      c = r(d[3]),
      n = r(d[4]),
      u = r(d[5]);
  },
  2860,
  [245, 188, 109, 2864, 2856, 289],
);
