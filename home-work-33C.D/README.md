# Домашнє завдання №33: Автоматизація веб-розробки з Gulp

Цей проєкт демонструє базову Gulp-збірку для фронтенду: SCSS компілюється у CSS, стилі отримують vendor prefixes, media queries групуються, а фінальний CSS додатково мінімізується.

## Структура

- `index.html` - готова сторінка домашнього завдання.
- `assets/scss/` - вихідні SCSS-файли, розділені на логічні частини.
- `assets/css/style.css` - скомпільований читабельний CSS.
- `assets/css/style.min.css` - мінімізований CSS для production.
- `assets/js/main.js` - невелика інтерактивність сторінки.
- `gulpfile.js` - задачі Gulp для збірки та локальної розробки.
- `package.json` - npm scripts і залежності проєкту.

## Запуск

```bash
npm install
npm run build
npm run dev
```

## Команди

- `npm run build` - форматує SCSS, компілює `style.css` і створює `style.min.css`.
- `npm run scss` - компілює тільки стилі.
- `npm run min` - створює тільки мінімізований CSS.
- `npm run comb` - форматує SCSS-файли.
- `npm run dev` - запускає BrowserSync і стежить за HTML, SCSS та JS.

## Що реалізовано

- SCSS-структура розділена на змінні, базу, layout, компоненти та adaptive-блоки.
- Gulp автоматизує компіляцію SCSS, autoprefixer, форматування, сортування media queries і мінімізацію CSS.
- HTML, CSS/SCSS та JavaScript рознесені по окремих файлах.
- На сторінці є пояснення pipeline, список Gulp-команд і кнопка повернення на головний індекс домашніх завдань.
