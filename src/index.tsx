import React from 'react';
import ReactDOM from 'react-dom';
import { first, map, tap } from 'rxjs/operators';
import App from './App';
import './index.css';
import { Sitemap } from './pageData/models/config';
import { PageTemplateData } from './pageData/models/pageEntry';
import { configService, router } from './pageData/pageDataServices';
import { pageEntries } from './pages/pageEntries';
import { browserHistory } from './router/RouterContext';
import { RouterConfigRoute } from './router/types/router';
import * as serviceWorker from './serviceWorker';

function getConfig(): void {
  configService
    .getConfig()
    .pipe(
      first(),
      map(config => config.sitemap),
      map(sitemap => mapSitemapToRoute(sitemap)),
      tap(routes => router.addRoutes(routes)),
      tap(() => browserHistory.refresh())
    )
    .subscribe();
}

getConfig();

function mapSitemapToRoute(
  sitemap: Sitemap[]
): RouterConfigRoute<PageTemplateData>[] {
  return sitemap.map(s => ({
    name: s.title,
    path: s.path,
    template: pageEntries[s.template]
  }));
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
