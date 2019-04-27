export interface Sitemap {
  isStatic: boolean;
  isSystemPage: boolean;
  key: string;
  id: string;
  path: string;
  template: string;
  title: string;
}

export interface Config {
  // subscription: Subscription;
  // general: General;
  // linear: Linear;
  // classification: Classification;
  sitemap: Sitemap[];
  // navigation: Navigation;
  // profileImages: ProfileImages;
  // chromecastReceiver: ChromecastReceiver;
  // version: string;
}
