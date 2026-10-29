const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', 'dist-web/*', 'node_modules/*', '.expo/*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'import/order': 'off',
    },
  },
];
