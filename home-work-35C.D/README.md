# ДЗ 35.1. Webpack mastery

Окремий Webpack-проєкт для практики DevServer, зовнішніх CSS-файлів, препроцесорів, TypeScript, Babel, ESLint і Bundle Analyzer.

## Реалізовано

- `webpack-dev-server` з hot reload та live reload на порту `3500`;
- зовнішні CSS-файли через `css-loader`, `style-loader` у dev і `MiniCssExtractPlugin` у production;
- підтримка `SCSS`, `Sass` та `Less`;
- компіляція TypeScript через Babel preset TypeScript;
- транспіляція JavaScript через Babel preset env;
- перевірка коду через `eslint-webpack-plugin` та окрему команду `npm run lint`;
- `webpack-bundle-analyzer` через команду `npm run analyze`;
- production-збірка з хешованими назвами JS/CSS/assets і vendor chunk.

## Команди

```bash
npm install
npm run dev
npm run build
npm run lint
npm run analyze
```

Після `npm run build` готова сторінка лежить у папці `dist`.
