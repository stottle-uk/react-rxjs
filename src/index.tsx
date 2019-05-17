import React from 'react';
import ReactDOM from 'react-dom';
import { first, map, tap } from 'rxjs/operators';
import App from './App';
import './index.css';
import { Sitemap } from './pageData/models/config';
import { PageTemplateData } from './pageData/models/pageEntry';
import { configService, router } from './pageData/pageDataServices';
import { pageEntries } from './pages/pageEntries';
import NotFound from './pages/templates/NotFound';
import { browserHistory } from './router/RouterContext';
import { RouterConfigRoute } from './router/types/router';
import * as serviceWorker from './serviceWorker';

renderDom(NotFound);

configService
  .getConfig()
  .pipe(
    first(),
    map(config => config.sitemap),
    map(sitemap => mapSitemapToRoute(sitemap)),
    tap(routes => router.addRoutes(routes)),
    tap(() => browserHistory.refresh()),
    tap(() => renderDom(App))
  )
  .subscribe();

function mapSitemapToRoute(
  sitemap: Sitemap[]
): RouterConfigRoute<PageTemplateData>[] {
  return sitemap.map(s => ({
    name: s.title,
    path: s.path,
    template: pageEntries[s.template]
  }));
}

function renderDom(Element: React.ComponentType<any>): void {
  ReactDOM.render(<Element />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
