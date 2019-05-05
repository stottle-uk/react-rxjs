import { Entry, Item, List, PageEntry, Paging } from '../../models/pageEntry';

const item: Item = {
  path: 'path'
};
const list1: List = {
  id: '1234',
  tagline: 'string',
  path: 'string',
  items: [],
  paging: {} as Paging
};
const list2: List = {
  id: '12345',
  tagline: 'string',
  path: 'string',
  items: [],
  paging: {} as Paging
};
const entry: Entry = {
  type: 'string',
  id: 'string',
  template: 'string',
  title: 'string',
  list: list1
};
const entry2: Entry = {
  type: 'string',
  id: 'string',
  template: 'string',
  title: 'string',
  list: list2
};

export const pageDataOther: PageEntry = {
  id: 'string',
  isStatic: false,
  isSystemPage: false,
  metadata: {},
  key: 'string',
  path: '/other',
  template: 'string',
  title: 'string',
  entries: [entry]
};

export const pageData: PageEntry = {
  id: 'string',
  isStatic: false,
  isSystemPage: false,
  metadata: {},
  key: 'string',
  path: '/',
  template: 'string',
  title: 'string',
  entries: [entry]
};
