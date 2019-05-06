import React, { Component } from 'react';
import { map, tap } from 'rxjs/operators';
import './App.css';
import { Sitemap } from './pageData/models/config';
import { PageEntry, PageTemplateData } from './pageData/models/pageEntry';
import {
  configService,
  dataService,
  router
} from './pageData/pageDataServices';
import { pageEntries } from './pageData/pageEntries';
import Link from './router/Link';
import Router from './router/Router';
import RouterOutlet from './router/RouterOutlet';
import { RouterConfigRoute } from './router/types/router';

export interface AppProps {}

interface AppState {
  routeName: string;
  pageData: PageTemplateData;
}

class App extends Component<AppProps, AppState> {
  state = {
    routeName: '',
    pageData: {
      pageEntry: {} as PageEntry,
      lists: {}
    }
  };

  componentDidMount(): void {
    configService
      .getConfig()
      .pipe(
        map(config => config.sitemap),
        map(sitemap => this.mapSitemapToRoute(sitemap)),
        tap(routes => router.addRoutes(routes))
      )
      .subscribe();

    dataService.pageData$
      .pipe(
        tap(pageData =>
          this.setState({
            pageData
          })
        )
      )
      .subscribe();
  }

  private mapSitemapToRoute(
    sitemap: Sitemap[]
  ): RouterConfigRoute<PageTemplateData>[] {
    return sitemap.map(s => ({
      name: s.title,
      path: s.path,
      template: pageEntries[s.template]
    }));
  }

  private onRouteChange(route: RouterConfigRoute<PageTemplateData>): void {
    dataService.getPageData(route.path);
    this.setState({
      routeName: route.path
    });
  }

  render() {
    return (
      this.state.pageData && (
        <div className="App">
          <Router router={router} onRouteChange={this.onRouteChange.bind(this)}>
            {this.renderHeader()}
            <RouterOutlet data={this.state.pageData} />
          </Router>
        </div>
      )
    );
  }

  private renderHeader(): React.ReactNode {
    return (
      <div>
        <pre>{this.state.routeName}</pre>
        <Link to={'/'}>Home</Link>
        <span> - </span>
        <Link to={'/filmes-comedia/g'}>Category</Link>
        <hr />
      </div>
    );
  }
}

export default App;
