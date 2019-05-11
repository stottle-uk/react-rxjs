import { Entry, Item, List, PageEntry, Paging } from '../../models/pageEntry';

const item: Item = {
  path: 'path',
  images: {}
};
export const list1: List = {
  id: '1234',
  tagline: 'string',
  path: 'string',
  items: [],
  paging: {} as Paging
};
export const list1WithItems: List = {
  ...list1,
  items: [item]
};

export const list2: List = {
  ...list1,
  id: '12345'
};

export const list2WithItems: List = {
  ...list2,
  items: [item]
};

const entry: Entry = {
  type: 'string',
  id: 'string',
  template: 'string',
  title: 'string',
  list: list1
};
const entry2: Entry = {
  ...entry,
  list: list2WithItems
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
  entries: [entry, entry2]
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
  entries: [entry, entry2]
};
