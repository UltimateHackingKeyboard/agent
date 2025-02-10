import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import angular from "angular-eslint";

import {typescriptRules} from "../../eslint.config.mjs";

export default tsEslint.config(
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tsEslint.configs.recommended,
            ...tsEslint.configs.recommendedTypeChecked,
            ...angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            ...typescriptRules,
            '@angular-eslint/component-class-suffix': 'off',
            '@angular-eslint/directive-class-suffix': 'off',
            '@angular-eslint/no-output-native': 'off',
            '@angular-eslint/no-output-on-prefix': 'off',
        },
    },
    {
        files: ["**/*.html"],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
        rules: {
            '@angular-eslint/template/alt-text': 'off',
            '@angular-eslint/template/click-events-have-key-events': 'off',
            '@angular-eslint/template/elements-content': 'off',
            '@angular-eslint/template/interactive-supports-focus': 'off',
            '@angular-eslint/template/label-has-associated-control': 'off',
            '@angular-eslint/template/no-autofocus': 'off',
        },
    }
);
