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
          return u;
        },
      }));
    var t = r(d[0]),
      o = e(r(d[1])),
      n = e(r(d[2])),
      s = r(d[3]),
      c = r(d[4]);
    function l({ symbol: e, focused: t }) {
      return (0, c.jsx)(n.default, { style: { fontSize: 18, opacity: t ? 1 : 0.45 }, children: e });
    }
    function u() {
      const { signOut: e } = (0, s.useAuth)();
      return (0, c.jsxs)(t.Tabs, {
        screenOptions: {
          headerStyle: { backgroundColor: '#0b1220' },
          headerShadowVisible: !1,
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
          headerRight: () =>
            (0, c.jsx)(o.default, {
              onPress: () => {
                e();
              },
              className: 'mr-4 active:opacity-60',
              children: (0, c.jsx)(n.default, {
                className: 'text-xs text-muted',
                children: 'Sair',
              }),
            }),
        },
        children: [
          (0, c.jsx)(t.Tabs.Screen, {
            name: 'index',
            options: {
              title: 'Dashboard',
              tabBarIcon: ({ focused: e }) => (0, c.jsx)(l, { symbol: '\ud83d\udcca', focused: e }),
            },
          }),
          (0, c.jsx)(t.Tabs.Screen, {
            name: 'containers',
            options: {
              title: 'Containers',
              tabBarIcon: ({ focused: e }) => (0, c.jsx)(l, { symbol: '\ud83d\udce6', focused: e }),
            },
          }),
          (0, c.jsx)(t.Tabs.Screen, {
            name: 'chat',
            options: {
              title: 'Chat',
              tabBarIcon: ({ focused: e }) => (0, c.jsx)(l, { symbol: '\ud83d\udcac', focused: e }),
            },
          }),
        ],
      });
    }
  },
  775,
  [782, 245, 188, 783, 289],
);
