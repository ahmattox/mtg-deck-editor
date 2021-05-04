module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    indent: 0,
    curly: 'error',
    semi: ['error', 'never'],
    eqeqeq: ['error', 'smart'],
    'space-in-parens': ['error', 'never'],
    'constructor-super': 'warn',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-extend-native': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-native-reassign': 'error',
    'no-spaced-func': 'error',
    'no-this-before-super': 'error',
    'no-unneeded-ternary': 'error',
    'no-var': 'warn',
    'prefer-const': 'warn',
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'no-console': 'warn',
    'react/prop-types': 'off',
    'react/jsx-indent': ['error', 2],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ]
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
