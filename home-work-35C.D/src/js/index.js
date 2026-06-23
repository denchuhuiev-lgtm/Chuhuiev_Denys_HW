import { startCase } from 'lodash-es';
import 'normalize.css';
import '@styles/css/external.css';
import '@styles/scss/main.scss';
import '@styles/sass/highlights.sass';
import '@styles/less/theme.less';
import webpackCube from '@assets/images/webpack-cube.png';
import { createFeatureList } from '@modules/createFeatureList';

const heroImage = document.querySelector('#heroImage');
const buildTitle = document.querySelector('#buildTitle');
const buildList = document.querySelector('#buildList');

const pageTitle = 'webpack mastery pipeline';
const features = createFeatureList();

heroImage.src = webpackCube;
buildTitle.textContent = startCase(pageTitle);
buildList.innerHTML = features
  .map((feature) => `<li class="build-panel__item">${feature}</li>`)
  .join('');

import('@modules/lazyStats').then(({ renderLazyStats }) => {
  renderLazyStats();
});
