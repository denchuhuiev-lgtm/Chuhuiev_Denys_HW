'use strict';

//  **Завдання:**
//     1. Створення проекту: Ініціалізуйте новий проект та налаштуйте середовище для роботи з Jest.
// Для цього вам знадобиться створити новий каталог для проекту, ініціалізувати npm (`npm init -y`), встановити Jest як залежність розробки (`npm install --save-dev jest`) та додати в `package.json` скрипт для запуску тестів: `"test": "jest"`.
//     2. Тестування функції `ageClassification(num)`: Ваше завдання полягає у написанні тестів для функції `ageClassification(num)`, яка класифікує вік людини.
// Тест повинен перевірити коректність роботи функції для всіх вказаних у прикладі діапазонів віку.

function ageClassification(num) {
  if (typeof num !== 'number' || !Number.isFinite(num) || num <= 0 || num > 122) {
    return null;
  }

  return num <= 24 ? 'Дитинство' :
    num <= 44 ? 'Молодість' :
      num <= 65 ? 'Зрілість' :
        num <= 75 ? 'Старість' :
          num <= 90 ? 'Довголіття' :
            'Рекорд';
}

const ageExamples = [
  { value: -1, expected: null },
  { value: 0, expected: null },
  { value: 1, expected: 'Дитинство' },
  { value: 24, expected: 'Дитинство' },
  { value: 24.01, expected: 'Молодість' },
  { value: 44, expected: 'Молодість' },
  { value: 44.01, expected: 'Зрілість' },
  { value: 65, expected: 'Зрілість' },
  { value: 65.1, expected: 'Старість' },
  { value: 75, expected: 'Старість' },
  { value: 75.01, expected: 'Довголіття' },
  { value: 90, expected: 'Довголіття' },
  { value: 90.01, expected: 'Рекорд' },
  { value: 122, expected: 'Рекорд' },
  { value: 122.01, expected: null },
  { value: 150, expected: null },
];

// 3. Тестування функції weekFn(cond): Напишіть тести для функції weekFn(cond), що повертає назву дня тижня за заданим числом.
// Тест повинен переконатися, що функція коректно повертає назви для чисел від 1 до 7, та повертає null для невідповідних значень (наприклад, 9, 1.5, '2').

function weekFn(cond) {
  switch (cond) {
    case 1:
      return 'Понеділок';
    case 2:
      return 'Вівторок';
    case 3:
      return 'Середа';
    case 4:
      return 'Четвер';
    case 5:
      return 'П\'ятниця';
    case 6:
      return 'Субота';
    case 7:
      return 'Неділя';
    default:
      return null;
  }
}

const weekExamples = [
  { value: 1, expected: 'Понеділок' },
  { value: 2, expected: 'Вівторок' },
  { value: 3, expected: 'Середа' },
  { value: 4, expected: 'Четвер' },
  { value: 5, expected: 'П\'ятниця' },
  { value: 6, expected: 'Субота' },
  { value: 7, expected: 'Неділя' },
  { value: 9, expected: null },
  { value: 1.5, expected: null },
  { value: '2', expected: null },
];

function formatValue(value) {
  return value === null ? 'null' : String(value);
}

function createResultRow(example, handler) {
  const row = document.createElement('tr');
  row.className = 'results-table__row';

  const inputCell = document.createElement('td');
  inputCell.className = 'results-table__cell';
  inputCell.textContent = formatValue(example.value);

  const expectedCell = document.createElement('td');
  expectedCell.className = 'results-table__cell';
  expectedCell.textContent = formatValue(example.expected);

  const resultCell = document.createElement('td');
  resultCell.className = 'results-table__cell';
  resultCell.textContent = formatValue(handler(example.value));

  row.append(inputCell, expectedCell, resultCell);

  return row;
}

function renderExamples() {
  const ageResults = document.querySelector('[data-age-results]');
  const weekResults = document.querySelector('[data-week-results]');

  if (ageResults) {
    ageExamples.forEach((example) => {
      ageResults.append(createResultRow(example, ageClassification));
    });
  }

  if (weekResults) {
    weekExamples.forEach((example) => {
      weekResults.append(createResultRow(example, weekFn));
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', renderExamples);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ageClassification,
    weekFn,
    ageExamples,
    weekExamples,
  };
}
