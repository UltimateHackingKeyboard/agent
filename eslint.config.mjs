import globals from 'globals';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

const globalIgnores = [
    '.idea',
    '**/dist',
    '**/node_modules',
    'node_modules',
];

export const typescriptRules = {
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    '@typescript-eslint/only-throw-error': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/prefer-promise-reject-errors': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'no-async-promise-executor': 'off',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    'prefer-const': 'off',
}

export default [
    { ignores: globalIgnores },
    {
        ...eslint.configs.recommended,
        files: ['*.js', '*.cjs'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
            sourceType: 'commonjs',
        },
    },
    {
        ...eslint.configs.recommended,
        files: ['*.mjs'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
            sourceType: 'module',
        },
    },
    ...tsEslint.config(
        { ignores: ['**/*.js', '**/*.mjs'] },
        eslint.configs.recommended,
        // typescript-eslint shared configs
        tsEslint.configs.recommended,
        tsEslint.configs.recommendedTypeChecked,
        {
            languageOptions: {
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: import.meta.dirname,
                },
            },
            rules: typescriptRules
        },
    ),
]
