import { kebabCase } from 'lodash-es';
import 'normalize.css';
import '@styles/main.css';
import webpackMark from '@assets/images/webpack-mark.svg';
import { getBuildFeatures } from '@modules/build-features';

const heroImage = document.querySelector('#heroImage');
const buildTitle = document.querySelector('#buildTitle');
const buildList = document.querySelector('#buildList');

heroImage.src = webpackMark;

const projectName = 'Webpack Asset Management';
const features = getBuildFeatures();

buildTitle.textContent = kebabCase(projectName);
buildList.innerHTML = features
  .map((feature) => `<li class="build-panel__item">${feature}</li>`)
  .join('');
