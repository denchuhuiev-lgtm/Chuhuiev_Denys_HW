// Блок моделі даних використовується для опису Gulp-задач, які показуються на сторінці.
const gulpTasks = [
  {
    title: 'SCSS у CSS',
    text: 'Gulp читає головний SCSS-файл, компілює його у CSS і кладе результат у assets/css.',
    command: 'compileScss'
  },
  {
    title: 'Vendor prefixes',
    text: 'Autoprefixer додає потрібні префікси, щоб стилі стабільніше працювали у різних браузерах.',
    command: 'postcss(autoprefixer)'
  },
  {
    title: 'Форматування',
    text: 'CSSComb допомагає тримати структуру стилів однаковою та читабельною для розробників.',
    command: 'gulp comb'
  },
  {
    title: 'Мінімізація',
    text: 'cssnano прибирає зайві пробіли та оптимізує CSS для швидшого завантаження сторінки.',
    command: 'compileScssMin'
  },
  {
    title: 'Live reload',
    text: 'BrowserSync запускає локальний сервер і оновлює сторінку після змін у HTML, SCSS або JS.',
    command: 'gulp dev'
  }
];

// Блок пояснень команд використовується для інтерактивного опису npm scripts.
const commandDescriptions = {
  build: 'npm run build запускає повну збірку: форматування SCSS, CSS і minified CSS.',
  dev: 'npm run dev запускає BrowserSync, стежить за файлами та оновлює сторінку під час розробки.',
  scss: 'npm run scss компілює SCSS у звичайний CSS і створює мінімізовану версію.',
  min: 'npm run min створює тільки style.min.css для production-версії.'
};

// Блок DOM-посилань використовується для доступу до HTML-елементів сторінки.
const taskList = document.querySelector('[data-task-list]');
const taskTemplate = document.querySelector('[data-task-template]');
const commandList = document.querySelector('[data-command-list]');
const commandOutput = document.querySelector('[data-command-output]');

// Блок функції fillTaskTemplate використовується для наповнення HTML-шаблону даними задачі.
function fillTaskTemplate(task, index) {
  const taskElement = taskTemplate.content.firstElementChild.cloneNode(true);

  taskElement.querySelector('[data-task-number]').textContent = `0${index + 1}`;
  taskElement.querySelector('[data-task-title]').textContent = task.title;
  taskElement.querySelector('[data-task-text]').textContent = task.text;
  taskElement.querySelector('[data-task-command]').textContent = task.command;

  return taskElement;
}

// Блок функції renderTasks використовується для виведення всіх карток Gulp pipeline на сторінку.
function renderTasks(tasks) {
  const fragment = document.createDocumentFragment();

  tasks.forEach((task, index) => {
    fragment.append(fillTaskTemplate(task, index));
  });

  taskList.append(fragment);
}

// Блок функції setActiveCommand використовується для перемикання активної npm-команди.
function setActiveCommand(commandButton) {
  const commandKey = commandButton.dataset.command;
  const buttons = commandList.querySelectorAll('.command-button');

  buttons.forEach((button) => {
    button.classList.toggle('is-active', button === commandButton);
  });

  commandOutput.querySelector('.command-output__text').textContent = commandDescriptions[commandKey];
}

// Блок функції handleCommandClick використовується для обробки кліку по кнопках команд.
function handleCommandClick(event) {
  const commandButton = event.target.closest('[data-command]');

  if (!commandButton) {
    return;
  }

  setActiveCommand(commandButton);
}

// Блок ініціалізації використовується для запуску рендеру та підключення подій після завантаження JS.
renderTasks(gulpTasks);
commandList.addEventListener('click', handleCommandClick);
