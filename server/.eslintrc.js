module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
    'no-underscore-dangle': 0,
    'consistent-return': 0,
  },
};
