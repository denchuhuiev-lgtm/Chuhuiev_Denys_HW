console.log('#31. JavaScript homework: Event Loop, Fetch and CRUD');

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/*
 *
 * #1
 *
 * Функціональні Вимоги:
 * 1. Вхідні параметри:
 *  - `segment`: Рядок, який представляє сегмент шляху URL до ресурсу на API. Наприклад: `/posts` для отримання списку постів, `/posts/1` для отримання посту з ідентифікатором 1.
 *
 * 2. Запити до API:
 *  - Виконати асинхронний HTTP GET запит до `https://jsonplaceholder.typicode.com`, додавши сегмент шляху `segment` до базового URL.
 *  - Використати `fetch` для надсилання запиту.
 *
 * 3. Обробка відповідей:
 *  - У разі успішної відповіді (HTTP статус 200-299), конвертувати відповідь у формат JSON і повернути отримані дані.
 *  - Якщо відповідь вказує на помилку (HTTP статус виходить за межі 200-299), повернути HTTP статус як індикатор помилки.
 *  - При виникненні помилки в процесі виконання запиту (наприклад, мережева помилка), логувати помилку у консоль і повертати текст помилки.
 *
 * 4. Логування:
 *  - Вивести у консоль отримані дані при успішному запиті.
 *  - Логувати помилку у консоль при її виникненні.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), зокрема асинхронних функцій (`async/await`).
 * - Належне управління помилками та виключеннями.
 * - Код має бути чистим, добре структурованим, зі зрозумілими назвами змінних та функцій.
 *
 */

function normalizeSegment(segment) {
  if (typeof segment !== 'string' || segment.trim() === '') {
    return '/posts';
  }

  return segment.startsWith('/') ? segment : `/${segment}`;
}

async function readResponseBody(response) {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function getData(segment) {
  try {
    const response = await fetch(`${API_BASE_URL}${normalizeSegment(segment)}`);

    if (!response.ok) {
      console.error(`Failed to fetch data. Status: ${response.status}`);
      return response.status;
    }

    const data = await readResponseBody(response);
    console.log(data);

    return data;
  } catch (error) {
    const message = formatError(error);
    console.error('Error during GET request:', message);

    return message;
  }
}

/*
 *
 * #2
 * Функціональні вимоги:
 *
 * 1. Вхідні параметри:
 *  - `segment`: Рядок, що вказує на сегмент API для виконання POST запиту (наприклад, `/posts`).
 *  - `data`: Об'єкт, який містить дані для відправки в тілі запиту.
 *
 * 2. Виконання запиту:
 *  - Виконати асинхронний HTTP POST запит до `https://jsonplaceholder.typicode.com`, додавши `segment` до URL. Використати `data` як тіло запиту.
 *  - Встановити необхідні заголовки для запиту, зокрема `Content-Type: application/json`.
 *
 * 3. Обробка відповіді:
 *  - У разі успішного отримання відповіді (HTTP статус 200-299), конвертувати відповідь у формат JSON і повернути отримані дані.
 *  - Якщо відповідь вказує на помилку (HTTP статус виходить за межі 200-299), повернути повідомлення про помилку.
 *
 * 4. Логування:
 *  - Логувати у консоль результат або повідомлення про помилку.
 *
 * Технічні Вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), зокрема асинхронних функцій (`async/await`).
 * - Належне управління помилками та відповідями від API.
 *
 */

async function postData(segment, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${normalizeSegment(segment)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const message = `Failed to create resource. Status: ${response.status}`;
      console.error(message);

      return message;
    }

    const result = await readResponseBody(response);
    console.log(result);

    return result;
  } catch (error) {
    const message = formatError(error);
    console.error('Error during POST request:', message);

    return message;
  }
}

/*
 *
 * #3
 *
 * Функціональні вимоги:
 *
 * 1. Вхідні параметри:
 *  - `id`: Ідентифікатор об'єкта, який потрібно оновити.
 *  - `data`: Об'єкт з даними для оновлення.
 *
 * 2. Виконання запиту:
 *  - Виконати асинхронний HTTP PUT запит до `https://jsonplaceholder.typicode.com/posts/${id}` з використанням `id` та `data`.
 *  - Встановити заголовок `Content-Type: application/json`.
 * 3. Обробка відповідей:
 *  - У разі успішної відповіді, конвертувати відповідь у формат JSON і повернути отримані дані.
 *  - Якщо відповідь вказує на помилку (наприклад, неіснуючий ресурс або проблеми з сервером), повернути повідомлення про помилку.
 *
 * 4. Логування:
 *  - Логувати у консоль результат або повідомлення про помилку.
 *
 * Технічні Вимоги:
 * - Використання асинхронних функцій (`async/await`) для обробки HTTP запитів.
 * - Належне управління помилками та відповідями від API.
 *
 */

async function putData(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      const message = `Failed to update post with id ${id}. Status: ${response.status}`;
      console.error(message);

      return message;
    }

    const result = await readResponseBody(response);
    console.log(result);

    return result;
  } catch (error) {
    const message = formatError(error);
    console.error('Error during PUT request:', message);

    return message;
  }
}

/*
 *
 * #4
 * Функціональні вимоги:
 *
 * 1. Вхідні параметри:
 *  - `id`: Ідентифікатор об'єкта, який потрібно оновити.
 *  - `data`: Об'єкт з даними для оновлення.
 *
 * 2. Виконання запиту:
 *  - Виконати асинхронний HTTP PATCH запит до `https://jsonplaceholder.typicode.com/posts/${id}` з використанням `id` та `data`.
 *  - Встановити заголовок `Content-Type: application/json`.
 *
 * 3. Обробка відповідей:
 *  - У разі успішної відповіді, конвертувати відповідь у формат JSON і повернути отримані дані.
 *  - Якщо відповідь вказує на помилку (наприклад, неіснуючий ресурс або проблеми з сервером), повернути повідомлення про помилку.
 *
 * 4. Логування:
 *  - Логувати у консоль результат або повідомлення про помилку.
 *
 * Технічні Вимоги:
 * - Використання асинхронних функцій (`async/await`) для обробки HTTP запитів.
 * - Належне управління помилками та відповідями від API.
 *
 */

async function patchData(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const message = `Failed to patch post with id ${id}. Status: ${response.status}`;
      console.error(message);

      return message;
    }

    const result = await readResponseBody(response);
    console.log(result);

    return result;
  } catch (error) {
    const message = formatError(error);
    console.error('Error during PATCH request:', message);

    return message;
  }
}

/*
 *
 * #5
 * Функціональні вимоги:
 *
 * 1. Вхідні дані:
 *  - Функція приймає один параметр id — ідентифікатор ресурсу, який потрібно видалити.
 *
 * 2. Запит на видалення:
 *  - Виконати асинхронний HTTP DELETE запит до API за адресою https://jsonplaceholder.typicode.com/posts/${id}, де ${id} замінюється на конкретний ідентифікатор ресурсу для видалення.
 *
 * 3. Обробка відповіді:
 *  - Якщо запит успішний (HTTP статус відповіді 200-299), логувати успішне повідомлення і повертати true.
 *  - У випадку отримання відповіді зі статусом, що вказує на помилку (все, що поза діапазоном 200-299), логувати помилку зі статусом і повертати сам статус помилки.
 *  - При виникненні помилки в процесі виконання запиту (наприклад, мережева помилка), логувати повідомлення про помилку і повертати текст помилки.
 *
 * 4. Логування:
 *  - Успішне видалення: Логувати повідомлення у консоль у форматі: "Post with id [id] has been successfully deleted.", де [id] — це ідентифікатор видаленого ресурсу.
 *  - Неуспішне видалення: Логувати повідомлення у консоль у форматі: "Failed to delete post with id [id]. Status: [status]", де [id] — ідентифікатор ресурсу, а [status] — HTTP статус відповіді.
 *  - Помилка виконання запиту: Логувати повідомлення у консоль у форматі: "Error during deletion: [error message]", де [error message] — текст помилки.
 *
 * Технічні вимоги:
 * - Використання асинхронних функцій (async/await) для обробки HTTP запитів.
 * - Забезпечити належну обробку помилок та відповідей від API.
 * - Функція повинна бути експортована для подальшого використання або тестування.
 *
 */

async function deleteData(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error(`Failed to delete post with id ${id}. Status: ${response.status}`);
      return response.status;
    }

    console.log(`Post with id ${id} has been successfully deleted.`);

    return true;
  } catch (error) {
    const message = formatError(error);
    console.error(`Error during deletion: ${message}`);

    return message;
  }
}

const actionMap = {
  get: () => getData('/posts/1'),
  post: () => postData('/posts', {
    title: 'Async homework',
    body: 'Fetch POST example from homework 31',
    userId: 1,
  }),
  put: () => putData(1, {
    title: 'Updated by PUT',
    body: 'Full resource update example',
    userId: 1,
  }),
  patch: () => patchData(1, {
    title: 'Partially updated by PATCH',
  }),
  delete: () => deleteData(1),
};

function printJson(output, data) {
  output.textContent = typeof data === 'string'
    ? data
    : JSON.stringify(data, null, 2);
}

function setPanelState(status, message, type = 'neutral') {
  status.className = `api-panel__status api-panel__status--${type}`;
  status.textContent = message;
}

async function runApiAction(action, output, status) {
  if (!actionMap[action]) {
    return;
  }

  setPanelState(status, 'Запит виконується...', 'pending');
  output.textContent = 'Очікуємо відповідь сервера...';

  const result = await actionMap[action]();
  const isError = typeof result === 'string' || typeof result === 'number';

  printJson(output, result);
  setPanelState(
    status,
    isError ? 'Запит завершився з помилкою або статусом.' : 'Запит успішно виконано.',
    isError ? 'error' : 'success'
  );
}

function setupApiPanel() {
  const output = document.querySelector('[data-api-output]');
  const status = document.querySelector('[data-api-status]');
  const buttons = document.querySelectorAll('[data-api-action]');

  if (!output || !status) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      runApiAction(button.dataset.apiAction, output, status);
    });
  });
}

function runEventLoopDemo() {
  const steps = document.querySelectorAll('[data-loop-step]');
  const output = [];

  function renderStep(text) {
    output.push(text);
    steps.forEach((step, index) => {
      step.textContent = output[index] || 'Очікує виконання...';
    });
  }

  steps.forEach((step) => {
    step.textContent = 'Очікує виконання...';
  });

  renderStep('1. Синхронний код потрапив у Call Stack і виконався першим.');

  Promise.resolve().then(() => {
    renderStep('2. Promise.then виконався як microtask перед macrotask.');
  });

  setTimeout(() => {
    renderStep('3. setTimeout виконався як macrotask після microtask.');
  }, 0);
}

function setupEventLoopDemo() {
  const button = document.querySelector('[data-loop-button]');

  if (button) {
    button.addEventListener('click', runEventLoopDemo);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupApiPanel();
    setupEventLoopDemo();
  });
}

export { getData, postData, putData, patchData, deleteData };
