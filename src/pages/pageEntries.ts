import { ComponentType } from 'react';
import {
  Dictionary,
  List,
  PageTemplateData
} from '../pageData/models/pageEntry';
import CS5TemplateEntry from './templateEntries/CS5TemplateEntry';
import HeroStandard3x1 from './templateEntries/HeroStandard3x1';
import P2PageEntry from './templateEntries/P2TemplateEntry';
import HomePage from './templates/HomePage';
import OtherPage from './templates/OtherPage';

const home = 'Home';
const category = 'Category';
const movieDetail = 'Movie Detail';
const listDetail = 'List Detail';

export const pageEntries: Dictionary<ComponentType<PageTemplateData>> = {
  [home]: HomePage,
  [category]: HomePage,
  [listDetail]: OtherPage,
  [movieDetail]: OtherPage
};

export const pageTemplateEntries: Dictionary<ComponentType<List>> = {
  P2: P2PageEntry,
  H7: P2PageEntry,
  '2:3 Poster (Standard)': P2PageEntry,
  '3:1 Hero (Standard)': HeroStandard3x1,
  '2:3 Poster (Block Hero)': P2PageEntry,
  D6: P2PageEntry,
  CS5: CS5TemplateEntry
};
