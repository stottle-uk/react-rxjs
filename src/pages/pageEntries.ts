import { ComponentType } from 'react';
import {
  Dictionary,
  List,
  PageTemplateData
} from '../pageData/models/pageEntry';
import CS1TemplateEntry from './templateEntries/CS1TemplateEntry';
import CS5TemplateEntry from './templateEntries/CS5TemplateEntry';
import HeroStandard3x1 from './templateEntries/HeroStandard3x1';
import LH1TemplateEntry from './templateEntries/LH1TemplateEntry';
import P2PageEntry from './templateEntries/P2TemplateEntry';
import CategoryPage from './templates/CategoryPage';
import ListDetailPage from './templates/ListDetailPage';

const home = 'Home';
const category = 'Category';
const movieDetail = 'Movie Detail';
const listDetail = 'List Detail';
const listDefailFeatured = 'List Detail Featured';

export const pageEntries: Dictionary<ComponentType<PageTemplateData>> = {
  [home]: CategoryPage,
  [category]: CategoryPage,
  [listDetail]: ListDetailPage,
  [movieDetail]: ListDetailPage,
  [listDefailFeatured]: ListDetailPage
};

export const pageTemplateEntries: Dictionary<ComponentType<List>> = {
  P2: P2PageEntry,
  H7: P2PageEntry,
  '2:3 Poster (Standard)': P2PageEntry,
  '3:1 Hero (Standard)': HeroStandard3x1,
  '2:3 Poster (Block Hero)': P2PageEntry,
  D6: P2PageEntry,
  CS5: CS5TemplateEntry,
  CS1: CS1TemplateEntry,
  LH1: LH1TemplateEntry
};
