# Домашнє завдання 11

## Тема

CSS-препроцесори Less, Sass, SCSS.

## Опис роботи

У цьому домашньому завданні шаблон **Simple Site** було перероблено зі звичайного CSS у більш структурований **SCSS**-проєкт.

Під час виконання роботи було:

- розділено стилі на логічні модулі
- створено окрему структуру папок для SCSS-файлів
- використано `@use` та `@forward`
- замінено CSS-змінні на SCSS-змінні
- додано вкладеність селекторів
- використано міксини та медіа-міксини
- збережено готовий скомпільований файл `styles.css` для підключення в HTML

## Структура проєкту

```text
home-work-11C.D/
|-- index.html
|-- styles.css
|-- styles.css.map
|-- script.js
|-- package.json
|-- .gitignore
|-- scss/
|   |-- abstracts/
|   |-- base/
|   |-- components/
|   |-- layout/
|   |-- sections/
|   `-- main.scss
`-- File/
    |-- Code.mp4
    `-- project.svg
```

## Компіляція SCSS у CSS

Для збірки стилів можна використати команду:

```bash
npm run build:css
```

Або напряму:

```bash
sass scss/main.scss styles.css --style=expanded
```

## Результат

Сайт зберіг свою структуру, функціональність та зовнішній вигляд, але стилі були організовані у більш зручному для підтримки форматі SCSS.

## Посилання

- GitHub Repository: https://github.com/denchuhuiev-lgtm/Chuhuiev_Denys_HW
- GitHub Pages: https://denchuhuiev-lgtm.github.io/Chuhuiev_Denys_HW/home-work-11C.D/

## Автор

Denys Chuhuiev
