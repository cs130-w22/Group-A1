module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 0,
    'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-unused-vars': 'warn',
    'react/prop-types': 'warn',
  },
};
