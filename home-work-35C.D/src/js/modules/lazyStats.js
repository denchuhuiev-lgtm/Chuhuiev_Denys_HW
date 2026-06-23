export const renderLazyStats = () => {
  const panel = document.querySelector('.build-panel');
  const badge = document.createElement('p');

  badge.className = 'build-panel__lazy-note';
  badge.textContent = 'Dynamic import loaded: lazyStats.js';
  panel.append(badge);
};
