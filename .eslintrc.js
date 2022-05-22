module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {
    "no-case-declarations": "off",
    quotes: [1, "double", {allowTemplateLiterals: true}],
    indent: [1, 2, {SwitchCase: 1, VariableDeclarator: {var: 1, let: 1, const: 1}}],
    "no-trailing-spaces": 1,
    "brace-style": [1, "1tbs", {allowSingleLine: true}],
    "newline-after-var": [1, "always"],
    "newline-before-return": 1,
    "@typescript-eslint/explicit-module-boundary-types": 1,
    "no-void": 1,
    "comma-dangle": ["error", "only-multiline"],
  },
  overrides: [
    {
      "files": ["*.vue"],
      "rules": {
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "comma-dangle": ["error", {
          "arrays": "only-multiline",
          "objects": "only-multiline",
          "imports": "only-multiline",
          "exports": "only-multiline",
          "functions": "never"
        }],
      }
    }
  ],
  ignorePatterns: [
    "packages/ios/www/*",
    "packages/android/app/assets/www/*",
    "packages/android/app/build/*",
    "packages/desktop/www/**",
    "packages/desktop/build/**",
    "packages/desktop/dist_electron/**",
    "packages/desktop/*.js",
    "**/*.tests.ts"
  ]
};
