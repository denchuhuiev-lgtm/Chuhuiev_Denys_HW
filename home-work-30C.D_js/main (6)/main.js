console.log('#30. JavaScript homework: Regular expressions')

/*
 * #1
 *
 * Написати функцію, яка приймає рядок як вхідний параметр і перевіряє, чи є цей рядок валідною електронною адресою за допомогою регулярного виразу.
 * Функція повертає true, якщо електронна адреса валідна, і false в іншому випадку.
 *
 */

function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false
  }

  const normalizedEmail = email.trim()
  const emailPattern = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i

  return emailPattern.test(normalizedEmail)
}

console.log(isValidEmail('example@example.com')) // Повинно вивести: true
console.log(isValidEmail('invalid-email'))       // Повинно вивести: false

/*
 * #2
 *
 * Написати функцію, яка приймає рядок як вхідний параметр і перевіряє, чи є цей рядок валідним URL веб-сайту за допомогою регулярного виразу.
 * Функція повертає true, якщо URL валідний, і false в іншому випадку.
 *
 */

/*

*/

function isValidUrl(url) {
  if (typeof url !== 'string') {
    return false
  }

  const normalizedUrl = url.trim()
  const urlPattern = /^https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i

  return urlPattern.test(normalizedUrl)
}

console.log(isValidUrl('https://www.example.com')) // Повинно вивести: true
console.log(isValidUrl('invalid-url'))             // Повинно вивести: false

const emailExamples = [
  { value: 'example@example.com', expected: true },
  { value: 'student.name+regex@ithillel.ua', expected: true },
  { value: 'invalid-email', expected: false },
  { value: 'user@@example.com', expected: false },
  { value: 'mail@example', expected: false },
]

const urlExamples = [
  { value: 'https://www.example.com', expected: true },
  { value: 'http://example.org/course/regex?lesson=30', expected: true },
  { value: 'https://sub.domain.io/path#top', expected: true },
  { value: 'invalid-url', expected: false },
  { value: 'ftp://example.com', expected: false },
]

const lessonSnippets = [
  {
    title: 'replace()',
    pattern: '/світ/gi',
    result: 'Привіт, світ. Світ великий.'.replace(/світ/gi, 'Всесвіт'),
  },
  {
    title: 'match()',
    pattern: '/\\d+/g',
    result: ('Ааааа, вулиця 12345!'.match(/\d+/g) || []).join(', '),
  },
  {
    title: 'test()',
    pattern: '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/',
    result: String(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test('example@mail.com')),
  },
]

function formatValue(value) {
  return String(value)
}

function formatBoolean(value) {
  return value ? 'true' : 'false'
}

function createResultRow(example, handler) {
  const row = document.createElement('tr')
  row.className = 'results-table__row'

  const inputCell = document.createElement('td')
  inputCell.className = 'results-table__cell'
  inputCell.textContent = formatValue(example.value)

  const expectedCell = document.createElement('td')
  expectedCell.className = 'results-table__cell'
  expectedCell.textContent = formatBoolean(example.expected)

  const resultCell = document.createElement('td')
  resultCell.className = 'results-table__cell'
  resultCell.textContent = formatBoolean(handler(example.value))

  row.append(inputCell, expectedCell, resultCell)

  return row
}

function renderValidationExamples() {
  const emailResults = document.querySelector('[data-email-results]')
  const urlResults = document.querySelector('[data-url-results]')

  if (emailResults) {
    emailExamples.forEach((example) => {
      emailResults.append(createResultRow(example, isValidEmail))
    })
  }

  if (urlResults) {
    urlExamples.forEach((example) => {
      urlResults.append(createResultRow(example, isValidUrl))
    })
  }
}

function createSnippetCard(snippet) {
  const item = document.createElement('article')
  item.className = 'snippet-card'

  const title = document.createElement('h3')
  title.className = 'snippet-card__title'
  title.textContent = snippet.title

  const pattern = document.createElement('code')
  pattern.className = 'snippet-card__pattern'
  pattern.textContent = snippet.pattern

  const result = document.createElement('p')
  result.className = 'snippet-card__result'
  result.textContent = snippet.result

  item.append(title, pattern, result)

  return item
}

function renderLessonSnippets() {
  const snippetsWrapper = document.querySelector('[data-lesson-snippets]')

  if (!snippetsWrapper) {
    return
  }

  lessonSnippets.forEach((snippet) => {
    snippetsWrapper.append(createSnippetCard(snippet))
  })
}

function setFormResult(output, isValid, successText, errorText) {
  output.className = `validator-card__result ${isValid ? 'is-valid' : 'is-invalid'}`
  output.textContent = isValid ? successText : errorText
}

function setupValidatorForm(form, handler, successText, errorText) {
  const input = form.querySelector('.validator-card__input')
  const output = form.querySelector('.validator-card__result')

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    setFormResult(output, handler(input.value), successText, errorText)
  })
}

function setupValidators() {
  const emailForm = document.querySelector('[data-email-form]')
  const urlForm = document.querySelector('[data-url-form]')

  if (emailForm) {
    setupValidatorForm(
      emailForm,
      isValidEmail,
      'Email відповідає регулярному виразу.',
      'Email не відповідає потрібному формату.'
    )
  }

  if (urlForm) {
    setupValidatorForm(
      urlForm,
      isValidUrl,
      'URL відповідає регулярному виразу.',
      'URL має починатися з http:// або https:// і містити домен.'
    )
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderValidationExamples()
    renderLessonSnippets()
    setupValidators()
  })
}

// Експорт функції для використання та тестування
export { isValidEmail, isValidUrl }
