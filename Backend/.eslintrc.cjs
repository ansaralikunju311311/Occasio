// module.exports = {
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   plugins: ['@typescript-eslint', 'import'],
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'prettier',
//   ],
//   rules: {
//     'no-console': 'warn',
//     '@typescript-eslint/no-unused-vars': 'warn',
//     'import/order': [
//       'warn',
//       {
//         groups: [['builtin', 'external'], 'internal'],
//       },
//     ],
//   },
// };

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',

    'no-console':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'eqeqeq': 'error',
    'curly': 'error',

    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules'],
};