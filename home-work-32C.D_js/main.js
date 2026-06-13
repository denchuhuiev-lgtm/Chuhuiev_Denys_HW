'use strict';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'thewdb';
const MIN_QUERY_LENGTH = 3;
const SEARCH_DELAY = 450;
const PLACEHOLDER_POSTER = 'https://placehold.co/420x630/111b22/f8fbfb?text=No+Poster';

const searchInput = document.querySelector('[data-search-input]');
const statusElement = document.querySelector('[data-search-status]');
const countElement = document.querySelector('[data-result-count]');
const resultsGrid = document.querySelector('[data-results-grid]');
const emptyState = document.querySelector('[data-empty-state]');
const emptyTitle = document.querySelector('[data-empty-title]');
const emptyText = document.querySelector('[data-empty-text]');
const loader = document.querySelector('[data-search-loader]');
const movieTemplate = document.querySelector('[data-movie-template]');
const suggestionButtons = document.querySelectorAll('[data-suggestion]');

let debounceTimerId = 0;
let activeController = null;

function setStatus(type, message, ...details) {
  statusElement.className = `search-panel__status search-panel__status--${type}`;
  statusElement.textContent = [message, ...details].filter(Boolean).join(' ');
}

function setResultCount(count) {
  countElement.textContent = `${count} ${count === 1 ? 'результат' : 'результатів'}`;
}

function setLoading(isLoading) {
  loader.hidden = !isLoading;
}

function clearResults() {
  resultsGrid.replaceChildren();
  setResultCount(0);
}

function showEmptyState(type, title, text) {
  emptyState.className = `empty-state empty-state--${type}`;
  emptyTitle.textContent = title;
  emptyText.textContent = text;
  emptyState.hidden = false;
}

function hideEmptyState() {
  emptyState.hidden = true;
}

function normalizePoster(poster) {
  return poster && poster !== 'N/A' ? poster : PLACEHOLDER_POSTER;
}

function normalizeMovie(movie) {
  const {
    Title: title = 'Без назви',
    Year: year = 'Невідомий рік',
    Type: type = 'movie',
    Poster: poster,
    imdbID = '',
  } = movie;

  return {
    title,
    year,
    type,
    poster: normalizePoster(poster),
    imdbUrl: imdbID ? `https://www.imdb.com/title/${imdbID}/` : '',
  };
}

function fillMovieTemplate(movie) {
  const { title, year, type, poster, imdbUrl } = normalizeMovie(movie);
  const movieCard = movieTemplate.content.cloneNode(true);

  movieCard.querySelector('[data-movie-poster]').src = poster;
  movieCard.querySelector('[data-movie-poster]').alt = `Постер фільму ${title}`;
  movieCard.querySelector('[data-movie-title]').textContent = title;
  movieCard.querySelector('[data-movie-year]').textContent = year;
  movieCard.querySelector('[data-movie-type]').textContent = type;

  const movieLink = movieCard.querySelector('[data-movie-link]');

  if (imdbUrl) {
    movieLink.href = imdbUrl;
  } else {
    movieLink.remove();
  }

  return movieCard;
}

function renderMovies(movies) {
  const moviesToRender = [...movies];
  const fragment = document.createDocumentFragment();

  moviesToRender.forEach((movie) => {
    fragment.append(fillMovieTemplate(movie));
  });

  resultsGrid.replaceChildren(fragment);
  setResultCount(moviesToRender.length);
  hideEmptyState();
}

async function fetchMovies(query, controller) {
  const url = new URL(API_URL);
  url.search = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    type: 'movie',
  }).toString();

  const response = await fetch(url, {
    signal: controller.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP status ${response.status}`);
  }

  return response.json();
}

function abortActiveRequest() {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}

function renderTooShortState(query) {
  const charactersLeft = MIN_QUERY_LENGTH - query.length;

  abortActiveRequest();
  setLoading(false);
  clearResults();
  setStatus(
    'warning',
    `Пошук ще не запущено: введіть мінімум ${MIN_QUERY_LENGTH} символи.`,
    `Залишилось додати: ${charactersLeft}.`
  );
  showEmptyState(
    'info',
    'Замало символів для пошуку',
    'LiveSearch стартує автоматично, коли в полі буде щонайменше 3 символи.'
  );
}

function renderApiError(errorMessage) {
  clearResults();
  setStatus('error', 'OMDb API повернув помилку:', errorMessage);

  if (errorMessage === 'Too many results.') {
    showEmptyState(
      'error',
      'Помилка API: Too many results.',
      'Запит занадто широкий. Уточніть назву фільму, наприклад: matrix, batman begins або avatar.'
    );
    return;
  }

  showEmptyState(
    'warning',
    'Фільм не знайдено',
    errorMessage || 'Спробуйте інший запит або перевірте написання назви.'
  );
}

async function searchMovies(query) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    renderTooShortState(normalizedQuery);
    return;
  }

  abortActiveRequest();
  activeController = new AbortController();
  const currentController = activeController;

  try {
    setLoading(true);
    hideEmptyState();
    clearResults();
    setStatus('loading', 'Шукаємо фільми для запиту:', `"${normalizedQuery}"`);

    const data = await fetchMovies(normalizedQuery, currentController);
    const movies = data?.Search ?? [];

    if (data?.Response === 'False') {
      renderApiError(data?.Error);
      return;
    }

    renderMovies(movies);
    setStatus(
      'success',
      `Знайдено ${movies.length} результатів на сторінці.`,
      data?.totalResults ? `Усього в API: ${data.totalResults}.` : ''
    );
  } catch (error) {
    if (error.name === 'AbortError') {
      return;
    }

    clearResults();
    setStatus('error', 'Не вдалося отримати дані з API.', error.message);
    showEmptyState(
      'error',
      'Помилка завантаження',
      'Перевірте інтернет або спробуйте повторити пошук трохи пізніше.'
    );
  } finally {
    if (activeController === currentController) {
      activeController = null;
      setLoading(false);
    }
  }
}

function handleLiveSearch() {
  window.clearTimeout(debounceTimerId);

  debounceTimerId = window.setTimeout(() => {
    searchMovies(searchInput.value);
  }, SEARCH_DELAY);
}

function handleSuggestionClick(event) {
  window.clearTimeout(debounceTimerId);

  const query = event.currentTarget.dataset.suggestion;
  searchInput.value = query;
  searchInput.focus();
  searchMovies(query);
}

function renderInitialState() {
  clearResults();
  setStatus('info', `Введіть щонайменше ${MIN_QUERY_LENGTH} символи, і пошук почнеться автоматично.`);
  showEmptyState(
    'info',
    'Очікую пошуковий запит',
    'Почніть вводити назву фільму або натисніть один із прикладів над результатами.'
  );
}

function initializeSearch() {
  if (!searchInput || !statusElement || !countElement || !resultsGrid || !emptyState || !movieTemplate || !loader) {
    return;
  }

  searchInput.addEventListener('input', handleLiveSearch);
  suggestionButtons.forEach((button) => {
    button.addEventListener('click', handleSuggestionClick);
  });
  renderInitialState();
}

document.addEventListener('DOMContentLoaded', initializeSearch);
