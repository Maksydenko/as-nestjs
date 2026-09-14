import perfectionist from 'eslint-plugin-perfectionist'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tsdoc from 'eslint-plugin-tsdoc'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import eslint from '@eslint/js'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  perfectionist.configs['recommended-natural'],
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      sourceType: 'commonjs'
    }
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      tsdoc,
      'unused-imports': unusedImports
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports'
        }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'warn',
        { ignoreParameters: false, ignoreProperties: false }
      ],
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'arrow-body-style': ['warn', 'as-needed'],
      curly: ['warn', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'func-style': ['warn', 'expression'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-lonely-if': 'warn',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unused-vars': 'off',
      'no-useless-rename': 'warn',
      'object-shorthand': ['warn', 'always'],
      'padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          next: ['class', 'const', 'export', 'function', 'let', 'var'],
          prev: 'import'
        },
        { blankLine: 'always', next: '*', prev: 'directive' },
        { blankLine: 'any', next: 'directive', prev: 'directive' },
        { blankLine: 'always', next: 'return', prev: '*' },
        {
          blankLine: 'always',
          next: ['do', 'for', 'if', 'switch', 'try', 'while', 'with'],
          prev: '*'
        },
        {
          blankLine: 'always',
          next: '*',
          prev: ['do', 'for', 'if', 'switch', 'try', 'while', 'with']
        }
      ],
      'perfectionist/sort-imports': 'off',
      'prefer-template': 'warn',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          objectWrap: 'collapse',
          semi: false,
          singleQuote: true,
          trailingComma: 'none'
        }
      ],
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // `import type` appends \\u0000 for grouping;
            // include it so @nestjs imports stay in this bucket and above `^[a-z]` packages.
            ['^@nestjs/'],
            ['^[a-z]'],
            ['^@'],
            ['^src/'],
            ['\\/enums$', '\\.enum$'],
            ['\\/types$', '\\.type$'],
            ['\\/constants$', '\\.const$'],
            ['\\/configs$', '\\.config$'],
            ['\\/schemas$', '\\.schema$'],
            ['\\/mocks$', '\\.mock$'],
            ['\\/data$', '\\.data$'],
            ['\\/utils$', '\\.util$'],
            ['\\/entities$', '\\.entity$'],
            ['\\/dto$', '\\.dto$'],
            ['\\/decorators$', '\\.decorator$'],
            ['\\/strategies$', '\\.strategy$'],
            ['\\/guards$', '\\.guard$'],
            ['\\/pipes$', '\\.pipe$'],
            ['\\/interceptors$', '\\.interceptor$'],
            ['\\/filters$', '\\.filter$'],
            ['\\/middlewares$', '\\.middleware$'],
            ['\\/services$', '\\.service$'],
            ['\\/controllers$', '\\.controller$'],
            ['\\/gateways$', '\\.gateway$'],
            ['\\/resolvers$', '\\.resolver$'],
            ['\\/modules$', '\\.module$'],
            ['^\\.\\.(?!/?$)', '^\\.(?!/?$)'],
            ['^'],
            ['^\\u0000']
          ]
        }
      ],
      'tsdoc/syntax': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },
  { files: ['eslint.config.mjs'], ...tseslint.configs.disableTypeChecked }
)
