export interface PageEntry {
  id: string;
  isStatic: boolean;
  isSystemPage: boolean;
  metadata: any;
  key: string;
  path: string;
  template: string;
  title: string;
  entries: Entry[];
  list: List;
}

export interface Metadata {
  description: string;
  keywords: string[];
}

export interface Images {
  hero3x1?: string;
  poster?: string;
  wallpaper?: string;
  logo?: string;
  tile?: string;
}

export interface Offer {
  deliveryType: string;
  scopes: string[];
  resolution: string;
  availability: string;
  ownership: string;
  price: number;
}

export interface Classification {
  code: string;
  name: string;
}

export interface Item {
  images?: Images;
  duration?: number;
  releaseYear?: number;
  offers?: Offer[];
  scopes?: string[];
  categories?: string[];
  customFields?: any;
  customId?: string;
  genres?: string[];
  id?: string;
  type?: string;
  mouseOverDescription?: string;
  shortDescription?: string;
  contextualTitle?: string;
  title?: string;
  classification?: Classification;
  totalUserRatings?: number;
  path: string;
  watchPath?: string;
  averageUserRating?: number;
  badge?: string;
  tagline?: string;
}

export interface Options {
  pageSize: number;
}

export interface Authorization {
  type: string;
  scope: string;
}

export interface Paging {
  total?: number;
  page: number;
  size?: number;
  options?: Options;
  next?: string;
  authorization?: Authorization;
}

export interface Images2 {
  wallpaper: string;
}

export interface List {
  id: string;
  itemTypes?: string[];
  description?: string;
  tagline: string;
  title?: string;
  shortDescription?: string;
  path: string;
  items: Item[];
  size?: number;
  paging: Paging;
  images?: Images2;
  getMore: (paging: Paging) => void;
}

export interface CustomFields2 {
  customTagline?: string;
  assetTitlePosition?: string;
  moreLinkUrl?: string;
}

export interface Entry {
  type: string;
  id: string;
  template: string;
  title: string;
  list: List;
  customFields?: CustomFields2;
}
