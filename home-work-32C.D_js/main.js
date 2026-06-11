'use strict';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'thewdb';
const DEFAULT_QUERY = 'matrix';
const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY = 450;
const PLACEHOLDER_POSTER = 'https://placehold.co/420x630/111b22/f8fbfb?text=No+Poster';

const searchInput = document.querySelector('[data-search-input]');
const statusElement = document.querySelector('[data-search-status]');
const countElement = document.querySelector('[data-result-count]');
const resultsGrid = document.querySelector('[data-results-grid]');
const emptyState = document.querySelector('[data-empty-state]');

let debounceTimerId = 0;
let activeController = null;

function setStatus(type, message, ...details) {
  statusElement.classList.toggle('is-error', type === 'error');
  statusElement.textContent = [message, ...details].filter(Boolean).join(' ');
}

function setResultCount(count) {
  countElement.textContent = `${count} ${count === 1 ? 'результат' : 'результатів'}`;
}

function clearResults() {
  resultsGrid.replaceChildren();
  setResultCount(0);
}

function toggleEmptyState(isVisible) {
  emptyState.hidden = !isVisible;
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
    imdbID,
  } = movie;

  return {
    title,
    year,
    type,
    poster: normalizePoster(poster),
    imdbID,
  };
}

function createMovieCollection(movies) {
  return {
    items: [...movies],
    get size() {
      return this.items.length;
    },
    *[Symbol.iterator]() {
      yield* this.items;
    },
  };
}

function* movieCardGenerator(movieCollection) {
  for (const movie of movieCollection) {
    yield createMovieCard(movie);
  }
}

function createMovieCard(movie) {
  const { title, year, type, poster, imdbID } = normalizeMovie(movie);

  const card = document.createElement('article');
  card.className = 'movie-card';

  const posterWrap = document.createElement('div');
  posterWrap.className = 'movie-card__poster-wrap';

  const posterImage = document.createElement('img');
  posterImage.className = 'movie-card__poster';
  posterImage.src = poster;
  posterImage.alt = `Постер фільму ${title}`;
  posterImage.loading = 'lazy';

  const content = document.createElement('div');
  content.className = 'movie-card__content';

  const titleElement = document.createElement('h3');
  titleElement.className = 'movie-card__title';
  titleElement.textContent = title;

  const meta = document.createElement('p');
  meta.className = 'movie-card__meta';

  const yearBadge = document.createElement('span');
  yearBadge.className = 'movie-card__badge';
  yearBadge.textContent = year;

  const typeBadge = document.createElement('span');
  typeBadge.className = 'movie-card__badge';
  typeBadge.textContent = type;

  const link = document.createElement('a');
  link.className = 'movie-card__link';
  link.href = `https://www.imdb.com/title/${imdbID}/`;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = 'Відкрити IMDb';

  posterWrap.append(posterImage);
  meta.append(yearBadge, typeBadge);
  content.append(titleElement, meta, link);
  card.append(posterWrap, content);

  return card;
}

function renderMovies(movies) {
  const movieCollection = createMovieCollection(movies);
  const fragment = document.createDocumentFragment();

  for (const card of movieCardGenerator(movieCollection)) {
    fragment.append(card);
  }

  resultsGrid.replaceChildren(fragment);
  setResultCount(movieCollection.size);
  toggleEmptyState(movieCollection.size === 0);
}

async function fetchMovies(query) {
  if (activeController) {
    activeController.abort();
  }

  activeController = new AbortController();

  const url = new URL(API_URL);
  url.search = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    type: 'movie',
  }).toString();

  const response = await fetch(url, {
    signal: activeController.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP status ${response.status}`);
  }

  return response.json();
}

async function searchMovies(query) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    clearResults();
    toggleEmptyState(false);
    setStatus('neutral', `Введіть щонайменше ${MIN_QUERY_LENGTH} символи.`);
    return;
  }

  try {
    setStatus('neutral', 'Шукаємо фільми для запиту:', `"${normalizedQuery}"`);
    toggleEmptyState(false);

    const data = await fetchMovies(normalizedQuery);
    const movies = data?.Search ?? [];

    if (data?.Response === 'False') {
      clearResults();
      toggleEmptyState(true);
      setStatus('error', data?.Error ?? 'Фільми не знайдено.');
      return;
    }

    renderMovies(movies);
    setStatus('neutral', 'Результати оновлено без натискання кнопки.');
  } catch (error) {
    if (error.name === 'AbortError') {
      return;
    }

    clearResults();
    toggleEmptyState(true);
    setStatus('error', 'Не вдалося отримати дані з API.', error.message);
  }
}

function handleLiveSearch() {
  window.clearTimeout(debounceTimerId);

  debounceTimerId = window.setTimeout(() => {
    searchMovies(searchInput.value);
  }, SEARCH_DELAY);
}

function initializeSearch() {
  if (!searchInput || !statusElement || !countElement || !resultsGrid || !emptyState) {
    return;
  }

  searchInput.addEventListener('input', handleLiveSearch);
  searchInput.value = searchInput.value || DEFAULT_QUERY;
  searchMovies(searchInput.value);
}

document.addEventListener('DOMContentLoaded', initializeSearch);
