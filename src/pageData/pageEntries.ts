import { ComponentType } from 'react';
import { PageEntry } from './models/pageEntry';
import HomePage from './templates/HomePage';
import OtherPage from './templates/OtherPage';

const home = 'Home';
const category = 'Category';
const movieDetail = 'Movie Detail';
const listDetail = 'List Detail';

export const pageEntries: {
  [key: string]: ComponentType<PageEntry>;
} = {
  [home]: HomePage,
  [category]: HomePage,
  [listDetail]: OtherPage,
  [movieDetail]: OtherPage
};
